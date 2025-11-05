# SlopMail Architecture & Agent Guide

## Overview

SlopMail is a feature-rich, privacy-focused email client built with:
- **Frontend**: SolidJS + TypeScript + Tailwind CSS
- **Backend**: Rust (Tauri framework)
- **Package Manager**: Bun
- **Database**: SQLite with sqlx
- **Search**: Tantivy full-text search engine

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (SolidJS)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │  Email   │  │ Compose  │  │ Calendar │  │ Search │ │
│  │   View   │  │  Window  │  │ Contacts │  │   UI   │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────────────────────┘
                           │
                    Tauri IPC Bridge
                           │
┌─────────────────────────────────────────────────────────┐
│                  Backend (Rust/Tauri)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │            Master Password Manager                │  │
│  │         (Argon2 + AES-GCM Encryption)            │  │
│  └──────────────────────────────────────────────────┘  │
│                           │                              │
│  ┌────────────┬──────────┴──────────┬────────────────┐ │
│  │   Email    │     Account         │   Security     │ │
│  │   Sync     │    Manager          │   & Crypto     │ │
│  │  Engine    │  (OAuth2/SSO)       │   (GPG/PGP)    │ │
│  └────────────┴─────────────────────┴────────────────┘ │
│                           │                              │
│  ┌────────────┬──────────┴──────────┬────────────────┐ │
│  │   IMAP     │      JMAP           │     POP3       │ │
│  │  Handler   │     Handler         │    Handler     │ │
│  └────────────┴─────────────────────┴────────────────┘ │
│                           │                              │
│  ┌────────────┬──────────┴──────────┬────────────────┐ │
│  │  SQLite    │     Tantivy         │   CalDAV/      │ │
│  │  Database  │   Search Index      │   CardDAV      │ │
│  └────────────┴─────────────────────┴────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Master Password System
**Location**: `src-tauri/src/security/master_password.rs`

Responsible for:
- Prompting user for master password on startup
- Deriving encryption keys using Argon2
- Encrypting/decrypting sensitive data (credentials, GPG keys, email bodies)
- Managing secure memory and key lifecycle

**Key Functions**:
- `verify_master_password()` - Authenticate user
- `derive_encryption_key()` - Create AES key from password
- `encrypt_data()` / `decrypt_data()` - Symmetric encryption operations

### 2. Account Manager
**Location**: `src-tauri/src/accounts/`

Handles multiple email accounts with different protocols:
- Store account configurations (encrypted)
- OAuth2 flows for Gmail, Outlook, Yahoo
- Manual IMAP/SMTP/POP3/JMAP configuration
- Connection testing and validation

**Submodules**:
- `oauth.rs` - OAuth2/SSO implementation
- `credentials.rs` - Encrypted credential storage
- `validation.rs` - Connection testing

### 3. Protocol Handlers

#### IMAP Handler
**Location**: `src-tauri/src/protocols/imap.rs`

Features:
- Connection pooling for multiple accounts
- IDLE support for push notifications
- Folder hierarchy synchronization
- Efficient message fetching with pagination
- Support for Gmail's X-GM-EXT extensions

#### JMAP Handler
**Location**: `src-tauri/src/protocols/jmap.rs`

Features:
- Modern JSON-based protocol
- Delta synchronization
- Push state changes
- Efficient bandwidth usage

#### POP3 Handler
**Location**: `src-tauri/src/protocols/pop3.rs`

Features:
- Simple fetch-and-delete workflow
- Leave messages on server option
- Legacy email account support

### 4. Email Sync Engine
**Location**: `src-tauri/src/sync/`

Core synchronization logic:
- Background sync tasks with tokio
- Offline queue for pending operations
- Conflict resolution strategies
- Incremental sync with state tracking
- Bandwidth-efficient delta updates

**Key Components**:
- `sync_manager.rs` - Orchestrates all sync operations
- `offline_queue.rs` - Queues operations when offline
- `state_tracker.rs` - Tracks sync state per account/folder

### 5. Database Layer
**Location**: `src-tauri/src/db/`

SQLite database with encrypted storage:
- `accounts` - Email account configurations
- `emails` - Full message storage (encrypted bodies)
- `folders` - Folder hierarchy
- `contacts` - Contact database
- `calendar_events` - Calendar entries
- `gpg_keys` - GPG key storage
- `sync_state` - Sync metadata
- `search_index_meta` - Links to Tantivy index

**Migrations**: `src-tauri/migrations/`

### 6. Search Engine
**Location**: `src-tauri/src/search/`

Tantivy-based full-text search:
- Index email subjects, bodies, senders, recipients
- Real-time indexing during sync
- Advanced query syntax support
- Search filters (date, sender, has:attachment, is:unread)
- Result highlighting and ranking

**Index Schema**:
- `subject` - TEXT, stored + indexed
- `body` - TEXT, indexed
- `from` - TEXT, stored + indexed
- `to` - TEXT, indexed
- `date` - DATE, stored + indexed
- `has_attachment` - BOOL, indexed

### 7. GPG Integration
**Location**: `src-tauri/src/gpg/`

PGP encryption using Sequoia OpenPGP:
- Key generation and import/export
- PGP/MIME encryption/decryption
- Inline PGP support
- Digital signature verification
- Key selection UI integration

**Submodules**:
- `key_manager.rs` - GPG key management
- `encryption.rs` - Encrypt/decrypt operations
- `signing.rs` - Sign/verify operations

### 8. Calendar & Contacts
**Location**: `src-tauri/src/calendar/` and `src-tauri/src/contacts/`

#### Contacts
- Local contact storage
- CardDAV synchronization
- vCard import/export
- Contact search and autocomplete

#### Calendar
- Local calendar storage
- CalDAV synchronization
- iCalendar format support
- Event parsing from emails
- Meeting invitation handling

### 9. Frontend Architecture

#### State Management
**Location**: `src/stores/`

SolidJS stores for:
- `emailStore.ts` - Email list and current email state
- `accountStore.ts` - Active accounts
- `uiStore.ts` - UI state (theme, sidebar, etc.)
- `searchStore.ts` - Search state and results
- `composeStore.ts` - Draft composition state

#### Components
**Location**: `src/components/`

Main components:
- `EmailList.tsx` - Virtual scrolling email list
- `EmailDetail.tsx` - Email viewer with HTML rendering
- `ComposeWindow.tsx` - Email composition
- `FolderTree.tsx` - Folder navigation
- `SearchBar.tsx` - Search interface
- `Calendar.tsx` - Calendar view
- `Contacts.tsx` - Contact management
- `Settings.tsx` - Settings panel

#### Tauri Commands
**Location**: `src/hooks/useTauriCommands.ts`

Typed wrappers for Tauri IPC:
- `invoke('sync_account', { accountId })`
- `invoke('fetch_emails', { folderId, limit, offset })`
- `invoke('send_email', { emailData })`
- `invoke('search_emails', { query })`
- `invoke('add_account', { config })`

## Data Flow Examples

### Sending an Email
```
1. User composes email in ComposeWindow.tsx
2. Clicks "Send" → invokes Tauri command 'send_email'
3. Backend receives email data
4. Master password decrypts SMTP credentials
5. GPG module encrypts/signs if enabled
6. SMTP handler sends email via lettre
7. Email saved to Sent folder
8. Tantivy indexes sent email
9. UI updates with success notification
```

### Receiving Emails (IMAP IDLE)
```
1. IMAP handler maintains IDLE connection
2. Server sends notification of new message
3. Sync engine fetches new email
4. Email parser extracts headers/body/attachments
5. Master password encrypts email body
6. Save to SQLite database
7. Tantivy indexes email content
8. Frontend receives notification via Tauri events
9. Email list updates reactively
```

### Searching Emails
```
1. User types in SearchBar.tsx
2. Debounced search query sent to backend
3. Tantivy parses and executes query
4. Results ranked and highlighted
5. Metadata fetched from SQLite
6. Results streamed to frontend
7. EmailList displays search results
```

## Security Model

### Encryption Layers

1. **Master Password Layer**
   - All sensitive data encrypted at rest
   - Argon2 key derivation (high cost parameters)
   - AES-256-GCM for symmetric encryption

2. **Transport Security**
   - TLS for all network connections
   - Certificate validation
   - No credential transmission without encryption

3. **GPG/PGP Layer**
   - End-to-end email encryption
   - Stored keys encrypted with master password
   - Secure key generation and storage

### Threat Model

**Protected Against**:
- Disk access by unauthorized users
- Memory dumps (keys cleared after use)
- Network eavesdropping (TLS everywhere)
- XSS in HTML emails (sanitization)

**Not Protected Against**:
- Malicious code execution in app context
- OS-level keyloggers
- Physical memory access while unlocked

## Development Workflow

### Adding a New Feature

1. **Backend**: Add Tauri command in `src-tauri/src/commands/`
2. **Frontend**: Add corresponding hook in `src/hooks/`
3. **UI**: Create component in `src/components/`
4. **State**: Update relevant store in `src/stores/`
5. **Test**: Add integration test

### Database Migrations

```bash
# Create new migration
sqlx migrate add <migration_name>

# Edit generated migration file
# migrations/<timestamp>_<migration_name>.sql

# Apply migrations
sqlx migrate run
```

### Building

```bash
# Development
bun run tauri dev

# Production build
bun run tauri build
```

## Performance Considerations

### Frontend
- Virtual scrolling for large email lists (only render visible items)
- Lazy loading of email bodies
- Debounced search input
- Memoized components with SolidJS

### Backend
- Connection pooling for IMAP/JMAP
- Batch database operations
- Incremental sync to minimize bandwidth
- Tantivy indexing in background thread
- SQLite WAL mode for concurrent access

### Database Optimization
- Indexes on frequently queried columns
- Prepared statements for common queries
- Periodic VACUUM for database maintenance
- Attachment storage as separate blobs

## Testing Strategy

### Unit Tests
- Protocol handler logic
- Encryption/decryption functions
- Email parsing
- Search query parsing

### Integration Tests
- End-to-end email send/receive
- Account OAuth flow
- Sync engine correctness
- Database migrations

### UI Tests
- Component rendering
- User interaction flows
- Accessibility compliance

## Dependencies

### Critical Rust Crates
- `tokio` - Async runtime (v1.35+)
- `sqlx` - Database with compile-time SQL checking (v0.7+)
- `async-imap` - IMAP protocol (v0.9+)
- `lettre` - SMTP sending (v0.11+)
- `jmap-client` - JMAP protocol (v0.3+)
- `sequoia-openpgp` - GPG implementation (v1.18+)
- `tantivy` - Full-text search (v0.21+)
- `argon2` - Password hashing (v0.5+)
- `oauth2` - OAuth2 flows (v4.4+)

### Critical Frontend Packages
- `solid-js` - Reactive UI framework (v1.8+)
- `@tauri-apps/api` - Tauri bindings (v1.5+)
- `tailwindcss` - Utility CSS framework (v3.4+)
- `@solidjs/router` - Routing (v0.10+)

## AI Agent Guidance

When working on this codebase, AI agents should:

1. **Maintain Security First**
   - Never log sensitive data (passwords, keys, email content)
   - Always use master password encryption for at-rest data
   - Validate all user input
   - Sanitize HTML content

2. **Follow Rust Best Practices**
   - Use `Result<T, Error>` for error handling
   - Avoid unwrap() in production code
   - Use async/await with tokio
   - Follow Clippy suggestions

3. **Frontend Patterns**
   - Use SolidJS signals for reactive state
   - Keep components small and focused
   - Use Tailwind utility classes
   - Implement proper loading states

4. **Database Operations**
   - Use sqlx compile-time checked queries
   - Run migrations in order
   - Index foreign keys and query columns
   - Use transactions for multi-step operations

5. **Protocol Implementation**
   - Handle network failures gracefully
   - Implement retry logic with exponential backoff
   - Respect rate limits
   - Log protocol-level errors for debugging

6. **Testing Requirements**
   - Write tests for new features
   - Test error paths, not just happy paths
   - Mock external services in tests
   - Test with various email formats

## Troubleshooting Common Issues

### Sync Issues
- Check network connectivity
- Verify account credentials are decrypted correctly
- Inspect sync_state table for stale entries
- Review protocol handler logs

### Search Not Working
- Rebuild Tantivy index
- Check index corruption
- Verify indexing during sync
- Check query syntax

### Performance Problems
- Profile with `cargo flamegraph`
- Check database query plans with EXPLAIN
- Monitor memory usage
- Review virtual scroll implementation

### GPG Errors
- Verify key import succeeded
- Check key expiration dates
- Ensure proper key selection
- Validate key trust levels

## Future Enhancements

- WebDAV support for file attachments
- Plugin system for extensions
- Mobile companion app
- Email rules and filters
- Unified inbox view
- Smart categorization with ML
- Read receipts and tracking
- Email templates
- Snooze functionality
- Dark web privacy mode (Tor support)

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-05  
**Maintainer**: SlopMail Development Team

