// Library exports for SlopMail backend

pub mod accounts;
pub mod calendar;
pub mod commands;
pub mod contacts;
pub mod db;
pub mod error;
pub mod gpg;
pub mod protocols;
pub mod search;
pub mod security;
pub mod sync;
pub mod types;

pub use error::{Result, SlopmailError};

