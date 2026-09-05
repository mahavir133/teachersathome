const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');

async function createAdmin() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Toor$3210!',
    database: 'teachersathome'
  });

  try {
    const hash = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT IGNORE INTO users (id, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
      ['admin-1', 'admin@teachersathome.com', hash, 'ADMIN', 'ACTIVE']
    );
    console.log('Admin account created successfully.');
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    process.exit(0);
  }
}

createAdmin();
