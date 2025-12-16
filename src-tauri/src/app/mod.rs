use crate::client::Client;
use crate::error::AppError;
use crate::model::{ApiResponse, Product, ProductPayload, User};
use std::sync::Arc;
use tokio::sync::RwLock;

pub struct App {
    client: Arc<Client>,
    user: RwLock<Option<User>>,
}

impl App {
    pub fn new() -> Self {
        App {
            client: Arc::new(Client::new()),
            user: RwLock::new(None),
        }
    }

    pub async fn login(
        &self,
        username: String,
        password: String,
    ) -> Result<ApiResponse<()>, AppError> {
        self.client.login(&username, &password).await
    }

    pub async fn logout(&self) -> Result<ApiResponse<()>, AppError> {
        let resp = self.client.logout().await?;
        let mut guard = self.user.write().await;
        *guard = None;
        Ok(resp)
    }

    pub async fn refresh_tokens(&self) -> Result<ApiResponse<()>, AppError> {
        self.client.refresh_tokens().await
    }

    pub async fn get_me(&self) -> Result<ApiResponse<User>, AppError> {
        let resp = self.client.get_me().await?;
        if self.user.read().await.is_none() {
            if resp.data.is_some() {
                let mut guard = self.user.write().await;
                *guard = resp.data.clone();
                return Ok(resp);
            } else {
                return Err(AppError::api(resp.code, resp.message));
            }
        }
        Ok(resp)
    }

    pub async fn search_products(
        &self,
        keyword: Option<String>,
    ) -> Result<ApiResponse<Vec<Product>>, AppError> {
        self.client.search_products(keyword).await
    }

    pub async fn create_product(
        &self,
        payload: ProductPayload,
    ) -> Result<ApiResponse<Product>, AppError> {
        self.client.create_product(&payload).await
    }

    pub async fn update_product(
        &self,
        product_id: u32,
        payload: ProductPayload,
    ) -> Result<ApiResponse<Product>, AppError> {
        self.client.update_product(product_id, &payload).await
    }

    pub async fn delete_product(&self, product_id: u32) -> Result<ApiResponse<()>, AppError> {
        self.client.delete_product(product_id).await
    }
}
