use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

impl LoginRequest {
    pub fn new(username: &str, password: &str) -> Self {
        Self {
            username: username.to_string(),
            password: password.to_string(),
        }
    }
}

#[derive(Debug, Serialize)]
pub struct RegisterRequest {
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct AuthTokensResponse {
    pub access_token: String,
    pub refresh_token: String,
    #[serde(default = "default_token_type")]
    pub token_type: String,
    pub expires_in: u64,
}

fn default_token_type() -> String {
    "Bearer".to_string()
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ApiResponse<T> {
    pub code: u16,
    pub message: String,
    pub success: bool,
    pub data: Option<T>,
}

impl<T> ApiResponse<T> {
    pub fn new(code: u16, message: String, success: bool, data: Option<T>) -> Self {
        ApiResponse {
            code,
            message,
            success,
            data,
        }
    }
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct User {
    pub id: u32,
    pub username: String,
    pub email: String,
    pub phone: String,
    pub address: String,
    pub is_admin: bool,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct PartialUser {
    pub id: u32,
    pub username: String,
    pub email: String,
    pub is_admin: bool,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct UpdateUserPayload {
    pub username: String,
    pub email: String,
    pub phone: String,
    pub address: String,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Product {
    pub id: u32,
    pub name: String,
    pub description: String,
    pub price: i32,
    pub seller: Option<Seller>,
}

#[derive(Clone, Debug, Deserialize, Serialize)]
pub struct Seller {
    pub id: u32,
    pub username: String,
    pub email: String,
    pub phone: Option<String>,
    pub address: Option<String>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ProductPayload {
    pub name: String,
    pub description: String,
    pub price: i32,
}

#[derive(Default, Debug, Deserialize, Serialize)]
pub struct ProductQuery {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub q: Option<String>,
}
