import React, { useState } from 'react';
import { Calculator, CheckCircle2, Sparkles, ArrowRight, Info } from 'lucide-react';
import { BoardType } from '../types';

interface FeeCalculatorProps {
  onRequestDemoWithDetails: (details: {
    studentClass: string;
    board: BoardType;
    city: string;
    phone: string;
    notes?: string;
  }) => void;
}

export const FeeCalculator: React.FC<FeeCalculatorProps> = ({ onRequestDemoWithDetails }) => {
  const [gradeCategory, setGradeCategory] = useState<'primary' | 'middle' | 'secondary' | 'senior' | 'jee-neet'>('secondary');
  const [board, setBoard] = useState<BoardType>('CBSE');
  const [daysPerWeek, setDaysPerWeek] = useState<number>(5);
  const [tutorTier, setTutorTier] = useState<'standard' | 'experienced' | 'senior'>('experienced');
  const [city, setCity] = useState('Ranchi');
  const [phoneInput, setPhoneInput] = useState('');
  const [showBookForm, setShowBookForm] = useState(false);

  // Calculation Logic
  const getBaseFeePerClass = () => {
    let base = 250;
    if (gradeCategory === 'primary') base = 180;
    if (gradeCategory === 'middle') base = 220;
    if (gradeCategory === 'secondary') base = 280;
    if (gradeCategory === 'senior') base = 350;
    if (gradeCategory === 'jee-neet') base = 480;

    if (tutorTier === 'experienced') base *= 1.25;
    if (tutorTier === 'senior') base *= 1.6;

    if (board === 'ICSE/ISC' || board === 'IB/IGCSE') base *= 1.15;

    return Math.round(base);
  };

  const baseFee = getBaseFeePerClass();
  const classesPerMonth = daysPerWeek * 4;
  const estimatedMonthlyFeeMin = Math.round((classesPerMonth * baseFee * 0.92) / 100) * 100;
  const estimatedMonthlyFeeMax = Math.round((classesPerMonth * baseFee * 1.08) / 100) * 100;

  const handleBookEstimate = () => {
    if (!phoneInput || phoneInput.length < 10) {
      alert('Please enter a valid 10-digit mobile number to lock this fee estimate.');
      return;
    }
    const gradeLabel = gradeCategory === 'primary' ? 'Class 1-5' : gradeCategory === 'middle' ? 'Class 6-8' : gradeCategory === 'secondary' ? 'Class 9-10' : gradeCategory === 'senior' ? 'Class 11-12' : 'JEE/NEET';
    onRequestDemoWithDetails({
      studentClass: gradeLabel,
      board: board,
      city: city,
      phone: phoneInput,
      notes: `Fee Estimate locked: ₹${estimatedMonthlyFeeMin} - ₹${estimatedMonthlyFeeMax}/month for ${daysPerWeek} days/week (${tutorTier} tier).`
    });
  };

  return (
    <section id="fee-calculator" className="py-16 bg-white border-b border-[#E6E8E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black text-[#2C3317] bg-[#E9EDDE] border border-[#D1D5CB] px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-[#708238]" />
            100% Transparent Fee Calculator
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C3317] tracking-tight mt-3">
            Estimate Monthly Home Tuition Fee for Your Child
          </h2>
          <p className="text-sm text-[#5C6348] mt-2">
            No hidden charges. Choose grade level, board, and weekly frequency to calculate customized monthly budget.
          </p>
        </div>

        <div className="bg-[#F2F4EF] border border-[#E6E8E1] rounded-2xl p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start shadow-sm">
          
          {/* Left Controls */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Grade Category */}
            <div>
              <label className="block text-xs font-extrabold text-[#3D441E] uppercase tracking-wider mb-2">
                1. Select Student Grade / Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'primary', label: 'Primary (Class 1-5)', desc: 'All Subjects' },
                  { id: 'middle', label: 'Middle (Class 6-8)', desc: 'Maths, Sci, Eng' },
                  { id: 'secondary', label: 'Class 9 - 10', desc: 'Board Foundation' },
                  { id: 'senior', label: 'Class 11 - 12', desc: 'PCM / PCB / Comm' },
                  { id: 'jee-neet', label: 'JEE / NEET Prep', desc: 'Target Medical/Eng' }
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setGradeCategory(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      gradeCategory === item.id
                        ? 'bg-[#708238] text-white border-[#708238] shadow-sm'
                        : 'bg-white text-[#3D441E] border-[#E6E8E1] hover:border-[#D1D5CB]'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className={`text-[10px] ${gradeCategory === item.id ? 'text-[#E9EDDE]' : 'text-[#5C6348]'}`}>
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Board Selection */}
            <div>
              <label className="block text-xs font-extrabold text-[#3D441E] uppercase tracking-wider mb-2">
                2. Select Educational Board
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(['CBSE', 'ICSE/ISC', 'JAC', 'BSEB', 'IB/IGCSE'] as BoardType[]).map((b) => (
                  <button
                    type="button"
                    key={b}
                    onClick={() => setBoard(b)}
                    className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all cursor-pointer ${
                      board === b
                        ? 'bg-[#708238] text-white border-[#708238]'
                        : 'bg-white text-[#3D441E] border-[#E6E8E1] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Days per Week */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-extrabold text-[#3D441E] uppercase tracking-wider">
                  3. Classes per Week
                </label>
                <span className="text-xs font-bold text-[#708238]">
                  {daysPerWeek} Days / Week ({classesPerMonth} sessions/month)
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[3, 4, 5, 6].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDaysPerWeek(d)}
                    className={`py-2.5 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                      daysPerWeek === d
                        ? 'bg-[#708238] text-white border-[#708238] shadow-xs'
                        : 'bg-white text-[#3D441E] border-[#E6E8E1] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    {d} Days/Wk
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Tutor Tier */}
            <div>
              <label className="block text-xs font-extrabold text-[#3D441E] uppercase tracking-wider mb-2">
                4. Preferred Tutor Qualification Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'standard', title: 'Graduate Tutor', exp: '2-4 yrs experience' },
                  { id: 'experienced', title: 'Senior Educator', exp: '5-8 yrs experience' },
                  { id: 'senior', title: 'Ex-School / IITian', exp: '8+ yrs experience' }
                ].map((tier) => (
                  <button
                    type="button"
                    key={tier.id}
                    onClick={() => setTutorTier(tier.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      tutorTier === tier.id
                        ? 'bg-[#708238] text-white border-[#708238] shadow-sm'
                        : 'bg-white text-[#3D441E] border-[#E6E8E1] hover:border-[#D1D5CB]'
                    }`}
                  >
                    <div className="text-xs font-bold">{tier.title}</div>
                    <div className={`text-[10px] ${tutorTier === tier.id ? 'text-[#E9EDDE]' : 'text-[#5C6348]'}`}>
                      {tier.exp}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Calculation Output Card */}
          <div className="lg:col-span-5 bg-[#2C3317] text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-[#3D441E] space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-[#708238] text-white px-2.5 py-0.5 rounded-full">
                Estimated Tuition Budget
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#E9EDDE] mt-2">
                ₹{estimatedMonthlyFeeMin.toLocaleString('en-IN')} - ₹{estimatedMonthlyFeeMax.toLocaleString('en-IN')}
                <span className="text-sm font-semibold text-[#D1D5CB]"> / month</span>
              </div>
              <p className="text-xs text-[#E2E6D5] mt-1">
                Includes {classesPerMonth} home classes/month (approx. ₹{baseFee}/hr).
              </p>
            </div>

            <div className="space-y-2 text-xs border-t border-[#3D441E] pt-4 text-[#E2E6D5]">
              <div className="flex items-center justify-between">
                <span>Free Demo Session</span>
                <span className="font-bold text-[#E9EDDE]">₹0 (100% FREE)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tutor Allocation Fee</span>
                <span className="font-bold text-[#E9EDDE]">₹0 (NO Registration Fee)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tutor Replacement</span>
                <span className="font-bold text-[#E9EDDE]">Unlimited Free</span>
              </div>
            </div>

            {/* Quick Lock Estimate Input */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-[#E9EDDE] mb-1">
                Enter Mobile Number to Lock Estimate & Book Free Demo
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  placeholder="10-digit Phone"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(e.target.value)}
                  maxLength={10}
                  className="flex-1 bg-[#FAF9F6] text-[#2C3317] px-3 py-2.5 rounded-full text-xs font-bold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleBookEstimate}
                  className="bg-[#708238] hover:bg-[#5A692D] text-white font-black text-xs px-5 py-2.5 rounded-full transition-colors cursor-pointer shrink-0"
                >
                  Get Demo
                </button>
              </div>
            </div>

            <div className="text-[11px] text-[#D1D5CB] flex items-start gap-1.5 pt-1">
              <Info className="w-3.5 h-3.5 text-[#E9EDDE] shrink-0 mt-0.5" />
              <span>Exact fee is finalized after the 1-hour free home demo session based on subject combination and locality distance.</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
