// Basic command to test Tauri setup
#[tauri::command]
pub fn greet(name: &str) -> String {
    format!("Hello, {}! Welcome to SlopMail.", name)
}
