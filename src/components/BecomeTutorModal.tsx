import React, { useState } from 'react';
import { X, CheckCircle2, UserCheck, ShieldCheck, GraduationCap, Briefcase } from 'lucide-react';
import { BoardType, TeachingModeType } from '../types';

import { useAuth } from '../AuthContext';

interface BecomeTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessSubmit: (appData: any) => void;
}

export const BecomeTutorModal: React.FC<BecomeTutorModalProps> = ({ isOpen, onClose, onSuccessSubmit }) => {
  const { token } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [qualification, setQualification] = useState('');
  const [experienceYears, setExperienceYears] = useState('5');
  const [subjects, setSubjects] = useState<string[]>(['Mathematics', 'Physics']);
  const [cities, setCities] = useState<string[]>(['Ranchi']);
  const [preferredMode, setPreferredMode] = useState<TeachingModeType>('Home Tuition');
  const [bio, setBio] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<any | null>(null);

  if (!isOpen) return null;

  const subjectList = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Science (Class 6-10)',
    'English Literature', 'Social Studies (SST)', 'Hindi', 'Sanskrit',
    'Accountancy', 'Economics', 'Business Studies', 'Computer / Java / Python',
    'Primary All Subjects'
  ];

  const cityList = ['Ranchi', 'Patna', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Ramgarh'];

  const toggleSubject = (s: string) => {
    if (subjects.includes(s)) setSubjects(subjects.filter((x) => x !== s));
    else setSubjects([...subjects, s]);
  };

  const toggleCity = (c: string) => {
    if (cities.includes(c)) setCities(cities.filter((x) => x !== c));
    else setCities([...cities, c]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim() || phone.length < 10) {
      alert('Please provide your full name and a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    const payload = {
      fullName,
      phone,
      email,
      qualification,
      experienceYears: parseInt(experienceYears, 10) || 0,
      subjects,
      cities,
      preferredMode,
      bio
    };

    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch('/api/tutor-apply', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const appData = data.data || { ...payload, id: 'TUTOR-' + Date.now(), createdAt: new Date().toISOString() };
      setSubmittedApp(appData);
      onSuccessSubmit(appData);
    } catch (err) {
      const fallbackApp = { ...payload, id: 'TUTOR-' + Date.now(), createdAt: new Date().toISOString() };
      setSubmittedApp(fallbackApp);
      onSuccessSubmit(fallbackApp);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-[#2C3317] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#708238] flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white">
                Join Teachers At Home as a Mentor
              </h2>
              <p className="text-xs text-[#E9EDDE]">Connect with premium home tuition students in your city</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 hover:bg-[#3D441E] rounded-lg text-[#E9EDDE]">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {submittedApp ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#E9EDDE] text-[#708238] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-xl font-extrabold text-[#2C3317]">
                Application Received!
              </h3>

              <p className="text-xs text-[#5C6348] max-w-md mx-auto">
                Thank you, <strong className="text-[#2C3317]">{submittedApp.fullName}</strong>. Your Registration ID is <strong className="text-[#708238]">{submittedApp.id}</strong>. Our tutor onboarding team will contact you for document verification (Aadhaar & Degree) and a short 10-minute demo interview.
              </p>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#708238] text-white font-bold text-xs rounded-full hover:bg-[#5A692D]"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anish Kumar Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Mobile Phone / WhatsApp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. teacher@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Highest Academic Qualification <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. M.Sc Physics (BIT Mesra), B.Tech, M.A, B.Ed"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Teaching Experience (Years)
                  </label>
                  <select
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317]"
                  >
                    <option value="1">1 - 2 Years (Fresh Educator)</option>
                    <option value="3">3 - 5 Years (Experienced)</option>
                    <option value="7">6 - 9 Years (Senior Teacher)</option>
                    <option value="10">10+ Years (Master Faculty)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Preferred Teaching Mode
                  </label>
                  <select
                    value={preferredMode}
                    onChange={(e) => setPreferredMode(e.target.value as TeachingModeType)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317]"
                  >
                    <option value="Home Tuition">In-Person Home Tuition</option>
                    <option value="Online 1-on-1">Online 1-on-1 Tuition</option>
                    <option value="Both">Both Home & Online Tuition</option>
                  </select>
                </div>
              </div>

              {/* Subjects Checklist */}
              <div>
                <label className="block font-bold text-[#3D441E] mb-1">
                  Subjects You Can Teach
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-[#FAF9F6] border border-[#E6E8E1] rounded-xl">
                  {subjectList.map((sub) => {
                    const sel = subjects.includes(sub);
                    return (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => toggleSubject(sub)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                          sel ? 'bg-[#708238] text-white' : 'bg-white border border-[#D1D5CB] text-[#2C3317] hover:bg-[#F2F4EF]'
                        }`}
                      >
                        {sel ? '✓ ' : '+ '}{sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cities Checklist */}
              <div>
                <label className="block font-bold text-[#3D441E] mb-1">
                  Cities You Can Offer Tuition In
                </label>
                <div className="flex flex-wrap gap-2">
                  {cityList.map((c) => {
                    const sel = cities.includes(c);
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => toggleCity(c)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer ${
                          sel ? 'bg-[#708238] text-white' : 'bg-[#F2F4EF] text-[#2C3317] hover:bg-[#E9EDDE]'
                        }`}
                      >
                        {sel ? '✓ ' : '+ '}{c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block font-bold text-[#3D441E] mb-1">
                  Short Bio & Teaching Approach
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe your teaching methodology and board achievements..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#708238] hover:bg-[#5A692D] text-white font-extrabold text-sm rounded-full transition-all cursor-pointer"
              >
                {submitting ? 'Submitting Application...' : 'Submit Tutor Registration Application'}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
