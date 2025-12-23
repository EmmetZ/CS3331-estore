use crate::{
    client::Client,
    error::AppError,
    model::{ApiResponse, UpdateUserPayload, User},
};

impl Client {
    pub async fn get_me(&self) -> Result<ApiResponse<User>, AppError> {
        let header = self.auth_header().await?;
        let resp = self
            .get::<(), User>("/user/me", None, Some(header), true)
            .await?;

        if resp.data.is_none() {
            Err(AppError::api(resp.code, resp.message))
        } else {
            Ok(resp)
        }
    }

    pub async fn update_user(
        &self,
        payload: &UpdateUserPayload,
    ) -> Result<ApiResponse<User>, AppError> {
        let header = self.auth_header().await?;
        self.put("/user/me", payload, Some(header), true).await
    }
}
