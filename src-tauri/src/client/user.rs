use crate::{
    client::Client,
    error::AppError,
    model::{ApiResponse, User},
};

impl Client {
    pub async fn get_me(&self) -> Result<ApiResponse<User>, AppError> {
        let header = self.access_header().await?;
        let resp = self
            .get::<User, _>("/user/me", None::<()>.as_ref(), Some(header))
            .await?;

        if resp.data.is_none() {
            Err(AppError::api(resp.code, resp.message))
        } else {
            Ok(resp)
        }
    }
}
