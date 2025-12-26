use super::{token, Client};
use crate::error::AppError;
use crate::model::{ApiResponse, AuthTokensResponse, LoginRequest, RegisterRequest};
use serde_json::json;
use tracing::debug;

impl Client {
    pub async fn login(&self, username: &str, password: &str) -> Result<ApiResponse<()>, AppError> {
        let payload = LoginRequest::new(username, password);
        let response: ApiResponse<AuthTokensResponse> =
            self.post("/login", &payload, None, false).await?;
        let data = response
            .data
            .ok_or_else(|| AppError::api(response.code, response.message.clone()))?;
        let tokens = token::Tokens::from(data);
        self.persist_tokens(tokens).await?;
        Ok(ApiResponse::new(
            response.code,
            response.message,
            response.success,
            None,
        ))
    }

    pub async fn register(
        &self,
        username: &str,
        email: &str,
        password: &str,
    ) -> Result<ApiResponse<()>, AppError> {
        let payload = RegisterRequest {
            username: username.to_string(),
            email: email.to_string(),
            password: password.to_string(),
        };
        let response: ApiResponse<()> = self.post("/register", &payload, None, false).await?;
        Ok(response)
    }

    pub async fn logout(&self) -> Result<ApiResponse<()>, AppError> {
        let header = self.auth_header().await?;
        let resp: ApiResponse<()> = self
            .post("/logout", &json!({}), Some(header), false)
            .await?;
        self.clear_tokens().await?;
        Ok(resp)
    }

    pub async fn refresh_tokens(&self) -> Result<ApiResponse<()>, AppError> {
        debug!("refreshing authentication tokens");
        let header = self.refresh_header().await?;
        let url = format!("{}{}", self.base_url, "/refresh");
        let (_, response): (reqwest::StatusCode, ApiResponse<AuthTokensResponse>) = self
            .do_post(
                &url,
                &json!({
                    "refresh_token": header,
                }),
                Some(header),
            )
            .await?;

        let data = response
            .data
            .ok_or_else(|| AppError::api(response.code, response.message.clone()))?;
        let tokens = token::Tokens::from(data);
        self.persist_tokens(tokens).await?;
        Ok(ApiResponse::new(
            response.code,
            response.message,
            response.success,
            None,
        ))
    }

    async fn persist_tokens(&self, tokens: token::Tokens) -> Result<(), AppError> {
        self.store.save(&tokens).await?;
        {
            let mut guard = self.tokens.write().await;
            *guard = tokens;
        }
        Ok(())
    }

    async fn clear_tokens(&self) -> Result<(), AppError> {
        {
            let mut guard = self.tokens.write().await;
            *guard = token::Tokens::default();
        }
        self.store.clear().await?;
        Ok(())
    }
}
