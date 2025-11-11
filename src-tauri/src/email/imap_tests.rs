#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::{Account, Folder, Email};

    #[tokio::test]
    async fn test_imap_connection() {
        let handler = ImapHandler::new();
        let account = Account {
            id: 1,
            name: "Test Account".to_string(),
            email: "test@example.com".to_string(),
            protocol: "IMAP".to_string(),
            imap_server: Some("imap.example.com".to_string()),
            imap_port: Some(993),
            smtp_server: Some("smtp.example.com".to_string()),
            smtp_port: Some(587),
            jmap_url: None,
            username: "test@example.com".to_string(),
            password_encrypted: "password".to_string(),
            use_ssl: true,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        };

        let result = handler.test_connection(&account).await;
        assert!(result.is_ok());
        assert!(result.unwrap());
    }

    #[tokio::test]
    async fn test_fetch_folders() {
        let handler = ImapHandler::new();
        let account = Account {
            id: 1,
            name: "Test Account".to_string(),
            email: "test@example.com".to_string(),
            protocol: "IMAP".to_string(),
            imap_server: Some("imap.example.com".to_string()),
            imap_port: Some(993),
            smtp_server: Some("smtp.example.com".to_string()),
            smtp_port: Some(587),
            jmap_url: None,
            username: "test@example.com".to_string(),
            password_encrypted: "password".to_string(),
            use_ssl: true,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        };

        let folders = handler.fetch_folders(&account).await.unwrap();
        assert!(!folders.is_empty());
        assert_eq!(folders.len(), 4); // INBOX, SENT, DRAFTS, TRASH
        
        // Check that INBOX is present
        let inbox = folders.iter().find(|f| f.name == "INBOX");
        assert!(inbox.is_some());
    }

    #[tokio::test]
    async fn test_fetch_emails() {
        let handler = ImapHandler::new();
        let account = Account {
            id: 1,
            name: "Test Account".to_string(),
            email: "test@example.com".to_string(),
            protocol: "IMAP".to_string(),
            imap_server: Some("imap.example.com".to_string()),
            imap_port: Some(993),
            smtp_server: Some("smtp.example.com".to_string()),
            smtp_port: Some(587),
            jmap_url: None,
            username: "test@example.com".to_string(),
            password_encrypted: "password".to_string(),
            use_ssl: true,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        };

        let folder = Folder {
            id: 1,
            account_id: 1,
            name: "INBOX".to_string(),
            display_name: "Inbox".to_string(),
            folder_type: "INBOX".to_string(),
            message_count: 0,
            unread_count: 0,
            uid_validity: None,
            uid_next: None,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        };

        let emails = handler.fetch_emails(&account, &folder, 10, 0).await.unwrap();
        assert_eq!(emails.len(), 10);
        
        // Check email properties
        let first_email = &emails[0];
        assert!(!first_email.subject.is_empty());
        assert!(!first_email.from_address.is_empty());
        assert!(first_email.body_text.is_some());
    }

    #[tokio::test]
    async fn test_mark_read() {
        let handler = ImapHandler::new();
        let account = Account {
            id: 1,
            name: "Test Account".to_string(),
            email: "test@example.com".to_string(),
            protocol: "IMAP".to_string(),
            imap_server: Some("imap.example.com".to_string()),
            imap_port: Some(993),
            smtp_server: Some("smtp.example.com".to_string()),
            smtp_port: Some(587),
            jmap_url: None,
            username: "test@example.com".to_string(),
            password_encrypted: "password".to_string(),
            use_ssl: true,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        };

        let result = handler.mark_read(&account, "123").await;
        assert!(result.is_ok());
    }

    #[tokio::test]
    async fn test_delete_email() {
        let handler = ImapHandler::new();
        let account = Account {
            id: 1,
            name: "Test Account".to_string(),
            email: "test@example.com".to_string(),
            protocol: "IMAP".to_string(),
            imap_server: Some("imap.example.com".to_string()),
            imap_port: Some(993),
            smtp_server: Some("smtp.example.com".to_string()),
            smtp_port: Some(587),
            jmap_url: None,
            username: "test@example.com".to_string(),
            password_encrypted: "password".to_string(),
            use_ssl: true,
            created_at: chrono::Utc::now(),
            updated_at: chrono::Utc::now(),
        };

        let result = handler.delete_email(&account, "123").await;
        assert!(result.is_ok());
    }
}