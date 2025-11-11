export interface Account {
  id: number;
  name: string;
  email: string;
  protocol: string;
  imap_server?: string;
  imap_port?: number;
  smtp_server?: string;
  smtp_port?: number;
  jmap_url?: string;
  username: string;
  password_encrypted: string;
  use_ssl: boolean;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: number;
  account_id: number;
  name: string;
  display_name: string;
  folder_type: 'INBOX' | 'SENT' | 'DRAFTS' | 'TRASH' | 'SPAM' | 'CUSTOM';
  message_count: number;
  unread_count: number;
  uid_validity?: number;
  uid_next?: number;
  created_at: string;
  updated_at: string;
}

export interface Email {
  id: number;
  account_id: number;
  folder_id: number;
  message_id: string;
  thread_id?: string;
  subject: string;
  from_address: string;
  from_name?: string;
  to_addresses: string;
  cc_addresses?: string;
  bcc_addresses?: string;
  body_text?: string;
  body_html?: string;
  attachments?: string;
  size_bytes: number;
  internal_date: string;
  received_date: string;
  is_read: boolean;
  is_flagged: boolean;
  is_answered: boolean;
  is_draft: boolean;
  is_deleted: boolean;
  uid?: number;
  mod_seq?: number;
  created_at: string;
  updated_at: string;
}

export interface EmailAddress {
  name?: string;
  address: string;
}

export interface Attachment {
  id: string;
  filename: string;
  content_type: string;
  size_bytes: number;
  content_id?: string;
  is_inline: boolean;
}

export interface ComposeEmail {
  account_id: number;
  to: EmailAddress[];
  cc?: EmailAddress[];
  bcc?: EmailAddress[];
  subject: string;
  body_text?: string;
  body_html?: string;
  attachments: Attachment[];
  in_reply_to?: string;
  references?: string;
}

export interface AddAccountRequest {
  name: string;
  email: string;
  protocol: string;
  imap_server?: string;
  imap_port?: number;
  smtp_server?: string;
  smtp_port?: number;
  username: string;
  password: string;
  use_ssl: boolean;
}

export interface TestAccountRequest {
  protocol: string;
  imap_server?: string;
  imap_port?: number;
  smtp_server?: string;
  smtp_port?: number;
  username: string;
  password: string;
  use_ssl: boolean;
}