use crate::client::constant::BASE_URL;
use crate::client::token::TokenStore;
use crate::error::AppError;
use crate::model::ApiResponse;
use serde::de::DeserializeOwned;
use serde::Serialize;
use std::time::Duration;
use tokio::sync::RwLock;

mod auth;
mod constant;
mod product;
mod token;
mod user;

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

    pub async fn access_header(&self) -> Result<String, AppError> {
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
    ) -> Result<ApiResponse<TResult>, AppError>
    where
        TBody: Serialize + ?Sized,
        TResult: DeserializeOwned,
    {
        let url = format!("{}{}", self.base_url, path.trim_end_matches('/'));
        let mut request = self.http.post(url).json(body);
        if let Some(header) = auth_header {
            request = request.header(reqwest::header::AUTHORIZATION, header);
        }
        let response = request.send().await?;
        self.get_resp(response).await
    }

    pub async fn get<TResult, TQuery>(
        &self,
        path: &str,
        query: Option<&TQuery>,
        auth_header: Option<String>,
    ) -> Result<ApiResponse<TResult>, AppError>
    where
        TQuery: Serialize + ?Sized,
        TResult: DeserializeOwned,
    {
        let url = format!("{}{}", self.base_url, path.trim_end_matches('/'));
        let mut request = self.http.get(url);
        if let Some(query) = query {
            request = request.query(query);
        }
        if let Some(header) = auth_header {
            request = request.header(reqwest::header::AUTHORIZATION, header);
        }

        let response = request.send().await?;
        self.get_resp(response).await
    }

    pub async fn put<TBody, TResult>(
        &self,
        path: &str,
        body: &TBody,
        auth_header: Option<String>,
    ) -> Result<ApiResponse<TResult>, AppError>
    where
        TBody: Serialize + ?Sized,
        TResult: DeserializeOwned,
    {
        let url = format!("{}{}", self.base_url, path.trim_end_matches('/'));
        let mut request = self.http.put(url).json(body);
        if let Some(header) = auth_header {
            request = request.header(reqwest::header::AUTHORIZATION, header);
        }

        let response = request.send().await?;
        self.get_resp(response).await
    }

    pub async fn delete<TResult>(
        &self,
        path: &str,
        auth_header: Option<String>,
    ) -> Result<ApiResponse<TResult>, AppError>
    where
        TResult: DeserializeOwned,
    {
        let url = format!("{}{}", self.base_url, path.trim_end_matches('/'));
        let mut request = self.http.delete(url);
        if let Some(header) = auth_header {
            request = request.header(reqwest::header::AUTHORIZATION, header);
        }

        let response = request.send().await?;
        self.get_resp(response).await
    }

    async fn get_resp<T>(&self, resp: reqwest::Response) -> Result<ApiResponse<T>, AppError>
    where
        T: DeserializeOwned,
    {
        let status = resp.status();
        let text = resp.text().await?;
        let api_response: ApiResponse<T> =
            serde_json::from_str(&text).map_err(|source| AppError::response_parse(text, source))?;

        if !status.is_success() || !api_response.success {
            let code = if api_response.code == 0 {
                status.as_u16()
            } else {
                api_response.code
            };
            return Err(AppError::api(code, api_response.message));
        }

        Ok(api_response)
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
}
