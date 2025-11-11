-- Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    protocol TEXT NOT NULL CHECK (protocol IN ('IMAP', 'JMAP', 'POP3')),
    imap_server TEXT,
    imap_port INTEGER,
    smtp_server TEXT,
    smtp_port INTEGER,
    jmap_url TEXT,
    username TEXT NOT NULL,
    password_encrypted TEXT NOT NULL,
    use_ssl BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Folders table
CREATE TABLE IF NOT EXISTS folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    display_name TEXT NOT NULL,
    folder_type TEXT NOT NULL CHECK (folder_type IN ('INBOX', 'SENT', 'DRAFTS', 'TRASH', 'SPAM', 'CUSTOM')),
    message_count INTEGER NOT NULL DEFAULT 0,
    unread_count INTEGER NOT NULL DEFAULT 0,
    uid_validity INTEGER,
    uid_next INTEGER,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    UNIQUE(account_id, name)
);

-- Emails table
CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id INTEGER NOT NULL,
    folder_id INTEGER NOT NULL,
    message_id TEXT NOT NULL,
    thread_id TEXT,
    subject TEXT NOT NULL,
    from_address TEXT NOT NULL,
    from_name TEXT,
    to_addresses TEXT NOT NULL, -- JSON array
    cc_addresses TEXT, -- JSON array
    bcc_addresses TEXT, -- JSON array
    body_text TEXT, -- Encrypted
    body_html TEXT, -- Encrypted
    attachments TEXT, -- JSON array
    size_bytes INTEGER NOT NULL,
    internal_date DATETIME NOT NULL,
    received_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN NOT NULL DEFAULT 0,
    is_flagged BOOLEAN NOT NULL DEFAULT 0,
    is_answered BOOLEAN NOT NULL DEFAULT 0,
    is_draft BOOLEAN NOT NULL DEFAULT 0,
    is_deleted BOOLEAN NOT NULL DEFAULT 0,
    uid INTEGER, -- IMAP specific
    mod_seq INTEGER, -- IMAP specific
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
    UNIQUE(account_id, folder_id, message_id)
);

-- Sync state table
CREATE TABLE IF NOT EXISTS sync_state (
    account_id INTEGER NOT NULL,
    folder_id INTEGER NOT NULL,
    last_uid INTEGER,
    last_mod_seq INTEGER,
    last_sync DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sync_token TEXT, -- JMAP specific
    PRIMARY KEY (account_id, folder_id),
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_emails_account_folder ON emails(account_id, folder_id);
CREATE INDEX IF NOT EXISTS idx_emails_from_address ON emails(from_address);
CREATE INDEX IF NOT EXISTS idx_emails_internal_date ON emails(internal_date);
CREATE INDEX IF NOT EXISTS idx_emails_is_read ON emails(is_read);
CREATE INDEX IF NOT EXISTS idx_emails_thread_id ON emails(thread_id);
CREATE INDEX IF NOT EXISTS idx_folders_account_id ON folders(account_id);