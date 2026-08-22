import fs from 'fs/promises';
import path from 'path';
import { INITIAL_TUTORS } from './src/data/tutors.js';
import { Tutor, ParentRequest } from './src/types.js';

const DB_FILE = path.join(process.cwd(), 'db.json');

export interface Database {
  tutors: Tutor[];
  parentRequests: ParentRequest[];
  tutorApplications: any[];
}

export async function getDb(): Promise<Database> {
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with initial data
    const initialDb: Database = {
      tutors: INITIAL_TUTORS,
      parentRequests: [],
      tutorApplications: []
    };
    await writeDb(initialDb);
    return initialDb;
  }
}

export async function writeDb(db: Database): Promise<void> {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}
