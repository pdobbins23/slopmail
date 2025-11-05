# Slop Mail

A modern, cross-platform email client built with Tauri, SolidJS, and Rust

## MVP Features

### Core Email Functionality
- Compose, view, reply, forward emails
- Rich text editor with markdown support
- Attachment handling
- Draft management
- Email threading and conversation view

### Multi-Account Support
- Multiple email accounts in one client
- IMAP and JMAP protocol support
- SSO integration (Gmail, Outlook, etc)
- Per-account settings and signatures

### Offline Mode
- Local email storage and indexing
- Queue outgoing emails when offline
- Background sync when connection restored
- Configurable sync policies per account

### Search That Actually Works
- Full-text search across email bodies (not just subjects like Thunderbird)
- Search filters (date range, sender, attachments, etc)
- Search within specific accounts or folders
- Fast indexed search using tantivy or similar

### Security
- GPG/PGP encryption and signing support
- Master password for local data encryption
- Secure credential storage
- Age encryption support (optional stretch goal)

### UI/UX
- Clean, modern interface using Tailwind CSS
- Responsive design
- Dark/light theme support
- Keyboard shortcuts for power users
- Mobile-friendly (Tauri mobile support is stable)

### Contacts & Calendar
- Basic contact management
- Contact import/export (vCard)
- Calendar view integration
- Event creation and reminders

## Tech Stack

### Frontend
- **Framework**: SolidJS
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Runtime**: Bun (for running and bundling)
- **Desktop**: Tauri (supports Windows, macOS, Linux)
- **Mobile**: Tauri Mobile (iOS, Android)

### Backend
- **Language**: Rust
- **Email Protocols**: 
  - IMAP (using `async-imap` or similar)
  - JMAP (using `jmap-client` or custom implementation)
- **Search**: Tantivy for full-text indexing
- **Storage**: SQLite for metadata, filesystem for email bodies
- **Encryption**: 
  - GPG: `sequoia-pgp`
  - Local encryption: `age` or `chacha20poly1305`

## Project Structure

```
slop-mail/
├── src-tauri/           # Rust backend
│   ├── src/
│   │   ├── email/       # Email protocol handlers
│   │   ├── search/      # Search indexing
│   │   ├── storage/     # Database and file storage
│   │   ├── crypto/      # Encryption handlers
│   │   └── main.rs
│   └── Cargo.toml
├── src/                 # SolidJS frontend
│   ├── components/
│   ├── stores/
│   ├── utils/
│   └── App.tsx
├── flake.nix           # Nix development environment
├── flake.lock
└── package.json
```

## Development Setup

### Prerequisites
- Nix with flakes enabled
- Basic understanding of Rust and TypeScript

### Getting Started

```bash
# Enter development environment
nix develop

# Install frontend dependencies
bun install

# Run in development mode
bun run tauri dev

# Build for production
bun run tauri build
```

## Testing Strategy

### Unit Tests
- Rust backend tests using `cargo test`
- Frontend component tests using Vitest (run with `bun test`)
- Mock email server for protocol testing
- Encryption/decryption test vectors

### Integration Tests
- End-to-end tests using Tauri's testing utilities
- Multi-account sync scenarios
- Offline/online transition handling
- Search accuracy validation

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
- Build on push to main
- Run all tests (unit + integration)
- Check code formatting (rustfmt, prettier)
- Lint (clippy, eslint)
- Build artifacts for all platforms using Bun
- Auto-release on version tags
```

## Nix Configuration

The `flake.nix` should provide:
- Rust toolchain (stable)
- Bun runtime
- Tauri dependencies (webkit, gtk, etc)
- Cross-compilation tools
- Development tools (rust-analyzer, typescript-language-server)

## MVP Scope Limits

What we're NOT doing in MVP:
- Email filters/rules (post-MVP)
- Plugin system (post-MVP)
- Custom themes beyond dark/light (post-MVP)
- S/MIME support (GPG only for MVP)
- Advanced calendar features (just basic view)
- HTML email composition (markdown only)

## Target Users

Primary: Junior developers and privacy-conscious users who want:
- Fast, reliable email client
- Good search capabilities
- Encryption without complexity
- Cross-platform support

Assumes user knowledge:
- Basic command line usage
- Understanding of email protocols (IMAP vs JMAP)
- Familiarity with environment variables
- Basic GPG concepts

## Success Criteria

MVP is successful when:
- Can handle 3+ email accounts simultaneously
- Search returns results in <100ms for 10k+ emails
- Works offline without degraded UX
- GPG encryption/decryption is seamless
- No data loss during sync
- Passes all automated tests
- Builds successfully on all target platforms via CI

## Development Milestones

1. **Phase 1**: Core backend (IMAP/JMAP, storage, sync)
2. **Phase 2**: Search indexing and query engine
3. **Phase 3**: Frontend UI components
4. **Phase 4**: Encryption integration
5. **Phase 5**: Multi-account management
6. **Phase 6**: Contacts and calendar
7. **Phase 7**: Polish, testing, CI/CD

Don't fail, or else