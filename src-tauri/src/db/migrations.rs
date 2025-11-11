use sqlx::{migrate::MigrateDatabase, Sqlite, SqlitePool};
use std::sync::Arc;
use anyhow::Result;

pub type DbPool = Arc<SqlitePool>;

pub async fn init_database(database_url: &str) -> Result<DbPool> {
    // Create database if it doesn't exist
    if !Sqlite::database_exists(database_url).await? {
        Sqlite::create_database(database_url).await?;
    }

    // Connect to database
    let pool = SqlitePool::connect(database_url).await?;
    let pool = Arc::new(pool);

    // Run migrations
    run_migrations(&pool).await?;

    Ok(pool)
}

async fn run_migrations(pool: &DbPool) -> Result<()> {
    let migration_sql = include_str!("migrations.sql");
    sqlx::query(migration_sql).execute(pool.as_ref()).await?;
    Ok(())
}