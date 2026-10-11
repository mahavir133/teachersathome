import mysql from 'mysql2/promise';

async function migrate() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || 'Mahavir@123';
  const database = process.env.DB_NAME || 'teachersathome';

  console.log(`Connecting to ${database} on ${host} as ${user}...`);

  const pool = mysql.createPool({
    host,
    user,
    password,
    database
  });

  try {
    console.log("Creating site_analytics table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_analytics (
        id VARCHAR(50) PRIMARY KEY,
        page_path VARCHAR(255) NOT NULL,
        event_type VARCHAR(50) NOT NULL DEFAULT 'page_view',
        event_label VARCHAR(255),
        device_type VARCHAR(50) DEFAULT 'Desktop',
        browser VARCHAR(50) DEFAULT 'Unknown',
        referrer VARCHAR(255) DEFAULT 'Direct',
        session_id VARCHAR(100),
        ip_address VARCHAR(100),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_created_at (created_at),
        INDEX idx_event_type (event_type),
        INDEX idx_session_id (session_id)
      )
    `);

    console.log("Table site_analytics created successfully!");
    const [cols] = await pool.query("DESCRIBE site_analytics");
    console.log("Columns:", cols);
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrate();
