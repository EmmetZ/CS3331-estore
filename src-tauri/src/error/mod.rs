#[derive(Debug, thiserror::Error)]
pub enum AppError {
    #[error(transparent)]
    Io(#[from] std::io::Error),
    #[error(transparent)]
    Network(#[from] reqwest::Error),
    #[error(transparent)]
    Database(#[from] sqlx::Error),
    #[error(transparent)]
    Crypto(#[from] aes_gcm::aead::Error),
    #[error(transparent)]
    Serialization(#[from] serde_json::Error),
    #[error("stored credentials are corrupted; please login again")]
    CorruptedStore,
    #[error("server responded with error {code}: {message}")]
    Api { code: u16, message: String },
    #[error("failed to parse server response: {source}")]
    ResponseParse {
        raw: String,
        #[source]
        source: serde_json::Error,
    },
    #[error("missing {kind} token; please login first")]
    MissingToken { kind: &'static str },
}

impl AppError {
    pub fn api(code: u16, message: String) -> Self {
        Self::Api { code, message }
    }

    pub fn response_parse(raw: String, source: serde_json::Error) -> Self {
        Self::ResponseParse { raw, source }
    }

    pub fn missing_tokens(refresh: bool) -> Self {
        let kind = if refresh { "refresh" } else { "access" };
        Self::MissingToken { kind }
    }

    pub fn corrupted_store() -> Self {
        Self::CorruptedStore
    }
}

impl serde::Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
