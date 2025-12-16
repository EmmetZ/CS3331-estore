use crate::{
    error::AppError,
    model::{ApiResponse, User},
    APP,
};

#[tauri::command]
pub async fn get_me() -> Result<ApiResponse<User>, AppError> {
    APP.get_me().await
}
