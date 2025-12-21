use crate::client::constant::BASE_URL;
use crate::client::token::TokenStore;
use crate::error::AppError;
use crate::model::ApiResponse;
use reqwest::StatusCode;
use serde::de::DeserializeOwned;
use serde::Serialize;
use std::time::Duration;
use tokio::sync::RwLock;

mod auth;
mod constant;
mod product;
mod token;
mod user;

const MAX_REFRESH_ATTEMPTS: usize = 3;

pub struct Client {
    http: reqwest::Client,
    base_url: String,
    tokens: RwLock<token::Tokens>,
    store: token::TokenStore,
}

impl Client {
    pub fn new() -> Self {
        let http = reqwest::Client::builder()
            .timeout(Duration::from_secs(30))
            .build()
            .expect("failed to build HTTP client");
        let store = TokenStore::new().expect("failed to initialize token store");
        let base_url = BASE_URL.into();

        Client {
            http,
            base_url,
            tokens: RwLock::new(token::Tokens::default()),
            store,
        }
    }

    pub async fn auth_header(&self) -> Result<String, AppError> {
        self.get_header(false).await
    }

    pub async fn refresh_header(&self) -> Result<String, AppError> {
        self.get_header(true).await
    }

    async fn get_header(&self, use_refresh: bool) -> Result<String, AppError> {
        if let Some(header) = self.tokens.read().await.header_value(use_refresh) {
            return Ok(header);
        }

        self.reload_tokens_from_store().await?;

        let guard = self.tokens.read().await;
        guard
            .header_value(use_refresh)
            .ok_or(AppError::missing_tokens(use_refresh))
    }

    pub async fn post<TBody, TResult>(
        &self,
        path: &str,
        body: &TBody,
        auth_header: Option<String>,
        retry_on_auth_failure: bool,
    ) -> Result<ApiResponse<TResult>, AppError>
    where
        TBody: Serialize + ?Sized,
        TResult: DeserializeOwned,
    {
        let url = format!("{}{}", self.base_url, path.trim_end_matches('/'));
        self.send(auth_header, retry_on_auth_failure, |client, header| {
            let mut request = client.post(&url).json(body);
            if let Some(ref header_value) = header {
                request = request.header(reqwest::header::AUTHORIZATION, header_value);
            }
            request
        })
        .await
    }

    pub async fn get<TResult, TQuery>(
        &self,
        path: &str,
        query: Option<&TQuery>,
        auth_header: Option<String>,
        retry_on_auth_failure: bool,
    ) -> Result<ApiResponse<TResult>, AppError>
    where
        TQuery: Serialize + ?Sized,
        TResult: DeserializeOwned,
    {
        let url = format!("{}{}", self.base_url, path.trim_end_matches('/'));
        let query_value = match query {
            Some(value) => Some(serde_json::to_value(value)?),
            None => None,
        };
        self.send(auth_header, retry_on_auth_failure, |client, header| {
            let mut request = client.get(&url);
            if let Some(ref query) = query_value {
                request = request.query(query);
            }
            if let Some(ref header_value) = header {
                request = request.header(reqwest::header::AUTHORIZATION, header_value);
            }
            request
        })
        .await
    }

    pub async fn put<TBody, TResult>(
        &self,
        path: &str,
        body: &TBody,
        auth_header: Option<String>,
        retry_on_auth_failure: bool,
    ) -> Result<ApiResponse<TResult>, AppError>
    where
        TBody: Serialize + ?Sized,
        TResult: DeserializeOwned,
    {
        let url = format!("{}{}", self.base_url, path.trim_end_matches('/'));
        self.send(auth_header, retry_on_auth_failure, |client, header| {
            let mut request = client.put(&url).json(body);
            if let Some(ref header_value) = header {
                request = request.header(reqwest::header::AUTHORIZATION, header_value);
            }
            request
        })
        .await
    }

    pub async fn delete<TResult>(
        &self,
        path: &str,
        auth_header: Option<String>,
        retry_on_auth_failure: bool,
    ) -> Result<ApiResponse<TResult>, AppError>
    where
        TResult: DeserializeOwned,
    {
        let url = format!("{}{}", self.base_url, path.trim_end_matches('/'));
        self.send(auth_header, retry_on_auth_failure, |client, header| {
            let mut request = client.delete(&url);
            if let Some(ref header_value) = header {
                request = request.header(reqwest::header::AUTHORIZATION, header_value);
            }
            request
        })
        .await
    }

    async fn reload_tokens_from_store(&self) -> Result<(), AppError> {
        match self.store.load().await {
            Ok(tokens) => {
                let mut guard = self.tokens.write().await;
                *guard = tokens;
                Ok(())
            }
            Err(err) => {
                eprintln!("failed to load stored tokens: {err}");
                Err(err)
            }
        }
    }

    async fn parse_response<T>(
        &self,
        resp: reqwest::Response,
    ) -> Result<(StatusCode, ApiResponse<T>), AppError>
    where
        T: DeserializeOwned,
    {
        let status = resp.status();
        let text = resp.text().await?;
        let api_response: ApiResponse<T> =
            serde_json::from_str(&text).map_err(|source| AppError::response_parse(text, source))?;

        Ok((status, api_response))
    }

    async fn send<TResult, F>(
        &self,
        auth_header: Option<String>,
        retry: bool,
        build_fn: F,
    ) -> Result<ApiResponse<TResult>, AppError>
    where
        TResult: DeserializeOwned,
        F: Fn(&reqwest::Client, Option<String>) -> reqwest::RequestBuilder,
    {
        let mut header = auth_header;
        let mut refresh_attempts = 0;

        loop {
            let request = build_fn(&self.http, header.clone());
            let response = request.send().await?;
            let (status, api_response) = self.parse_response(response).await?;

            if status.is_success() && api_response.success {
                return Ok(api_response);
            }

            if retry
                && header.is_some()
                && refresh_attempts < MAX_REFRESH_ATTEMPTS
                && self.is_auth_error(status)
            {
                self.refresh_tokens().await?;
                header = Some(self.auth_header().await?);
                refresh_attempts += 1;
                continue;
            }

            return Err(AppError::api(status.as_u16(), api_response.message));
        }
    }

    pub async fn do_post<TBody, TResult>(
        &self,
        url: &str,
        body: &TBody,
        header: Option<String>,
    ) -> Result<(StatusCode, ApiResponse<TResult>), AppError>
    where
        TBody: Serialize + ?Sized,
        TResult: DeserializeOwned,
    {
        let mut request = self.http.post(url).json(body);
        if let Some(ref header_value) = header {
            request = request.header(reqwest::header::AUTHORIZATION, header_value);
        }

        let response = request.send().await?;
        self.parse_response(response).await
    }

    fn is_auth_error(&self, status: StatusCode) -> bool {
        matches!(status, StatusCode::UNAUTHORIZED | StatusCode::FORBIDDEN)
    }
}
