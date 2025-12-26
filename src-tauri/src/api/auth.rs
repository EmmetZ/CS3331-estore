use crate::error::AppError;
use crate::model::ApiResponse;
use crate::APP;

#[tauri::command]
pub async fn login(username: String, password: String) -> Result<ApiResponse<()>, AppError> {
    APP.login(username, password).await
}

#[tauri::command]
pub async fn logout() -> Result<ApiResponse<()>, AppError> {
    APP.logout().await
}

#[tauri::command]
pub async fn register(
    username: String,
    email: String,
    password: String,
) -> Result<ApiResponse<()>, AppError> {
    APP.register(username, email, password).await
}

#[tauri::command]
pub async fn refresh_token() -> Result<ApiResponse<()>, AppError> {
    APP.refresh_tokens().await
}
