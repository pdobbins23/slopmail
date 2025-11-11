use async_trait::async_trait;
use anyhow::{Result, anyhow};

use crate::db::{Account, ComposeEmail, EmailAddress};
use super::EmailProtocol;

pub struct SmtpHandler;

impl SmtpHandler {
    pub fn new() -> Self {
        Self
    }
}

#[async_trait]
impl EmailProtocol for SmtpHandler {
    async fn test_connection(&self, _account: &Account) -> Result<bool> {
        // For now, always return true
        Ok(true)
    }

    async fn fetch_folders(&self, _account: &Account) -> Result<Vec<crate::db::Folder>> {
        Err(anyhow!("SMTP cannot fetch folders"))
    }

    async fn fetch_emails(&self, _account: &Account, _folder: &crate::db::Folder, _limit: u32, _offset: u32) -> Result<Vec<crate::db::Email>> {
        Err(anyhow!("SMTP cannot fetch emails"))
    }

    async fn send_email(&self, _account: &Account, _email: &ComposeEmail) -> Result<String> {
        // For now, return a mock message ID
        Ok(format!("<mock-{}@slopmail.dev>", uuid::Uuid::new_v4()))
    }

    async fn mark_read(&self, _account: &Account, _email_id: &str) -> Result<()> {
        Err(anyhow!("SMTP cannot mark emails as read"))
    }

    async fn delete_email(&self, _account: &Account, _email_id: &str) -> Result<()> {
        Err(anyhow!("SMTP cannot delete emails"))
    }
}