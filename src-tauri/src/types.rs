use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Account {
    pub id: String,
    pub email: String,
    pub display_name: String,
    pub protocol: ProtocolType,
    pub config: AccountConfig,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ProtocolType {
    Imap,
    Jmap,
    Pop3,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AccountConfig {
    // IMAP/POP3 config
    pub imap_host: Option<String>,
    pub imap_port: Option<u16>,
    pub imap_tls: Option<bool>,
    
    // SMTP config
    pub smtp_host: Option<String>,
    pub smtp_port: Option<u16>,
    pub smtp_tls: Option<bool>,
    
    // JMAP config
    pub jmap_url: Option<String>,
    
    // Credentials (encrypted)
    pub username: String,
    pub password_encrypted: String,
    
    // OAuth2
    pub oauth_provider: Option<String>,
    pub oauth_token_encrypted: Option<String>,
    pub oauth_refresh_token_encrypted: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Email {
    pub id: String,
    pub account_id: String,
    pub folder_id: String,
    pub message_id: String,
    pub subject: String,
    pub from_addr: String,
    pub from_name: Option<String>,
    pub to_addrs: Vec<EmailAddress>,
    pub cc_addrs: Vec<EmailAddress>,
    pub bcc_addrs: Vec<EmailAddress>,
    pub date: DateTime<Utc>,
    pub body_plain: Option<String>,
    pub body_html: Option<String>,
    pub body_encrypted: Option<Vec<u8>>,
    pub has_attachments: bool,
    pub is_read: bool,
    pub is_starred: bool,
    pub is_draft: bool,
    pub uid: u32,
    pub flags: Vec<String>,
    pub size: u32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailAddress {
    pub name: Option<String>,
    pub address: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Folder {
    pub id: String,
    pub account_id: String,
    pub name: String,
    pub path: String,
    pub folder_type: FolderType,
    pub parent_id: Option<String>,
    pub unread_count: i32,
    pub total_count: i32,
    pub uid_validity: Option<u32>,
    pub uid_next: Option<u32>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum FolderType {
    Inbox,
    Sent,
    Drafts,
    Trash,
    Spam,
    Archive,
    Custom,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Contact {
    pub id: String,
    pub email: String,
    pub name: Option<String>,
    pub photo: Option<Vec<u8>>,
    pub phone: Option<String>,
    pub organization: Option<String>,
    pub notes: Option<String>,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CalendarEvent {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub location: Option<String>,
    pub start_time: DateTime<Utc>,
    pub end_time: DateTime<Utc>,
    pub all_day: bool,
    pub attendees: Vec<String>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchQuery {
    pub query: String,
    pub folder_id: Option<String>,
    pub account_id: Option<String>,
    pub from: Option<String>,
    pub to: Option<String>,
    pub date_from: Option<DateTime<Utc>>,
    pub date_to: Option<DateTime<Utc>>,
    pub has_attachments: Option<bool>,
    pub is_unread: Option<bool>,
    pub limit: Option<usize>,
    pub offset: Option<usize>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SearchResult {
    pub email_id: String,
    pub score: f32,
    pub snippet: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SyncState {
    pub account_id: String,
    pub folder_id: String,
    pub last_sync: DateTime<Utc>,
    pub uid_validity: u32,
    pub uid_next: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ComposeEmail {
    pub to: Vec<EmailAddress>,
    pub cc: Vec<EmailAddress>,
    pub bcc: Vec<EmailAddress>,
    pub subject: String,
    pub body: String,
    pub is_html: bool,
    pub attachments: Vec<Attachment>,
    pub in_reply_to: Option<String>,
    pub references: Option<Vec<String>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Attachment {
    pub filename: String,
    pub content_type: String,
    pub size: usize,
    pub data: Vec<u8>,
}

