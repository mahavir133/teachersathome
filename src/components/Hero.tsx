import React, { useState } from 'react';
import { ShieldCheck, Star, Users, CheckCircle2, Sparkles, MapPin, BookOpen, Phone, ArrowRight, Award } from 'lucide-react';
import { BoardType } from '../types';

interface HeroProps {
  onRequestDemoWithDetails: (details: {
    studentClass: string;
    board: BoardType;
    city: string;
    phone: string;
  }) => void;
  onExploreTutors: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onRequestDemoWithDetails, onExploreTutors }) => {
  const [selectedClass, setSelectedClass] = useState('Class 10');
  const [selectedBoard, setSelectedBoard] = useState<BoardType>('CBSE');
  const [selectedCity, setSelectedCity] = useState('Ranchi');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmitQuickDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || phone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    onRequestDemoWithDetails({
      studentClass: selectedClass,
      board: selectedBoard,
      city: selectedCity,
      phone
    });
  };

  return (
    <section id="hero" className="relative bg-gradient-to-b from-[#2C3317] via-[#3D441E] to-[#2C3317] text-white overflow-hidden pt-8 pb-16 lg:py-20">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#708238]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#708238]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & Benefits */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Verified Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#708238]/25 border border-[#708238]/40 text-[#E9EDDE] text-xs font-bold tracking-wide">
              <ShieldCheck className="w-4 h-4 text-[#E9EDDE]" />
              <span>India's Most Trusted Home Tutor Provider • 100% Verified Mentors</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Get <span className="text-[#E9EDDE] underline decoration-[#708238]">Verified Home Tutors</span> at Your Doorstep in 24 Hours
            </h1>

            {/* Sub-headline */}
            <p className="text-[#E2E6D5] text-base sm:text-lg font-normal leading-relaxed max-w-2xl">
              Empowering students in <span className="text-white font-semibold underline decoration-[#708238]">Ranchi, Patna, Jamshedpur, Dhanbad, Bokaro</span> & across India with 1-on-1 personalized home tuition for <span className="text-white font-semibold">CBSE, ICSE, JAC, BSEB</span> & Competitive Exams.
            </p>

            {/* Core USPs Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-sm text-[#FAF9F6] font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#E9EDDE] shrink-0" />
                <span>100% FREE 1-Hour Home Demo Class</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#FAF9F6] font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#E9EDDE] shrink-0" />
                <span>Aadhaar & Degree Verified Teachers</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#FAF9F6] font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#E9EDDE] shrink-0" />
                <span>Hassle-Free Tutor Replacement Guarantee</span>
              </div>
              <div className="flex items-center gap-2.5 text-sm text-[#FAF9F6] font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#E9EDDE] shrink-0" />
                <span>Female Tutors Available on Request</span>
              </div>
            </div>

            {/* Quick Stats Banner */}
            <div className="pt-6 border-t border-[#3D441E]/80 flex flex-wrap items-center gap-8">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">10,000+</div>
                <div className="text-xs text-[#D1D5CB] font-medium">Verified Tutors</div>
              </div>

              <div className="h-8 w-px bg-[#5C6348] hidden sm:block" />

              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">25,000+</div>
                <div className="text-xs text-[#D1D5CB] font-medium">Happy Students</div>
              </div>

              <div className="h-8 w-px bg-[#5C6348] hidden sm:block" />

              <div>
                <div className="flex items-center gap-1 text-2xl sm:text-3xl font-black text-[#E9EDDE]">
                  <span>4.9</span>
                  <Star className="w-5 h-5 fill-[#E9EDDE]" />
                </div>
                <div className="text-xs text-[#D1D5CB] font-medium">1,200+ Parent Reviews</div>
              </div>
            </div>

          </div>

          {/* Right Column: Instant Demo Booking Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white text-[#2C3317] rounded-2xl shadow-xl p-6 sm:p-8 border border-[#E6E8E1] relative">
              <div className="absolute -top-3.5 left-6 bg-[#708238] text-white font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Free Home Demo Session</span>
              </div>

              <h2 className="text-xl font-extrabold text-[#2C3317] tracking-tight mt-1">
                Find a Home Tutor Near You
              </h2>
              <p className="text-xs text-[#5C6348] mb-5">
                Fill details below. Our Academic Advisor will call you within 2 hours!
              </p>

              <form onSubmit={handleSubmitQuickDemo} className="space-y-4">
                {/* Select Class */}
                <div>
                  <label className="block text-xs font-bold text-[#3D441E] uppercase tracking-wide mb-1">
                    Student Class / Grade
                  </label>
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-lg px-3.5 py-2.5 text-sm font-semibold text-[#2C3317] focus:ring-2 focus:ring-[#708238] focus:outline-none"
                  >
                    <option value="Class 1-5 (Primary)">Class 1 - 5 (Primary / All Subjects)</option>
                    <option value="Class 6-8 (Middle)">Class 6 - 8 (Middle School)</option>
                    <option value="Class 9">Class 9 (High School)</option>
                    <option value="Class 10">Class 10 (Board Exam)</option>
                    <option value="Class 11 (PCM)">Class 11 (Science PCM)</option>
                    <option value="Class 11 (PCB)">Class 11 (Science PCB)</option>
                    <option value="Class 11 (Commerce)">Class 11 (Commerce / Arts)</option>
                    <option value="Class 12 (PCM)">Class 12 (Science PCM Board + JEE)</option>
                    <option value="Class 12 (PCB)">Class 12 (Science PCB Board + NEET)</option>
                    <option value="Class 12 (Commerce)">Class 12 (Commerce / Accounts)</option>
                    <option value="Competitive Exam (JEE/NEET)">IIT-JEE Main / NEET Target</option>
                  </select>
                </div>

                {/* Select Board */}
                <div>
                  <label className="block text-xs font-bold text-[#3D441E] uppercase tracking-wide mb-1">
                    Educational Board
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['CBSE', 'ICSE/ISC', 'JAC', 'BSEB', 'State Board', 'IB/IGCSE'] as BoardType[]).map((board) => (
                      <button
                        type="button"
                        key={board}
                        onClick={() => setSelectedBoard(board)}
                        className={`py-2 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                          selectedBoard === board
                            ? 'bg-[#708238] text-white border-[#708238] shadow-xs'
                            : 'bg-[#F2F4EF] text-[#3D441E] border-[#E6E8E1] hover:bg-[#E9EDDE]'
                        }`}
                      >
                        {board}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Select City */}
                <div>
                  <label className="block text-xs font-bold text-[#3D441E] uppercase tracking-wide mb-1">
                    Select Your City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-lg px-3.5 py-2.5 text-sm font-semibold text-[#2C3317] focus:ring-2 focus:ring-[#708238] focus:outline-none"
                  >
                    <option value="Ranchi">Ranchi (Lalpur, Harmu, Kanke, Bariatu, Doranda...)</option>
                    <option value="Patna">Patna (Boring Road, Kankerbagh, Bailey Road...)</option>
                    <option value="Jamshedpur">Jamshedpur (Bistupur, Sakchi, Telco, Sonari...)</option>
                    <option value="Dhanbad">Dhanbad (Bank More, Saraidhela, Hirapur...)</option>
                    <option value="Bokaro">Bokaro Steel City (Sector 4, Chas...)</option>
                    <option value="Ramgarh">Ramgarh & Hazaribagh</option>
                    <option value="Kolkata">Kolkata & Howrah</option>
                    <option value="Delhi NCR">Delhi NCR / Gurgaon / Noida</option>
                    <option value="Other City">Other City in India</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-[#3D441E] uppercase tracking-wide mb-1">
                    Parent Contact Mobile Number <span className="text-rose-600">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#5C6348] text-xs font-bold">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                      className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-lg pl-12 pr-3.5 py-2.5 text-sm font-bold text-[#2C3317] focus:ring-2 focus:ring-[#708238] focus:outline-none"
                    />
                  </div>
                  {errorMsg && <p className="text-xs font-bold text-rose-600 mt-1">{errorMsg}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-[#708238] hover:bg-[#5A692D] text-white font-extrabold text-sm rounded-full shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Book 100% Free Demo Class</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-[#5C6348] font-medium pt-1">
                  🔒 Your phone number is safe. No spam. Instant 24-hr tutor allocation.
                </p>
              </form>

              <div className="mt-4 pt-4 border-t border-[#E6E8E1] flex items-center justify-between">
                <button
                  onClick={onExploreTutors}
                  className="text-xs font-bold text-[#708238] hover:text-[#5A692D] flex items-center gap-1"
                >
                  <span>Or browse tutor profiles manually →</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
