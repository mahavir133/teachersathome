import { pool } from './db.js';

async function main() {
  try {
    console.log('Adding studentName column to parent_requests table...');
    await pool.execute('ALTER TABLE parent_requests ADD COLUMN studentName VARCHAR(100) NULL');
    console.log('Successfully added studentName column');
  } catch (err: any) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column studentName already exists.');
    } else {
      console.error('Error:', err);
    }
  } finally {
    process.exit(0);
  }
}

main();
