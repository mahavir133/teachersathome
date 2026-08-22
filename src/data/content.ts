import { CoverageArea, FAQItem, Testimonial } from '../types';

export const COVERAGE_AREAS: CoverageArea[] = [
  {
    city: 'Ranchi',
    state: 'Jharkhand',
    tagline: 'Capital Hub for Top Verified Home Tutors',
    popularLocalities: ['Lalpur', 'Harmu', 'Kanke Road', 'Bariatu', 'Doranda', 'Hinoo', 'Ashok Nagar', 'Morabadi', 'Piska More', 'Tatisilwai'],
    tutorsCount: 3850,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    city: 'Patna',
    state: 'Bihar',
    tagline: 'Premier Home Tuition & Board Exam Mentors',
    popularLocalities: ['Boring Road', 'Kankerbagh', 'Bailey Road', 'Rajendra Nagar', 'Patliputra', 'Anisabad', 'Danapur', 'Fraser Road'],
    tutorsCount: 4200,
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80'
  },
  {
    city: 'Jamshedpur',
    state: 'Jharkhand',
    tagline: 'Steel City Expert Tutors for ICSE & CBSE',
    popularLocalities: ['Bistupur', 'Sakchi', 'Telco', 'Sonari', 'Kadma', 'Golmuri', 'Mango', 'Adityapur'],
    tutorsCount: 2600,
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80'
  },
  {
    city: 'Dhanbad',
    state: 'Jharkhand',
    tagline: 'Coal Capital IIT-JEE & Board Tutors',
    popularLocalities: ['Bank More', 'Saraidhela', 'Hirapur', 'Steel Gate', 'Jagjeevan Nagar', 'Govindpur'],
    tutorsCount: 1850,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
  },
  {
    city: 'Bokaro',
    state: 'Jharkhand',
    tagline: 'Education Hub Top School Teachers at Home',
    popularLocalities: ['Sector 4', 'Sector 1', 'Sector 9', 'Chas', 'Cooperative Colony'],
    tutorsCount: 1400,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80'
  },
  {
    city: 'Ramgarh & Hazaribagh',
    state: 'Jharkhand',
    tagline: 'Trusted Home Tutors for All Classes',
    popularLocalities: ['Ramgarh Cantt', 'Main Road', 'Korrah', 'Matwari', 'Nutan Nagar'],
    tutorsCount: 950,
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    parentName: 'Sunil Kumar Sahay',
    studentName: 'Aarav Sahay',
    studentClass: 'Class 10 CBSE',
    board: 'CBSE Board',
    city: 'Lalpur, Ranchi',
    rating: 5,
    reviewText: 'We requested a Physics and Math tutor for Aarav before his board exams. Teachers At Home assigned Anish Sir within 24 hours. The free demo class gave us full confidence. Aarav scored 96.2% in Class 10 boards!',
    improvementText: 'Score improved from 68% to 96.2%',
    tutorAssigned: 'Anish Kumar Sharma',
    date: '15 July 2026'
  },
  {
    id: 'test-2',
    parentName: 'Dr. Archana Mishra',
    studentName: 'Ananya Mishra',
    studentClass: 'Class 12 ICSE/ISC',
    board: 'ISC Board',
    city: 'Boring Road, Patna',
    rating: 5,
    reviewText: 'We strictly needed a verified female tutor for Ananya’s Biology and Chemistry. Teachers At Home was extremely prompt and respectful. Priya ma’am was punctual, patient, and conducted practical doubt-clearing sessions.',
    improvementText: 'Biology score: 98/100 in ISC',
    tutorAssigned: 'Priya Mukherjee',
    date: '02 June 2026'
  },
  {
    id: 'test-3',
    parentName: 'Rameshwar Turi',
    studentName: 'Vikram Turi',
    studentClass: 'Class 10 JAC',
    board: 'JAC Board',
    city: 'Harmu, Ranchi',
    rating: 5,
    reviewText: 'For Jharkhand board students, getting good home tuition was difficult until we found Teachers At Home. The tutor knew the JAC paper pattern inside out. Excellent service and very reasonable monthly fee.',
    improvementText: 'Ranked Top 10 in School',
    tutorAssigned: 'Ritu Raj',
    date: '28 May 2026'
  },
  {
    id: 'test-4',
    parentName: 'Sanjay Aggarwal',
    studentName: 'Rishabh Aggarwal',
    studentClass: 'Class 11 PCM (JEE)',
    board: 'CBSE + IIT-JEE',
    city: 'Bistupur, Jamshedpur',
    rating: 5,
    reviewText: 'Rajesh Sir’s 1-on-1 coaching at home cleared Rishabh’s fundamental mechanics concepts. Being able to ask questions freely without hesitation made a huge difference. Highly recommend Teachers At Home!',
    improvementText: 'JEE Main Physics percentile: 99.1%',
    tutorAssigned: 'Rajesh Verma',
    date: '10 May 2026'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How quickly will I get a home tutor after submitting a request?',
    answer: 'Once you submit your requirement, our Academic Counselor contacts you within 1-2 hours to understand your exact needs. We arrange a verified tutor for a FREE 1-hour home demo class within 24 to 48 hours.',
    category: 'Parents'
  },
  {
    id: 'faq-2',
    question: 'Is the Demo Class really 100% Free?',
    answer: 'Yes! The 1-hour demo session at your home is completely free with no obligation. You only decide to continue and pay the tuition fee after you and your child are 100% satisfied with the tutor’s teaching style.',
    category: 'Demo Class'
  },
  {
    id: 'faq-3',
    question: 'How are tutors verified at Teachers At Home?',
    answer: 'Every mentor undergoes a strict 3-step verification process: 1) Aadhaar & Address Identity verification, 2) Academic Marksheet & Degree qualification audit, and 3) Live teaching demonstration evaluated by our senior educators.',
    category: 'Parents'
  },
  {
    id: 'faq-4',
    question: 'What if we are not satisfied with the tutor after a few classes?',
    answer: 'Your child’s learning is our top priority. If you feel the tutor is not a good fit at any point, simply notify us and we will arrange a replacement tutor within 24 hours at no extra charge.',
    category: 'Parents'
  },
  {
    id: 'faq-5',
    question: 'Can I request a female tutor for my daughter?',
    answer: 'Yes, absolutely! We have a large network of experienced female home tutors across all cities. You can explicitly select "Female Tutor Preferred" while requesting tuition.',
    category: 'Parents'
  },
  {
    id: 'faq-6',
    question: 'How are monthly tuition fees determined?',
    answer: 'Fees depend on student class grade (Primary, Middle, High School, 11-12 PCM/PCB/Commerce), number of subjects, class frequency (3 to 6 days/week), and tutor experience. You can use our interactive Fee Calculator to estimate exact fees.',
    category: 'Fees & Payment'
  },
  {
    id: 'faq-7',
    question: 'How can teachers apply to become a home tutor?',
    answer: 'Click on "Join as Tutor" in the top menu, fill out your academic background, preferred teaching subjects, and city localities. Our tutor onboarding team will call you for document verification and interview.',
    category: 'Tutors'
  }
];

export const WHY_CHOOSE_US = [
  {
    title: 'Rigorous 3-Step Verification',
    description: 'Aadhaar ID background check, degree verification, and live demo audit before any tutor enters your home.',
    icon: 'ShieldCheck',
    color: 'text-emerald-600 bg-emerald-50'
  },
  {
    title: '100% Free Home Demo Class',
    description: 'Experience the tutor’s teaching methodology in your living room before making any financial commitment.',
    icon: 'Sparkles',
    color: 'text-amber-600 bg-amber-50'
  },
  {
    title: 'Hassle-Free Replacement Guarantee',
    description: 'Not satisfied with progress? We provide an instant top-tier replacement tutor within 24-48 hours.',
    icon: 'RefreshCw',
    color: 'text-blue-600 bg-blue-50'
  },
  {
    title: 'Female Tutor Availability',
    description: 'Dedicated female tutors available for safety, comfort, and personalized girl-student guidance.',
    icon: 'UserCheck',
    color: 'text-rose-600 bg-rose-50'
  },
  {
    title: 'Parent Welcome to Sit-In',
    description: 'We welcome parents to sit in shared study spaces during classes to monitor teaching quality & progress.',
    icon: 'Eye',
    color: 'text-purple-600 bg-purple-50'
  },
  {
    title: 'Weekly Test & Progress Tracking',
    description: 'Regular chapter-wise tests and monthly parent report cards to track board exam readiness.',
    icon: 'TrendingUp',
    color: 'text-indigo-600 bg-indigo-50'
  }
];
