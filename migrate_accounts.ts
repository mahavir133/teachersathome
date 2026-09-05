import mysql from 'mysql2/promise';

async function migrate() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Toor$3210!',
    database: 'teachersathome',
  });

  try {
    console.log("Creating assignments table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id VARCHAR(255) PRIMARY KEY,
        tutor_id VARCHAR(255) NOT NULL,
        request_id VARCHAR(255) NOT NULL,
        fee_agreed DECIMAL(10, 2) NOT NULL,
        assigned_date DATETIME NOT NULL,
        status ENUM('Active', 'Completed', 'Cancelled') DEFAULT 'Active',
        FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE,
        FOREIGN KEY (request_id) REFERENCES parent_requests(id) ON DELETE CASCADE
      )
    `);

    console.log("Creating fee_collections table...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS fee_collections (
        id VARCHAR(255) PRIMARY KEY,
        assignment_id VARCHAR(255) NOT NULL,
        month_year VARCHAR(20) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        payment_date DATETIME NOT NULL,
        payment_mode VARCHAR(50) DEFAULT 'Cash',
        status ENUM('Paid', 'Pending') DEFAULT 'Paid',
        FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE
      )
    `);

    console.log("Migration completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    process.exit(0);
  }
}

migrate();
