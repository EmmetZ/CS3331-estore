use crate::{
    error::AppError,
    model::{ApiResponse, PartialUser, UpdateUserPayload, User},
    APP,
};

#[tauri::command]
pub async fn get_me() -> Result<ApiResponse<User>, AppError> {
    APP.get_me().await
}

#[tauri::command]
pub async fn update_user(payload: UpdateUserPayload) -> Result<ApiResponse<User>, AppError> {
    APP.update_user(payload).await
}

#[tauri::command]
pub async fn get_all_users() -> Result<ApiResponse<Vec<PartialUser>>, AppError> {
    APP.get_all_users().await
}
