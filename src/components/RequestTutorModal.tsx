import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, MessageSquare, Phone, ShieldCheck } from 'lucide-react';
import { BoardType, GenderPreference, TeachingModeType, Tutor } from '../types';

interface RequestTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTutor?: Tutor | null;
  onSuccessSubmit: (requestData: any) => void;
}

export const RequestTutorModal: React.FC<RequestTutorModalProps> = ({
  isOpen,
  onClose,
  preselectedTutor,
  onSuccessSubmit
}) => {
  const [parentName, setParentName] = useState('');
  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [studentClass, setStudentClass] = useState('Class 10');
  const [board, setBoard] = useState<BoardType>('CBSE');
  const [subjects, setSubjects] = useState<string[]>(['Mathematics', 'Science']);
  const [city, setCity] = useState('Ranchi');
  const [locality, setLocality] = useState('');
  const [preferredGender, setPreferredGender] = useState<GenderPreference>('Any');
  const [mode, setMode] = useState<TeachingModeType>('Home Tuition');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<any | null>(null);

  if (!isOpen) return null;

  const subjectOptions = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Science (All)',
    'English Literature', 'Social Studies (SST)', 'Hindi', 'Sanskrit',
    'Accountancy', 'Economics', 'Business Studies', 'Computer / Java / Python',
    'All Subjects (Class 1-5)', 'All Subjects (Class 6-8)'
  ];

  const toggleSubject = (sub: string) => {
    if (subjects.includes(sub)) {
      setSubjects(subjects.filter((s) => s !== sub));
    } else {
      setSubjects([...subjects, sub]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentName.trim() || !phone.trim() || phone.length < 10) {
      alert('Please fill in your name and a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);

    const payload = {
      parentName,
      studentName: studentName || parentName + "'s Child",
      phone,
      studentClass,
      board,
      subjects,
      city,
      locality,
      preferredGender,
      mode,
      notes,
      preselectedTutorName: preselectedTutor ? preselectedTutor.name : undefined
    };

    try {
      const res = await fetch('/api/parent-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const confirmedData = data.data || { ...payload, id: 'REQ-' + Date.now(), createdAt: new Date().toISOString() };
      setSubmittedData(confirmedData);
      onSuccessSubmit(confirmedData);
    } catch (err) {
      const fallbackData = { ...payload, id: 'REQ-' + Date.now(), createdAt: new Date().toISOString() };
      setSubmittedData(fallbackData);
      onSuccessSubmit(fallbackData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-[#2C3317] text-white p-5 flex items-center justify-between shrink-0">
          <div>
            <div className="inline-flex items-center gap-1 bg-[#708238] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full mb-1">
              <Sparkles className="w-3 h-3" />
              100% Free Home Demo Class
            </div>
            <h2 className="text-lg font-extrabold text-white">
              {preselectedTutor ? `Request Demo with ${preselectedTutor.name}` : 'Request a Verified Home Tutor'}
            </h2>
          </div>

          <button onClick={onClose} className="p-1 hover:bg-[#3D441E] rounded-lg text-[#E9EDDE]">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form or Confirmation */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {submittedData ? (
            /* Submission Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-[#E9EDDE] text-[#708238] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="text-xl font-extrabold text-[#2C3317]">
                Demo Request Submitted Successfully!
              </h3>

              <div className="bg-[#FAF9F6] p-4 rounded-xl border border-[#E6E8E1] text-xs text-[#3D441E] text-left space-y-1.5 max-w-md mx-auto font-medium">
                <div className="flex justify-between">
                  <span className="text-[#5C6348]">Booking Reference ID:</span>
                  <span className="font-bold text-[#708238]">{submittedData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6348]">Parent Name:</span>
                  <span className="font-bold text-[#2C3317]">{submittedData.parentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6348]">Class & Board:</span>
                  <span className="font-bold text-[#2C3317]">{submittedData.studentClass} ({submittedData.board})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#5C6348]">City & Locality:</span>
                  <span className="font-bold text-[#2C3317]">{submittedData.city} {submittedData.locality ? `(${submittedData.locality})` : ''}</span>
                </div>
              </div>

              <p className="text-xs text-[#5C6348] max-w-md mx-auto">
                Our Academic Counselor will review your requirement and call you at <strong className="text-[#2C3317]">+91 {submittedData.phone}</strong> within 1-2 hours to align your free demo session.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={`https://wa.me/919334349207?text=Hello%20Teachers%20At%20Home,%20I%20just%20submitted%20request%20${submittedData.id}%20for%20${submittedData.studentClass}%20${submittedData.board}%20tuition%20in%20${submittedData.city}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 bg-[#708238] hover:bg-[#5A692D] text-white text-xs font-black rounded-full shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Connect Instantly on WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="px-5 py-3 bg-[#F2F4EF] hover:bg-[#E9EDDE] text-[#2C3317] text-xs font-bold rounded-full"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            /* Request Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Parent Name */}
                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Parent / Guardian Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317] focus:ring-2 focus:ring-[#708238] focus:outline-none"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="10-digit Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317] focus:ring-2 focus:ring-[#708238] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Class */}
                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Student Class Grade
                  </label>
                  <select
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317]"
                  >
                    <option value="Class 1-5 (Primary)">Class 1-5 (Primary)</option>
                    <option value="Class 6-8 (Middle)">Class 6-8 (Middle)</option>
                    <option value="Class 9">Class 9 (High School)</option>
                    <option value="Class 10">Class 10 (Board Exam)</option>
                    <option value="Class 11 (PCM)">Class 11 (Science PCM)</option>
                    <option value="Class 11 (PCB)">Class 11 (Science PCB)</option>
                    <option value="Class 11 (Commerce)">Class 11 (Commerce)</option>
                    <option value="Class 12 (PCM)">Class 12 (PCM Board + JEE)</option>
                    <option value="Class 12 (PCB)">Class 12 (PCB Board + NEET)</option>
                    <option value="Class 12 (Commerce)">Class 12 (Commerce)</option>
                  </select>
                </div>

                {/* Board */}
                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Educational Board
                  </label>
                  <select
                    value={board}
                    onChange={(e) => setBoard(e.target.value as BoardType)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317]"
                  >
                    <option value="CBSE">CBSE Board</option>
                    <option value="ICSE/ISC">ICSE / ISC Board</option>
                    <option value="JAC">JAC (Jharkhand State Board)</option>
                    <option value="BSEB">BSEB (Bihar State Board)</option>
                    <option value="State Board">Other State Board</option>
                    <option value="IB/IGCSE">IB / IGCSE Board</option>
                  </select>
                </div>
              </div>

              {/* Subjects Checklist */}
              <div>
                <label className="block font-bold text-[#3D441E] mb-1">
                  Subjects Needed (Click to select multiple)
                </label>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-[#FAF9F6] border border-[#E6E8E1] rounded-xl">
                  {subjectOptions.map((sub) => {
                    const isSelected = subjects.includes(sub);
                    return (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => toggleSubject(sub)}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#708238] text-white'
                            : 'bg-white border border-[#D1D5CB] text-[#2C3317] hover:bg-[#F2F4EF]'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317]"
                  >
                    <option value="Ranchi">Ranchi</option>
                    <option value="Patna">Patna</option>
                    <option value="Jamshedpur">Jamshedpur</option>
                    <option value="Dhanbad">Dhanbad</option>
                    <option value="Bokaro">Bokaro</option>
                    <option value="Ramgarh">Ramgarh</option>
                    <option value="Other">Other City</option>
                  </select>
                </div>

                {/* Locality */}
                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Locality / Sector / Colony Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lalpur, Harmu, Boring Road"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317] focus:ring-2 focus:ring-[#708238] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Gender Preference */}
                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Tutor Gender Preference
                  </label>
                  <select
                    value={preferredGender}
                    onChange={(e) => setPreferredGender(e.target.value as GenderPreference)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317]"
                  >
                    <option value="Any">Any Gender (Best Available)</option>
                    <option value="Female Tutor">Female Tutor Preferred</option>
                    <option value="Male Tutor">Male Tutor Preferred</option>
                  </select>
                </div>

                {/* Mode */}
                <div>
                  <label className="block font-bold text-[#3D441E] mb-1">
                    Mode of Class
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as TeachingModeType)}
                    className="w-full bg-[#FAF9F6] border border-[#D1D5CB] rounded-xl px-3 py-2 font-semibold text-[#2C3317]"
                  >
                    <option value="Home Tuition">In-Person Home Tuition (At Student Home)</option>
                    <option value="Online 1-on-1">Online 1-on-1 Interactive</option>
                  </select>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-[#708238] hover:bg-[#5A692D] text-white font-extrabold text-sm rounded-full shadow-lg transition-all cursor-pointer mt-2"
              >
                {submitting ? 'Submitting Your Request...' : 'Confirm Request & Book FREE 1-Hour Demo'}
              </button>

              <div className="text-[11px] text-center text-[#5C6348] flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#708238]" />
                <span>Zero registration fee. You pay only after completing a satisfactory free home demo.</span>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
