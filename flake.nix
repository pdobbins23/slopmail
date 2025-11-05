{
  description = "Web-slop email client thats actually good";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = { self, nixpkgs }:
    let
      # Systems to support
      allSystems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      # Helper to provide system-specific attributes
      forAllSystems = f: nixpkgs.lib.genAttrs allSystems (system: f {
        pkgs = import nixpkgs { inherit system; };
      });
    in
    {
      # Development shell with all necessary tools
      devShells = forAllSystems ({ pkgs }: {
        default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js and package managers
            nodejs_22
            bun
            
            # Rust toolchain
            rustc
            cargo
            rustfmt
            clippy
            rust-analyzer
            
            # Build dependencies for Tauri
            pkg-config
            openssl
            
            # WebKit and system dependencies (platform-specific)
          ] ++ pkgs.lib.optionals pkgs.stdenv.isLinux [
            webkitgtk_4_1
            gtk3
            libsoup_3
            librsvg
            gdk-pixbuf
            pango
            cairo
          ] ++ pkgs.lib.optionals pkgs.stdenv.isDarwin (with pkgs.darwin.apple_sdk.frameworks; [
            WebKit
            AppKit
            CoreGraphics
            Security
            SystemConfiguration
          ]);

          shellHook = ''
            echo "🚀 SlopMail development environment loaded!"
            echo "📦 Node.js: $(node --version)"
            echo "🍞 Bun: $(bun --version)"
            echo "🦀 Rust: $(rustc --version)"
            echo ""
            echo "Available commands:"
            echo "  bun run tauri:dev   - Start development server"
            echo "  bun run tauri:build - Build production binary"
          '';
        };
      });
    };
}
