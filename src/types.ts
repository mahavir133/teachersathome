export type BoardType = 'CBSE' | 'ICSE/ISC' | 'JAC' | 'BSEB' | 'State Board' | 'IB/IGCSE';

export type ClassLevelType = 
  | 'Pre-Primary (Play - UKG)'
  | 'Primary (Class 1-5)'
  | 'Middle School (Class 6-8)'
  | 'Secondary (Class 9-10)'
  | 'Senior Secondary (Class 11-12 PCM)'
  | 'Senior Secondary (Class 11-12 PCB)'
  | 'Senior Secondary (Class 11-12 Commerce)'
  | 'Senior Secondary (Class 11-12 Arts)'
  | 'Competitive Exams (IIT-JEE / NEET)'
  | 'Spoken English & Personality';

export type TeachingModeType = 'Home Tuition' | 'Online 1-on-1' | 'Both';

export type GenderPreference = 'Any' | 'Female Tutor' | 'Male Tutor';

export type UserRole = 'ADMIN' | 'TUTOR' | 'PARENT';
export type UserStatus = 'PENDING' | 'ACTIVE' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface Tutor {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  title: string;
  qualification: string;
  experienceYears: number;
  subjects: string[];
  boards: BoardType[];
  cities: string[];
  localities: string[];
  pricePerHour: number;
  pricePerMonth: number;
  gender: 'Female' | 'Male';
  mode: TeachingModeType;
  bio: string;
  verified: boolean;
  phone: string;
  badge?: string;
  badgeColor?: string;
  classesHandled: string[];
  demoClassAvailable: boolean;
}

export interface ParentRequest {
  id: string;
  parentName: string;
  studentName?: string;
  phone: string;
  studentClass: string;
  board: BoardType;
  subjects: string[];
  city: string;
  locality?: string;
  preferredGender: GenderPreference;
  preferredTiming?: string;
  mode: TeachingModeType;
  notes?: string;
  status: 'Pending' | 'Demo Scheduled' | 'Matched' | 'Active';
  createdAt: string;
}

export interface TutorApplication {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  qualification: string;
  experienceYears: number;
  subjects: string[];
  cities: string[];
  preferredMode: TeachingModeType;
  bio: string;
  status: 'Received' | 'Verification In Progress' | 'Approved';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  parentName: string;
  studentName: string;
  studentClass: string;
  board: string;
  city: string;
  rating: number;
  reviewText: string;
  improvementText: string;
  tutorAssigned: string;
  date: string;
}

export interface CoverageArea {
  city: string;
  state: string;
  tagline: string;
  popularLocalities: string[];
  tutorsCount: number;
  image: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Parents' | 'Tutors' | 'Demo Class' | 'Fees & Payment';
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface Assignment {
  id: string;
  tutor_id: string;
  request_id: string;
  fee_agreed: number;
  assigned_date: string;
  status: 'Active' | 'Completed' | 'Cancelled';
  
  // Joined fields for convenience
  tutorName?: string;
  parentName?: string;
  parentPhone?: string;
  subjects?: string[];
  city?: string;
}

export interface FeeCollection {
  id: string;
  assignment_id: string;
  month_year: string; // e.g., '2026-09'
  amount: number;
  payment_date: string;
  payment_mode: string;
  status: 'Paid' | 'Pending';
  txn_id?: string;

  // Joined fields
  parentName?: string;
  studentName?: string;
  tutorName?: string;
}
