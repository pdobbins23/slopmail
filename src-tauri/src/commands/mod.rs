use serde::{Deserialize, Serialize};
use tauri::State;
use std::sync::Arc;
use anyhow::Result;

use crate::db::{DbPool, Account, Folder, Email, ComposeEmail, EmailAddress};
use crate::email::{EmailProtocol, ImapHandler, SmtpHandler};

pub type AppState = Arc<DbPool>;

#[derive(Debug, Serialize, Deserialize)]
pub struct AddAccountRequest {
    name: String,
    email: String,
    protocol: String,
    imap_server: Option<String>,
    imap_port: Option<i32>,
    smtp_server: Option<String>,
    smtp_port: Option<i32>,
    username: String,
    password: String,
    use_ssl: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TestAccountRequest {
    protocol: String,
    imap_server: Option<String>,
    imap_port: Option<i32>,
    smtp_server: Option<String>,
    smtp_port: Option<i32>,
    username: String,
    password: String,
    use_ssl: bool,
}

#[tauri::command]
pub async fn add_account(
    pool: State<'_, AppState>,
    request: AddAccountRequest,
) -> Result<Account, String> {
    let account = Account {
        id: 0, // Will be set by database
        name: request.name,
        email: request.email,
        protocol: request.protocol,
        imap_server: request.imap_server,
        imap_port: request.imap_port,
        smtp_server: request.smtp_server,
        smtp_port: request.smtp_port,
        jmap_url: None,
        username: request.username,
        password_encrypted: request.password, // TODO: Encrypt with master password
        use_ssl: request.use_ssl,
        created_at: chrono::Utc::now(),
        updated_at: chrono::Utc::now(),
    };

    // For now, return a mock account
    let mut created_account = account;
    created_account.id = 1;

    Ok(created_account)
}

#[tauri::command]
pub async fn get_accounts(pool: State<'_, AppState>) -> Result<Vec<Account>, String> {
    // For now, return empty list
    Ok(vec![])
}

#[tauri::command]
pub async fn test_account_connection(request: TestAccountRequest) -> Result<bool, String> {
    let protocol = request.protocol.clone();
    let account = Account {
        id: 0,
        name: "Test".to_string(),
        email: "test@example.com".to_string(),
        protocol: request.protocol.clone(),
        imap_server: request.imap_server,
        imap_port: request.imap_port,
        smtp_server: request.smtp_server,
        smtp_port: request.smtp_port,
        jmap_url: None,
        username: request.username,
        password_encrypted: request.password,
        use_ssl: request.use_ssl,
        created_at: chrono::Utc::now(),
        updated_at: chrono::Utc::now(),
    };

    match protocol.as_str() {
        "IMAP" => {
            let handler = ImapHandler::new();
            handler.test_connection(&account).await
                .map_err(|e| format!("IMAP connection test failed: {}", e))
        }
        _ => Err("Unsupported protocol for testing".to_string()),
    }
}

#[tauri::command]
pub async fn sync_folders(
    pool: State<'_, AppState>,
    account_id: i64,
) -> Result<Vec<Folder>, String> {
    // For now, return mock folders
    Ok(vec![
        Folder {
            id: 1,
            account_id,
            name: "INBOX".to_string(),
            display_name: "Inbox".to_string(),
            folder_type: "INBOX".to_string(),
            message_count: 0,
            unread_count: 0,
            uid_validity: None,
            uid_next: None,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        },
        Folder {
            id: 2,
            account_id,
            name: "SENT".to_string(),
            display_name: "Sent".to_string(),
            folder_type: "SENT".to_string(),
            message_count: 0,
            unread_count: 0,
            uid_validity: None,
            uid_next: None,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        }
    ])
}

#[tauri::command]
pub async fn get_folders(
    pool: State<'_, AppState>,
    account_id: i64,
) -> Result<Vec<Folder>, String> {
    // For now, return mock folders
    Ok(vec![
        Folder {
            id: 1,
            account_id,
            name: "INBOX".to_string(),
            display_name: "Inbox".to_string(),
            folder_type: "INBOX".to_string(),
            message_count: 0,
            unread_count: 0,
            uid_validity: None,
            uid_next: None,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        }
    ])
}

#[tauri::command]
pub async fn fetch_emails(
    pool: State<'_, AppState>,
    account_id: i64,
    folder_id: i64,
    limit: Option<u32>,
    offset: Option<u32>,
) -> Result<Vec<Email>, String> {
    // For now, return mock emails
    Ok(vec![
        Email {
            id: 1,
            account_id,
            folder_id,
            message_id: "test-1@example.com".to_string(),
            thread_id: None,
            subject: "Welcome to SlopMail!".to_string(),
            from_address: "team@slopmail.dev".to_string(),
            from_name: Some("SlopMail Team".to_string()),
            to_addresses: serde_json::to_string(&vec![EmailAddress {
                name: None,
                address: "user@example.com".to_string(),
            }]).unwrap(),
            cc_addresses: None,
            bcc_addresses: None,
            body_text: Some("Welcome to SlopMail! This is a test email to demonstrate the email client functionality.".to_string()),
            body_html: None,
            attachments: None,
            size_bytes: 150,
            internal_date: chrono::Utc::now(),
            received_date: chrono::Utc::now(),
            is_read: false,
            is_flagged: false,
            is_answered: false,
            is_draft: false,
            is_deleted: false,
            uid: None,
            mod_seq: None,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        }
    ])
}

#[tauri::command]
pub async fn get_emails(
    pool: State<'_, AppState>,
    folder_id: i64,
    limit: Option<u32>,
    offset: Option<u32>,
) -> Result<Vec<Email>, String> {
    // For now, return mock emails
    Ok(vec![
        Email {
            id: 1,
            folder_id,
            account_id: 1,
            message_id: "test-1@example.com".to_string(),
            thread_id: None,
            subject: "Welcome to SlopMail!".to_string(),
            from_address: "team@slopmail.dev".to_string(),
            from_name: Some("SlopMail Team".to_string()),
            to_addresses: serde_json::to_string(&vec![EmailAddress {
                name: None,
                address: "user@example.com".to_string(),
            }]).unwrap(),
            cc_addresses: None,
            bcc_addresses: None,
            body_text: Some("Welcome to SlopMail! This is a test email to demonstrate the email client functionality.".to_string()),
            body_html: None,
            attachments: None,
            size_bytes: 150,
            internal_date: chrono::Utc::now(),
            received_date: chrono::Utc::now(),
            is_read: false,
            is_flagged: false,
            is_answered: false,
            is_draft: false,
            is_deleted: false,
            uid: None,
            mod_seq: None,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        }
    ])
}

#[tauri::command]
pub async fn send_email(
    pool: State<'_, AppState>,
    account_id: i64,
    to: Vec<String>,
    subject: String,
    body_text: Option<String>,
    body_html: Option<String>,
) -> Result<String, String> {
    // For now, just return a mock message ID
    Ok(format!("<mock-{}@slopmail.dev>", uuid::Uuid::new_v4()))
}

#[tauri::command]
pub async fn mark_email_read(
    pool: State<'_, AppState>,
    account_id: i64,
    email_id: String,
) -> Result<(), String> {
    // For now, just return success
    Ok(())
}

// Keep the original greet command for testing
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to SlopMail.", name)
}