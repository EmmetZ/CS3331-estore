use std::fs;
use std::path::Path;

use aes_gcm::aead::{Aead, KeyInit};
use aes_gcm::{Aes256Gcm, Nonce};
use chrono::{DateTime, Duration, Utc};
use rand::rngs::OsRng;
use rand::RngCore;
use serde::{Deserialize, Serialize};
use sqlx::sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions};
use sqlx::{Row, SqlitePool};

use crate::error::AppError;
use crate::model::AuthTokensResponse;
use crate::utils::token_data_dir;

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Tokens {
    pub access_token: Option<String>,
    pub refresh_token: Option<String>,
    pub token_type: Option<String>,
    #[serde(with = "chrono::serde::ts_seconds_option")]
    pub expires_at: Option<DateTime<Utc>>,
}

impl Tokens {
    pub fn header_value(&self, use_refresh: bool) -> Option<String> {
        let token = if use_refresh {
            self.refresh_token.as_ref()
        } else {
            self.access_token.as_ref()
        }?;
        let token_type = self.token_type.as_deref().unwrap_or("Bearer");
        Some(format!("{} {}", token_type, token))
    }
}

impl From<AuthTokensResponse> for Tokens {
    fn from(value: AuthTokensResponse) -> Self {
        let expires_in = value.expires_in;
        let expires_at = if expires_in > 0 {
            Some(Utc::now() + Duration::seconds(expires_in as i64))
        } else {
            None
        };

        Tokens {
            access_token: Some(value.access_token),
            refresh_token: Some(value.refresh_token),
            token_type: Some(value.token_type),
            expires_at,
        }
    }
}

pub struct TokenStore {
    pool: SqlitePool,
    cipher: Aes256Gcm,
}

impl TokenStore {
    pub fn new() -> Result<Self, AppError> {
        let data_dir = token_data_dir();
        fs::create_dir_all(&data_dir)?;

        let db_path = data_dir.join("tokens.db");
        let key_path = data_dir.join("tokens.key");
        let key = load_or_create_key(&key_path)?;
        let cipher = Aes256Gcm::new_from_slice(&key).map_err(|_| AppError::corrupted_store())?;

        let options = SqliteConnectOptions::new()
            .filename(&db_path)
            .create_if_missing(true)
            .journal_mode(SqliteJournalMode::Wal);

        let pool = SqlitePoolOptions::new()
            .max_connections(1)
            .connect_lazy_with(options);

        Ok(Self { pool, cipher })
    }

    pub async fn load(&self) -> Result<Tokens, AppError> {
        self.ensure_schema().await?;
        let row = sqlx::query("SELECT payload, nonce FROM tokens WHERE id = 1")
            .fetch_optional(&self.pool)
            .await?;

        if let Some(row) = row {
            let payload: Vec<u8> = row.get("payload");
            let nonce: Vec<u8> = row.get("nonce");
            let plaintext = self.decrypt(&payload, &nonce)?;
            let tokens = serde_json::from_slice(&plaintext)?;
            Ok(tokens)
        } else {
            Ok(Tokens::default())
        }
    }

    pub async fn save(&self, tokens: &Tokens) -> Result<(), AppError> {
        self.ensure_schema().await?;
        if tokens.access_token.is_none() && tokens.refresh_token.is_none() {
            return self.clear().await;
        }

        let plaintext = serde_json::to_vec(tokens)?;
        let (ciphertext, nonce) = self.encrypt(&plaintext)?;

        sqlx::query(
            "INSERT INTO tokens (id, payload, nonce) VALUES (1, ?, ?)
             ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, nonce = excluded.nonce, updated_at = CURRENT_TIMESTAMP",
        )
        .bind(ciphertext)
        .bind(nonce)
        .execute(&self.pool)
        .await?;

        Ok(())
    }

    pub async fn clear(&self) -> Result<(), AppError> {
        self.ensure_schema().await?;
        sqlx::query("DELETE FROM tokens WHERE id = 1")
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    fn encrypt(&self, plaintext: &[u8]) -> Result<(Vec<u8>, Vec<u8>), AppError> {
        let mut nonce = [0u8; 12];
        OsRng.fill_bytes(&mut nonce);
        let ciphertext = self.cipher.encrypt(Nonce::from_slice(&nonce), plaintext)?;
        Ok((ciphertext, nonce.to_vec()))
    }

    fn decrypt(&self, payload: &[u8], nonce: &[u8]) -> Result<Vec<u8>, AppError> {
        if nonce.len() != 12 {
            return Err(AppError::corrupted_store());
        }
        Ok(self.cipher.decrypt(Nonce::from_slice(nonce), payload)?)
    }

    async fn ensure_schema(&self) -> Result<(), AppError> {
        sqlx::query(
            "CREATE TABLE IF NOT EXISTS tokens (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                payload BLOB NOT NULL,
                nonce BLOB NOT NULL,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )",
        )
        .execute(&self.pool)
        .await?;
        Ok(())
    }
}

fn load_or_create_key(path: &Path) -> Result<[u8; 32], AppError> {
    if path.exists() {
        let data = fs::read(path)?;
        if data.len() == 32 {
            let mut key = [0u8; 32];
            key.copy_from_slice(&data);
            return Ok(key);
        }
    }

    let mut key = [0u8; 32];
    OsRng.fill_bytes(&mut key);
    fs::write(path, &key)?;
    Ok(key)
}
