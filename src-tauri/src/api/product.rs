use crate::{
    error::AppError,
    model::{ApiResponse, Product, ProductPayload},
    APP,
};

#[tauri::command]
pub async fn get_product(product_id: u32) -> Result<ApiResponse<Product>, AppError> {
    APP.get_product(product_id).await
}

#[tauri::command]
pub async fn search_products(
    keyword: Option<String>,
) -> Result<ApiResponse<Vec<Product>>, AppError> {
    APP.search_products(keyword).await
}

#[tauri::command]
pub async fn create_product(payload: ProductPayload) -> Result<ApiResponse<Product>, AppError> {
    APP.create_product(payload).await
}

#[tauri::command]
pub async fn update_product(
    product_id: u32,
    payload: ProductPayload,
) -> Result<ApiResponse<Product>, AppError> {
    APP.update_product(product_id, payload).await
}

#[tauri::command]
pub async fn delete_product(product_id: u32) -> Result<ApiResponse<()>, AppError> {
    APP.delete_product(product_id).await
}
