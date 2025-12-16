use super::{token, Client};
use crate::error::AppError;
use crate::model::{ApiResponse, AuthTokensResponse, LoginRequest};
use serde_json::json;

impl Client {
    pub async fn login(&self, username: &str, password: &str) -> Result<ApiResponse<()>, AppError> {
        let payload = LoginRequest::new(username, password);
        let response: ApiResponse<AuthTokensResponse> = self.post("/login", &payload, None).await?;
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

    pub async fn logout(&self) -> Result<ApiResponse<()>, AppError> {
        let header = self.access_header().await?;
        let resp: ApiResponse<()> = self.post("/logout", &json!({}), Some(header)).await?;
        self.clear_tokens().await?;
        Ok(resp)
    }

    pub async fn refresh_tokens(&self) -> Result<ApiResponse<()>, AppError> {
        let header = self.refresh_header().await?;
        let response: ApiResponse<AuthTokensResponse> =
            self.post("/refresh", &json!({}), Some(header)).await?;
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
