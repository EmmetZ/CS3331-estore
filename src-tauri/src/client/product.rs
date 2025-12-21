use crate::{
    client::Client,
    error::AppError,
    model::{ApiResponse, Product, ProductPayload, ProductQuery},
};

impl Client {
    pub async fn search_products(
        &self,
        keyword: Option<String>,
    ) -> Result<ApiResponse<Vec<Product>>, AppError> {
        let header = self.auth_header().await?;
        let trimmed = keyword.and_then(|val| {
            let value = val.trim().to_string();
            if value.is_empty() {
                None
            } else {
                Some(value)
            }
        });
        let query = ProductQuery { q: trimmed };
        let query_ref = if query.q.is_some() {
            Some(&query)
        } else {
            None
        };

        self.get("/product", query_ref, Some(header), true).await
    }

    pub async fn create_product(
        &self,
        payload: &ProductPayload,
    ) -> Result<ApiResponse<Product>, AppError> {
        let header = self.auth_header().await?;
        self.post("/product", payload, Some(header), true).await
    }

    pub async fn update_product(
        &self,
        product_id: u32,
        payload: &ProductPayload,
    ) -> Result<ApiResponse<Product>, AppError> {
        let header = self.auth_header().await?;
        let path = format!("/product/{}", product_id);
        self.put(&path, payload, Some(header), true).await
    }

    pub async fn delete_product(&self, product_id: u32) -> Result<ApiResponse<()>, AppError> {
        let header = self.auth_header().await?;
        let path = format!("/product/{}", product_id);
        self.delete::<()>(&path, Some(header), true).await
    }
}
