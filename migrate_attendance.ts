import mysql from 'mysql2/promise';

async function migrate() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Toor$3210!',
    database: 'teachersathome',
  });

  try {
    const query = `
      CREATE TABLE IF NOT EXISTS attendance (
          id VARCHAR(50) PRIMARY KEY,
          assignment_id VARCHAR(50) NOT NULL,
          class_date VARCHAR(20) NOT NULL,
          status ENUM('Present', 'Absent', 'Cancelled') NOT NULL,
          marked_by VARCHAR(50) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          UNIQUE KEY unique_assignment_date (assignment_id, class_date)
      );
    `;
    await pool.query(query);
    console.log('Attendance table created successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
