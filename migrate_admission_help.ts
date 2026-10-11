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
    console.log("Creating admission_help_requests table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admission_help_requests (
        id VARCHAR(50) PRIMARY KEY,
        parent_name VARCHAR(255),
        phone VARCHAR(50) NOT NULL,
        school_name VARCHAR(255),
        query_message TEXT,
        status ENUM('Pending', 'Contacted', 'In Progress', 'Resolved') DEFAULT 'Pending',
        admin_notes TEXT,
        user_id VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Table admission_help_requests created successfully!");
    const [cols] = await pool.query("DESCRIBE admission_help_requests");
    console.log("Columns:", cols);
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrate();
