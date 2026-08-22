import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, ShieldCheck, MapPin, Award, CheckCircle2, Phone, Sparkles, User, BookOpen } from 'lucide-react';
import { Tutor, BoardType, GenderPreference } from '../types';

interface TutorDirectoryProps {
  tutors: Tutor[];
  onRequestSpecificTutor: (tutor: Tutor) => void;
}

export const TutorDirectory: React.FC<TutorDirectoryProps> = ({ tutors, onRequestSpecificTutor }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedBoard, setSelectedBoard] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');

  const filteredTutors = useMemo(() => {
    return tutors.filter((t) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = t.name.toLowerCase().includes(q);
        const matchesSubject = t.subjects.some((s) => s.toLowerCase().includes(q));
        const matchesCity = t.cities.some((c) => c.toLowerCase().includes(q));
        const matchesLocality = t.localities.some((l) => l.toLowerCase().includes(q));
        const matchesQual = t.qualification.toLowerCase().includes(q);
        if (!matchesName && !matchesSubject && !matchesCity && !matchesLocality && !matchesQual) {
          return false;
        }
      }

      // City
      if (selectedCity !== 'All') {
        if (!t.cities.includes(selectedCity)) return false;
      }

      // Board
      if (selectedBoard !== 'All') {
        if (!t.boards.includes(selectedBoard as BoardType)) return false;
      }

      // Subject
      if (selectedSubject !== 'All') {
        if (!t.subjects.includes(selectedSubject)) return false;
      }

      // Gender
      if (selectedGender !== 'All') {
        if (t.gender !== selectedGender) return false;
      }

      // Mode
      if (selectedMode !== 'All') {
        if (t.mode !== selectedMode && t.mode !== 'Both') return false;
      }

      return true;
    });
  }, [tutors, searchQuery, selectedCity, selectedBoard, selectedSubject, selectedGender, selectedMode]);

  return (
    <section id="tutors" className="py-16 bg-[#FAF9F6] border-b border-[#E6E8E1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-black text-[#2C3317] bg-[#E9EDDE] border border-[#D1D5CB] px-3 py-1 rounded-full uppercase tracking-wider">
            Verified Home Tutors Directory
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2C3317] tracking-tight mt-3">
            Browse Top Tutors Near Your Locality
          </h2>
          <p className="text-sm text-[#5C6348] mt-2">
            Every tutor is identity-checked, degree-verified, and available for a 100% Free Home Demo Class.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#F2F4EF] rounded-2xl p-4 sm:p-6 border border-[#E6E8E1] shadow-xs mb-8 space-y-4">
          
          {/* Top Search Input */}
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-[#5C6348]" />
            <input
              type="text"
              placeholder="Search by tutor name, subject (e.g. Physics, Biology, Maths), city or locality (Lalpur, Boring Road, Bistupur)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-[#D1D5CB] rounded-xl text-sm font-semibold text-[#2C3317] focus:ring-2 focus:ring-[#708238] focus:outline-none"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            
            {/* City */}
            <div>
              <label className="block text-[11px] font-bold text-[#5C6348] uppercase mb-1">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-white border border-[#D1D5CB] rounded-lg px-2.5 py-2 text-xs font-semibold text-[#2C3317]"
              >
                <option value="All">All Cities</option>
                <option value="Ranchi">Ranchi</option>
                <option value="Patna">Patna</option>
                <option value="Jamshedpur">Jamshedpur</option>
                <option value="Dhanbad">Dhanbad</option>
                <option value="Bokaro">Bokaro</option>
                <option value="Ramgarh">Ramgarh</option>
              </select>
            </div>

            {/* Board */}
            <div>
              <label className="block text-[11px] font-bold text-[#5C6348] uppercase mb-1">Board</label>
              <select
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                className="w-full bg-white border border-[#D1D5CB] rounded-lg px-2.5 py-2 text-xs font-semibold text-[#2C3317]"
              >
                <option value="All">All Boards</option>
                <option value="CBSE">CBSE</option>
                <option value="ICSE/ISC">ICSE / ISC</option>
                <option value="JAC">JAC (Jharkhand)</option>
                <option value="BSEB">BSEB (Bihar)</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[11px] font-bold text-[#5C6348] uppercase mb-1">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-white border border-[#D1D5CB] rounded-lg px-2.5 py-2 text-xs font-semibold text-[#2C3317]"
              >
                <option value="All">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Science">Science (Class 6-10)</option>
                <option value="English Literature">English Literature</option>
                <option value="Accountancy">Accountancy / Commerce</option>
                <option value="Computer Science">Computer / Java / Python</option>
              </select>
            </div>

            {/* Gender Preference */}
            <div>
              <label className="block text-[11px] font-bold text-[#5C6348] uppercase mb-1">Gender</label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full bg-white border border-[#D1D5CB] rounded-lg px-2.5 py-2 text-xs font-semibold text-[#2C3317]"
              >
                <option value="All">Any Gender</option>
                <option value="Female">Female Tutor Preferred</option>
                <option value="Male">Male Tutor</option>
              </select>
            </div>

            {/* Mode */}
            <div>
              <label className="block text-[11px] font-bold text-[#5C6348] uppercase mb-1">Mode</label>
              <select
                value={selectedMode}
                onChange={(e) => setSelectedMode(e.target.value)}
                className="w-full bg-white border border-[#D1D5CB] rounded-lg px-2.5 py-2 text-xs font-semibold text-[#2C3317]"
              >
                <option value="All">All Modes</option>
                <option value="Home Tuition">In-Person Home Tuition</option>
                <option value="Online 1-on-1">Online 1-on-1</option>
              </select>
            </div>

          </div>

          <div className="flex items-center justify-between text-xs text-[#5C6348] pt-1">
            <span>Showing <strong className="text-[#2C3317]">{filteredTutors.length}</strong> verified tutors matching your criteria</span>
            {(searchQuery || selectedCity !== 'All' || selectedBoard !== 'All' || selectedSubject !== 'All' || selectedGender !== 'All' || selectedMode !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCity('All');
                  setSelectedBoard('All');
                  setSelectedSubject('All');
                  setSelectedGender('All');
                  setSelectedMode('All');
                }}
                className="text-[#708238] font-bold hover:underline cursor-pointer"
              >
                Reset All Filters
              </button>
            )}
          </div>

        </div>

        {/* Tutor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white rounded-2xl border border-[#E6E8E1] shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group"
            >
              {/* Top Banner & Avatar Header */}
              <div className="p-5 pb-3 border-b border-[#E6E8E1] flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={tutor.avatar}
                    alt={tutor.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-[#E9EDDE] shadow-xs group-hover:scale-105 transition-transform"
                  />
                  {tutor.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-[#708238] text-white rounded-full p-0.5 shadow-xs" title="Identity & Degree Verified">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-base font-extrabold text-[#2C3317] truncate group-hover:text-[#708238] transition-colors">
                      {tutor.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-[#E9EDDE] text-[#2C3317] text-xs font-bold px-2 py-0.5 rounded-md shrink-0 border border-[#D1D5CB]">
                      <Star className="w-3.5 h-3.5 fill-[#708238] text-[#708238]" />
                      <span>{tutor.rating}</span>
                      <span className="text-[#5C6348] text-[10px]">({tutor.reviewsCount})</span>
                    </div>
                  </div>

                  <p className="text-xs font-bold text-[#708238] truncate mt-0.5">
                    {tutor.title}
                  </p>
                  <p className="text-[11px] text-[#5C6348] truncate mt-0.5">
                    {tutor.qualification} • {tutor.experienceYears} yrs exp
                  </p>

                  {tutor.badge && (
                    <span className="inline-block text-[10px] font-extrabold px-2 py-0.5 rounded-md border mt-1.5 bg-[#E9EDDE] text-[#2C3317] border-[#D1D5CB]">
                      {tutor.badge}
                    </span>
                  )}
                </div>
              </div>

              {/* Body Details */}
              <div className="p-5 space-y-3 flex-1">
                
                {/* Subjects Chips */}
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#5C6348] tracking-wider block mb-1">
                    Subjects Taught
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tutor.subjects.map((sub, idx) => (
                      <span key={idx} className="bg-[#F2F4EF] text-[#2C3317] text-[11px] font-semibold px-2 py-0.5 rounded-md border border-[#E6E8E1]">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Boards Covered */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#5C6348] font-medium">Boards:</span>
                  <span className="font-bold text-[#2C3317]">{tutor.boards.join(', ')}</span>
                </div>

                {/* Locations */}
                <div className="flex items-start gap-1.5 text-xs text-[#5C6348]">
                  <MapPin className="w-3.5 h-3.5 text-[#708238] shrink-0 mt-0.5" />
                  <span className="line-clamp-1 font-medium">
                    <strong className="text-[#2C3317]">{tutor.cities.join(', ')}:</strong> {tutor.localities.join(', ')}
                  </span>
                </div>

                {/* Bio Excerpt */}
                <p className="text-xs text-[#5C6348] line-clamp-2 italic bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E6E8E1]">
                  "{tutor.bio}"
                </p>

              </div>

              {/* Footer Price & Action */}
              <div className="p-4 bg-[#F2F4EF] border-t border-[#E6E8E1] flex items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-[#5C6348]">Starting Monthly Fee</div>
                  <div className="text-base font-black text-[#2C3317]">
                    ₹{tutor.pricePerMonth.toLocaleString('en-IN')}<span className="text-xs font-normal text-[#5C6348]">/mo</span>
                  </div>
                </div>

                <button
                  onClick={() => onRequestSpecificTutor(tutor)}
                  className="px-5 py-2.5 bg-[#708238] hover:bg-[#5A692D] text-white font-extrabold text-xs rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Book Free Demo</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {filteredTutors.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-[#E6E8E1] p-8">
            <User className="w-12 h-12 text-[#5C6348] mx-auto mb-3" />
            <h3 className="text-lg font-bold text-[#2C3317]">No matching tutors found</h3>
            <p className="text-xs text-[#5C6348] mt-1 max-w-md mx-auto">
              Don't worry! We have over 10,000 unlisted tutors across all cities. Submit a request and we will find the ideal tutor for you.
            </p>
          </div>
        )}

      </div>
    </section>
  );
};
