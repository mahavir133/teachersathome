import { pool } from './db.js';

async function main() {
  try {
    console.log('Adding txn_id column to fee_collections table...');
    await pool.execute('ALTER TABLE fee_collections ADD COLUMN txn_id VARCHAR(100) NULL');
    console.log('Successfully added txn_id column');
  } catch (err: any) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column txn_id already exists.');
    } else {
      console.error('Error:', err);
    }
  } finally {
    process.exit(0);
  }
}

main();
