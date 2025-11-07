use thiserror::Error;

#[derive(Error, Debug)]
pub enum SlopmailError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("IMAP error: {0}")]
    Imap(String),

    #[error("SMTP error: {0}")]
    Smtp(#[from] lettre::transport::smtp::Error),

    #[error("Email parsing error: {0}")]
    EmailParse(#[from] mailparse::MailParseError),

    #[error("Encryption error: {0}")]
    Encryption(String),

    #[error("Authentication failed")]
    AuthenticationFailed,

    #[error("Account not found: {0}")]
    AccountNotFound(String),

    #[error("Invalid configuration: {0}")]
    InvalidConfig(String),

    #[error("Network error: {0}")]
    Network(#[from] reqwest::Error),

    #[error("Search error: {0}")]
    Search(String),

    #[error("GPG error: {0}")]
    Gpg(String),

    #[error("OAuth error: {0}")]
    OAuth(String),

    #[error("Serialization error: {0}")]
    Serialization(#[from] serde_json::Error),

    #[error("{0}")]
    Other(String),
}

impl From<SlopmailError> for String {
    fn from(err: SlopmailError) -> Self {
        err.to_string()
    }
}

pub type Result<T> = std::result::Result<T, SlopmailError>;

