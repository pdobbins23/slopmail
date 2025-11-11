use async_trait::async_trait;
use anyhow::Result;
use crate::db::{Account, Email, Folder};

#[async_trait]
pub trait EmailProtocol: Send + Sync {
    async fn test_connection(&self, account: &Account) -> Result<bool>;
    async fn fetch_folders(&self, account: &Account) -> Result<Vec<Folder>>;
    async fn fetch_emails(&self, account: &Account, folder: &Folder, limit: u32, offset: u32) -> Result<Vec<Email>>;
    async fn send_email(&self, account: &Account, email: &crate::db::ComposeEmail) -> Result<String>;
    async fn mark_read(&self, account: &Account, email_id: &str) -> Result<()>;
    async fn delete_email(&self, account: &Account, email_id: &str) -> Result<()>;
}

pub mod imap;
pub mod smtp;

pub use imap::ImapHandler;
pub use smtp::SmtpHandler;