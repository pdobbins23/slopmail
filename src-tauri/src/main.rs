// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod commands;
mod db;
mod email;

#[tokio::main]
async fn main() {
    // Initialize logging
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "slopmail=debug,tauri=info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

        // Initialize database
    let db_pool = db::init_database("sqlite:slopmail.db").await
        .expect("Failed to initialize database");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(db_pool)
        .invoke_handler(tauri::generate_handler![
            commands::greet,
            commands::add_account,
            commands::get_accounts,
            commands::test_account_connection,
            commands::sync_folders,
            commands::get_folders,
            commands::fetch_emails,
            commands::get_emails,
            commands::send_email,
            commands::mark_email_read
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
