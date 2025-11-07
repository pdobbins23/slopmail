{
  description = "Web-slop email client thats actually good";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        inherit (nixpkgs) lib;
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs {
          inherit system overlays;
        };

        # Rust toolchain with required components
        rustToolchain = pkgs.rust-bin.stable.latest.default.override {
          extensions = [ "rust-src" "rust-analyzer" ];
        };

        # Libraries needed for Tauri on Linux
        libraries = with pkgs; [
          gtk3
          cairo
          gdk-pixbuf
          glib
          dbus
          openssl_3
          librsvg
          libsoup_3
        ] ++ lib.optional stdenv.hostPlatform.isLinux webkitgtk_4_1;

        # System packages for development
        packages = with pkgs; [
          rustToolchain
          pkg-config
          dbus
          openssl_3
          glib
          gtk3
          libsoup_3
          librsvg
          bun
          nodejs_20
          cargo-watch
          sqlx-cli
          # Additional tools
          git
          curl
          wget
        ] ++ lib.optional stdenv.hostPlatform.isLinux webkitgtk_4_1;

      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = packages;

          shellHook = ''
            echo "🚀 SlopMail Development Environment"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "Rust: $(rustc --version)"
            echo "Bun: $(bun --version)"
            echo "Node: $(node --version)"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            echo "📦 To get started:"
            echo "  bun install              # Install dependencies"
            echo "  bun run tauri dev        # Start development server"
            echo "  bun run tauri build      # Build for production"
            echo ""
            echo "🧪 Testing:"
            echo "  cargo test               # Run Rust tests"
            echo "  bun test                 # Run frontend tests"
            echo ""
            export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath libraries}:$LD_LIBRARY_PATH
            export PKG_CONFIG_PATH="${pkgs.openssl_3.dev}/lib/pkgconfig:$PKG_CONFIG_PATH"
            export WEBKIT_DISABLE_COMPOSITING_MODE=1
          '';

          # Environment variables
          RUST_SRC_PATH = "${rustToolchain}/lib/rustlib/src/rust/library";
          RUST_BACKTRACE = "1";
        };
      }
    );
}
