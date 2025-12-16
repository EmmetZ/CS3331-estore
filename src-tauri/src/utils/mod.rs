use std::path::PathBuf;
use std::sync::OnceLock;

static TOKEN_DATA_DIR: OnceLock<PathBuf> = OnceLock::new();

pub fn init_token_data_dir(path: PathBuf) {
    if TOKEN_DATA_DIR.set(path.clone()).is_err() {
        debug_assert_eq!(TOKEN_DATA_DIR.get().cloned(), Some(path));
    }
}

pub fn token_data_dir() -> PathBuf {
    TOKEN_DATA_DIR
        .get()
        .cloned()
        .expect("token data dir must be initialized during setup")
}
