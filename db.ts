import mysql from 'mysql2/promise';
import { Tutor, ParentRequest, TutorApplication, User } from './src/types.js';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Toor$3210!',
  database: 'teachersathome',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function getTutors(): Promise<Tutor[]> {
  const [rows] = await pool.query('SELECT * FROM tutors ORDER BY rating DESC');
  return rows as Tutor[];
}

export async function getParentRequests(): Promise<ParentRequest[]> {
  const [rows] = await pool.query('SELECT * FROM parent_requests ORDER BY createdAt DESC');
  return rows as ParentRequest[];
}

export async function getTutorApplications(): Promise<TutorApplication[]> {
  const [rows] = await pool.query('SELECT * FROM tutor_applications ORDER BY createdAt DESC');
  return rows as TutorApplication[];
}

export async function getParentRequestsByUserId(userId: string): Promise<ParentRequest[]> {
  const [rows] = await pool.query('SELECT * FROM parent_requests WHERE user_id = ? ORDER BY createdAt DESC', [userId]);
  return rows as ParentRequest[];
}

export async function getTutorApplicationByUserId(userId: string): Promise<TutorApplication | null> {
  const [rows] = await pool.query('SELECT * FROM tutor_applications WHERE user_id = ? ORDER BY createdAt DESC LIMIT 1', [userId]);
  const apps = rows as TutorApplication[];
  return apps.length > 0 ? apps[0] : null;
}

export async function getTutorByUserId(userId: string): Promise<Tutor | null> {
  const [rows] = await pool.query('SELECT * FROM tutors WHERE user_id = ? LIMIT 1', [userId]);
  const tutors = rows as Tutor[];
  return tutors.length > 0 ? tutors[0] : null;
}

export async function addParentRequest(req: ParentRequest & { user_id?: string }): Promise<void> {
  const query = `
    INSERT INTO parent_requests (id, parentName, studentName, phone, studentClass, board, subjects, city, locality, preferredGender, preferredTiming, mode, notes, status, createdAt, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    req.id, req.parentName, req.studentName || null, req.phone, req.studentClass, req.board,
    JSON.stringify(req.subjects), req.city, req.locality || null, req.preferredGender,
    req.preferredTiming || null, req.mode, req.notes || null, req.status, new Date(req.createdAt),
    req.user_id || null
  ];
  await pool.execute(query, values);
}

export async function addTutorApplication(app: TutorApplication & { user_id?: string }): Promise<void> {
  const query = `
    INSERT INTO tutor_applications (id, fullName, phone, email, qualification, experienceYears, subjects, cities, preferredMode, bio, status, createdAt, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    app.id, app.fullName, app.phone, app.email || null, app.qualification, app.experienceYears,
    JSON.stringify(app.subjects), JSON.stringify(app.cities), app.preferredMode, app.bio || null,
    app.status, new Date(app.createdAt),
    app.user_id || null
  ];
  await pool.execute(query, values);
}

export async function approveTutorApplication(id: string, tutor: Tutor): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const insertTutorQuery = `
      INSERT INTO tutors (id, name, avatar, rating, reviewsCount, title, qualification, experienceYears, subjects, boards, cities, localities, pricePerHour, pricePerMonth, gender, mode, bio, verified, phone, badge, badgeColor, classesHandled, demoClassAvailable)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const tutorValues = [
      tutor.id, tutor.name, tutor.avatar, tutor.rating, tutor.reviewsCount, tutor.title,
      tutor.qualification, tutor.experienceYears, JSON.stringify(tutor.subjects),
      JSON.stringify(tutor.boards), JSON.stringify(tutor.cities), JSON.stringify(tutor.localities),
      tutor.pricePerHour, tutor.pricePerMonth, tutor.gender, tutor.mode, tutor.bio,
      tutor.verified, tutor.phone, tutor.badge || null, tutor.badgeColor || null,
      JSON.stringify(tutor.classesHandled), tutor.demoClassAvailable
    ];
    await connection.execute(insertTutorQuery, tutorValues);

    const deleteAppQuery = 'DELETE FROM tutor_applications WHERE id = ?';
    await connection.execute(deleteAppQuery, [id]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function addLegacyTutor(user: User, tutor: Tutor & { user_id?: string }): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const insertUserQuery = `
      INSERT INTO users (id, email, password_hash, role, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(insertUserQuery, [
      user.id, user.email, user.password_hash, user.role, user.status, new Date(user.createdAt)
    ]);

    const insertTutorQuery = `
      INSERT INTO tutors (id, name, avatar, rating, reviewsCount, title, qualification, experienceYears, subjects, boards, cities, localities, pricePerHour, pricePerMonth, gender, mode, bio, verified, phone, badge, badgeColor, classesHandled, demoClassAvailable, user_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const tutorValues = [
      tutor.id, tutor.name, tutor.avatar, tutor.rating, tutor.reviewsCount, tutor.title,
      tutor.qualification, tutor.experienceYears, JSON.stringify(tutor.subjects),
      JSON.stringify(tutor.boards), JSON.stringify(tutor.cities), JSON.stringify(tutor.localities),
      tutor.pricePerHour, tutor.pricePerMonth, tutor.gender, tutor.mode, tutor.bio,
      tutor.verified, tutor.phone, tutor.badge || null, tutor.badgeColor || null,
      JSON.stringify(tutor.classesHandled), tutor.demoClassAvailable, tutor.user_id || user.id
    ];
    await connection.execute(insertTutorQuery, tutorValues);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function rejectTutorApplication(id: string): Promise<void> {
  const query = 'DELETE FROM tutor_applications WHERE id = ?';
  await pool.execute(query, [id]);
}

export async function updateParentRequestStatus(id: string, status: string): Promise<void> {
  const query = 'UPDATE parent_requests SET status = ? WHERE id = ?';
  await pool.execute(query, [status, id]);
}

export async function getAssignments(): Promise<any[]> {
  const query = `
    SELECT a.*, 
           t.name as tutorName, 
           pr.parentName as parentName, 
           pr.phone as parentPhone, 
           pr.subjects as subjects, 
           pr.city as city
    FROM assignments a
    JOIN tutors t ON a.tutor_id = t.id
    JOIN parent_requests pr ON a.request_id = pr.id
    ORDER BY a.assigned_date DESC
  `;
  const [rows] = await pool.query(query);
  const assignments = rows as any[];
  // Parse JSON subjects if needed
  return assignments.map(a => ({
    ...a,
    subjects: typeof a.subjects === 'string' ? JSON.parse(a.subjects) : a.subjects
  }));
}

export async function getParentAssignmentsByUserId(userId: string): Promise<any[]> {
  const query = `
    SELECT a.id, a.fee_agreed, a.assigned_date, a.status,
           t.name as tutorName, t.phone as tutorPhone, t.qualification, t.experienceYears
    FROM assignments a
    JOIN tutors t ON a.tutor_id = t.id
    JOIN parent_requests pr ON a.request_id = pr.id
    WHERE pr.user_id = ?
    ORDER BY a.assigned_date DESC
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows as any[];
}

export async function getTutorAssignmentsByUserId(userId: string): Promise<any[]> {
  const query = `
    SELECT a.id, a.fee_agreed, a.assigned_date, a.status,
           pr.parentName, pr.studentName, pr.phone as parentPhone, pr.studentClass, pr.board, pr.city, pr.locality
    FROM assignments a
    JOIN tutors t ON a.tutor_id = t.id
    JOIN parent_requests pr ON a.request_id = pr.id
    WHERE t.user_id = ?
    ORDER BY a.assigned_date DESC
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows as any[];
}

export async function createAssignment(assignment: any): Promise<void> {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const query = `
      INSERT INTO assignments (id, tutor_id, request_id, fee_agreed, assigned_date, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    await connection.execute(query, [
      assignment.id,
      assignment.tutor_id,
      assignment.request_id,
      assignment.fee_agreed,
      new Date(assignment.assigned_date),
      assignment.status
    ]);

    // Update parent request status to 'Matched' or 'Active'
    const updateReqQuery = 'UPDATE parent_requests SET status = ? WHERE id = ?';
    await connection.execute(updateReqQuery, ['Active', assignment.request_id]);

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export async function getFeeCollections(): Promise<any[]> {
  const query = `
    SELECT fc.id, fc.assignment_id, fc.month_year, fc.amount, fc.payment_date, fc.payment_mode, fc.status, fc.txn_id,
           pr.parentName, pr.studentName, t.name as tutorName
    FROM fee_collections fc
    JOIN assignments a ON fc.assignment_id = a.id
    JOIN tutors t ON a.tutor_id = t.id
    JOIN parent_requests pr ON a.request_id = pr.id
    ORDER BY fc.payment_date DESC
  `;
  const [rows] = await pool.query(query);
  return rows as any[];
}

export async function getParentFeeCollectionsByUserId(userId: string): Promise<any[]> {
  const query = `
    SELECT fc.id, fc.assignment_id, fc.month_year, fc.amount, fc.payment_date, fc.payment_mode, fc.status, fc.txn_id,
           pr.parentName, pr.studentName, t.name as tutorName
    FROM fee_collections fc
    JOIN assignments a ON fc.assignment_id = a.id
    JOIN tutors t ON a.tutor_id = t.id
    JOIN parent_requests pr ON a.request_id = pr.id
    WHERE pr.user_id = ?
    ORDER BY fc.payment_date DESC
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows as any[];
}

export async function getTutorFeeCollectionsByUserId(userId: string): Promise<any[]> {
  const query = `
    SELECT fc.id, fc.assignment_id, fc.month_year, fc.amount, fc.payment_date, fc.payment_mode, fc.status, fc.txn_id,
           pr.parentName, pr.studentName, t.name as tutorName
    FROM fee_collections fc
    JOIN assignments a ON fc.assignment_id = a.id
    JOIN tutors t ON a.tutor_id = t.id
    JOIN parent_requests pr ON a.request_id = pr.id
    WHERE t.user_id = ?
    ORDER BY fc.payment_date DESC
  `;
  const [rows] = await pool.query(query, [userId]);
  return rows as any[];
}

export async function addFeeCollection(fee: any): Promise<void> {
  const query = `
    INSERT INTO fee_collections (id, assignment_id, month_year, amount, payment_date, payment_mode, status, txn_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  await pool.execute(query, [
    fee.id, fee.assignment_id, fee.month_year, fee.amount, new Date(fee.payment_date), fee.payment_mode, fee.status, fee.txn_id || null
  ]);
}

export async function getMonthlyFeeStats(): Promise<any[]> {
  const query = `
    SELECT month_year, SUM(amount) as total
    FROM fee_collections
    WHERE status = 'Paid'
    GROUP BY month_year
    ORDER BY month_year ASC
  `;
  const [rows] = await pool.query(query);
  return rows as any[];
}
export async function updateAssignment(id: string, fee_agreed: number, status: string): Promise<void> {
  const query = 'UPDATE assignments SET fee_agreed = ?, status = ? WHERE id = ?';
  await pool.execute(query, [fee_agreed, status, id]);
}

export async function deleteAssignment(id: string): Promise<void> {
  const query = 'DELETE FROM assignments WHERE id = ?';
  await pool.execute(query, [id]);
}

export async function updateFeeCollection(id: string, amount: number, payment_mode: string, month_year: string, txn_id?: string): Promise<void> {
  const query = 'UPDATE fee_collections SET amount = ?, payment_mode = ?, month_year = ?, txn_id = ? WHERE id = ?';
  await pool.execute(query, [amount, payment_mode, month_year, txn_id || null, id]);
}

export async function deleteFeeCollection(id: string): Promise<void> {
  const query = 'DELETE FROM fee_collections WHERE id = ?';
  await pool.execute(query, [id]);
}

// Keep a migration function just in case
export async function seedInitialData(tutors: Tutor[]) {
  // Can be implemented if needed
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
}

export async function getUserById(id: string): Promise<User | null> {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  const users = rows as User[];
  return users.length > 0 ? users[0] : null;
}

export async function createUser(user: User): Promise<void> {
  const query = `
    INSERT INTO users (id, email, password_hash, role, status, createdAt)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    user.id, user.email, user.password_hash, user.role, user.status, new Date(user.createdAt)
  ];
  await pool.execute(query, values);
}

export async function linkParentRequests(userId: string, phone: string): Promise<void> {
  const query = 'UPDATE parent_requests SET user_id = ? WHERE phone = ? AND user_id IS NULL';
  await pool.execute(query, [userId, phone]);
}

export async function linkTutorApplications(userId: string, email: string, phone: string): Promise<void> {
  const query = 'UPDATE tutor_applications SET user_id = ? WHERE (email = ? OR phone = ?) AND user_id IS NULL';
  await pool.execute(query, [userId, email, phone]);
}
