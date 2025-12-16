// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use lazy_static::lazy_static;
use tauri::Manager;
use tracing::info;
use tracing_subscriber;

mod api;
mod app;
mod client;
mod error;
mod model;
mod utils;

lazy_static! {
    pub(crate) static ref APP: app::App = app::App::new();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // init logging
    tracing_subscriber::fmt::init();
    info!("tracing initialized, for full logs, run with RUST_LOG=estore_lib=debug");

    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            let data_dir = handle
                .path()
                .app_data_dir()
                .expect("No App config path was found!");
            utils::init_token_data_dir(data_dir);
            Ok(())
        })
        .plugin(tauri_plugin_sql::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            api::auth::login,
            api::auth::logout,
            api::auth::refresh_token,
            api::user::get_me,
            api::product::search_products,
            api::product::create_product,
            api::product::update_product,
            api::product::delete_product,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
