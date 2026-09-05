import mysql from 'mysql2/promise';

async function migrate() {
  const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Toor$3210!',
    database: 'teachersathome',
  });

  try {
    await pool.query('ALTER TABLE tutors ADD COLUMN user_id VARCHAR(255) DEFAULT NULL');
    console.log('Column user_id added to tutors table.');
  } catch (err: any) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column user_id already exists.');
    } else {
      console.error(err);
    }
  }
  process.exit(0);
}

migrate();
