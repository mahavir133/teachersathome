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
      CREATE TABLE IF NOT EXISTS grievances (
          id VARCHAR(50) PRIMARY KEY,
          user_id VARCHAR(50) NOT NULL,
          assignment_id VARCHAR(50),
          grievance_type ENUM('Attendance', 'Tutor Behavior', 'Payment', 'Other') NOT NULL,
          description TEXT NOT NULL,
          status ENUM('Open', 'In Progress', 'Resolved') DEFAULT 'Open',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await pool.query(query);
    console.log('Grievances table created successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

migrate();
