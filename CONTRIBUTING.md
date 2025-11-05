# Contributing to SlopMail

Thank you for your interest in contributing to SlopMail! This document provides guidelines and instructions for setting up your development environment.

## Development Setup

### Prerequisites

1. **Nix with Flakes** (recommended)
   - Install Nix: https://nixos.org/download.html
   - Enable flakes: https://nixos.wiki/wiki/Flakes

2. **Alternative Setup** (without Nix)
   - Rust 1.70+ (https://rustup.rs/)
   - Bun (https://bun.sh/)
   - Node.js 20+
   - Platform-specific dependencies:
     - **Linux (Ubuntu 22.04 or Debian 11)**: `libgtk-3-dev libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf libssl-dev pkg-config`
     - **Linux (Fedora/RHEL)**: `gtk3-devel webkit2gtk4.0-devel libappindicator-gtk3-devel librsvg2-devel openssl-devel`
     - **macOS**: Xcode Command Line Tools
     - **Windows**: Microsoft C++ Build Tools

   > ⚠️ **Important**: This project uses **Tauri v1**, which requires `webkit2gtk-4.0`. Ubuntu 24.04+ and Debian 13+ do not provide this package (only `webkit2gtk-4.1`). Please use **Ubuntu 22.04 LTS** or earlier for development. To upgrade to Ubuntu 24.04 support, the project needs to migrate to Tauri v2 (tracked in [tauri-apps/tauri#9662](https://github.com/tauri-apps/tauri/issues/9662)).

### Getting Started

#### Using Nix (Recommended)

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

#### Without Nix

```bash
# Install frontend dependencies
bun install

# Run in development mode
bun run tauri dev

# Build for production
bun run tauri build
```

## Project Structure

```
slopmail/
├── src/                    # Frontend SolidJS code
│   ├── components/         # UI components
│   ├── stores/            # State management
│   ├── hooks/             # Custom hooks
│   └── styles/            # CSS/Tailwind styles
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── commands/      # Tauri commands
│   │   ├── email/         # Email protocol handlers
│   │   ├── search/        # Search engine
│   │   ├── storage/       # Database layer
│   │   └── crypto/        # Encryption
│   └── Cargo.toml
├── .github/workflows/     # CI/CD
└── flake.nix             # Nix development environment
```

## Development Workflow

### Running Tests

```bash
# Rust tests
cd src-tauri && cargo test

# Frontend tests
bun test

# Linting
bun run lint

# Formatting
bun run format
```

### Code Quality

We enforce strict code quality standards:

- **Rust**: Use `cargo fmt` and `cargo clippy`
- **TypeScript**: Use ESLint and Prettier
- All PRs must pass CI checks

### Making Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Write tests for new functionality
5. Run tests and linters
6. Commit with descriptive messages
7. Push and create a Pull Request

### Commit Message Format

We follow conventional commits:

```
feat: add email search functionality
fix: resolve IMAP connection timeout
docs: update README with setup instructions
test: add tests for GPG encryption
refactor: improve sync engine performance
```

## Areas for Contribution

### High Priority
- Email protocol implementations (IMAP, JMAP, POP3)
- Search engine optimization
- GPG/PGP integration
- UI/UX improvements

### Good First Issues
- Documentation improvements
- Unit tests
- Bug fixes
- Small feature additions

## Security

SlopMail handles sensitive data. Please:

- Never log passwords, keys, or email content
- Use master password encryption for at-rest data
- Validate all user input
- Report security issues privately to the maintainers

## Questions?

- Open an issue for bugs or feature requests
- Join discussions in GitHub Discussions
- Check existing issues before creating new ones

Thank you for contributing to SlopMail!
