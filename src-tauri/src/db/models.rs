use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Account {
    pub id: i64,
    pub name: String,
    pub email: String,
    pub protocol: String, // "IMAP", "JMAP", "POP3"
    pub imap_server: Option<String>,
    pub imap_port: Option<i32>,
    pub smtp_server: Option<String>,
    pub smtp_port: Option<i32>,
    pub jmap_url: Option<String>,
    pub username: String,
    pub password_encrypted: String, // Encrypted with master password
    pub use_ssl: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Folder {
    pub id: i64,
    pub account_id: i64,
    pub name: String,
    pub display_name: String,
    pub folder_type: String, // "INBOX", "SENT", "DRAFTS", "TRASH", "SPAM", "CUSTOM"
    pub message_count: i32,
    pub unread_count: i32,
    pub uid_validity: Option<i64>, // IMAP specific
    pub uid_next: Option<i64>,     // IMAP specific
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, sqlx::FromRow)]
pub struct Email {
    pub id: i64,
    pub account_id: i64,
    pub folder_id: i64,
    pub message_id: String, // Unique message identifier
    pub thread_id: Option<String>, // For threading
    pub subject: String,
    pub from_address: String,
    pub from_name: Option<String>,
    pub to_addresses: String, // JSON array
    pub cc_addresses: Option<String>, // JSON array
    pub bcc_addresses: Option<String>, // JSON array
    pub body_text: Option<String>, // Plain text body (encrypted)
    pub body_html: Option<String>, // HTML body (encrypted)
    pub attachments: Option<String>, // JSON array of attachment info
    pub size_bytes: i64,
    pub internal_date: DateTime<Utc>,
    pub received_date: DateTime<Utc>,
    pub is_read: bool,
    pub is_flagged: bool,
    pub is_answered: bool,
    pub is_draft: bool,
    pub is_deleted: bool,
    pub uid: Option<i64>, // IMAP specific
    pub mod_seq: Option<i64>, // IMAP specific
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailAddress {
    pub name: Option<String>,
    pub address: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Attachment {
    pub id: String,
    pub filename: String,
    pub content_type: String,
    pub size_bytes: i64,
    pub content_id: Option<String>,
    pub is_inline: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComposeEmail {
    pub account_id: i64,
    pub to: Vec<EmailAddress>,
    pub cc: Option<Vec<EmailAddress>>,
    pub bcc: Option<Vec<EmailAddress>>,
    pub subject: String,
    pub body_text: Option<String>,
    pub body_html: Option<String>,
    pub attachments: Vec<Attachment>,
    pub in_reply_to: Option<String>,
    pub references: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SyncState {
    pub account_id: i64,
    pub folder_id: i64,
    pub last_uid: Option<i64>,
    pub last_mod_seq: Option<i64>,
    pub last_sync: DateTime<Utc>,
    pub sync_token: Option<String>, // JMAP specific
}