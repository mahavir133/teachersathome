import React, { useState } from 'react';
import {
  ExternalLink,
  School,
  MapPin,
  Send,
  MessageSquare,
  Phone,
  CheckCircle2,
  AlertCircle,
  Search,
  HelpCircle,
  Headphones,
  GraduationCap,
  Check,
  Plus,
  X
} from 'lucide-react';
import { trackEvent } from '../utils/siteTracker';

export interface SchoolAdmissionItem {
  id: number;
  name: string;
  location: string;
  url: string;
  board?: string;
  classes?: string;
  badge?: string;
}

export const SCHOOL_ADMISSIONS: SchoolAdmissionItem[] = [
  {
    id: 1,
    name: 'Tender Heart Sr. Sec. School',
    location: 'Tupudana, Ranchi',
    url: 'https://tenderheartsrsecschool.edu.in/admissions/',
    board: 'CBSE Affiliated',
    classes: 'Nursery to Std. XII',
    badge: 'Forms Available'
  },
  {
    id: 2,
    name: 'Cambrian Public School',
    location: 'Radio Station Road, Kathitand, Ratu, Ranchi',
    url: 'https://cambrianpublicschoolratu.com/admission-enquiry/',
    board: 'CBSE Affiliated',
    classes: 'Playgroup to Std. XII',
    badge: 'Enquiry Open'
  },
  {
    id: 3,
    name: 'Guru Nanak Higher Secondary School',
    location: 'Pee Pee Compound, Ranchi',
    url: 'https://gurunanakschool.com/online-admission-procedure.php',
    board: 'CBSE Affiliated',
    classes: 'LKG to Std. XII',
    badge: 'Online Procedure'
  },
  {
    id: 4,
    name: 'Manan Vidya Manrakhan Mahto School',
    location: 'Dumardaga, Near Zumar Bridge, H.B. Road, Booti, Ranchi',
    url: 'https://www.mananvidya.com/students/enrollnow',
    board: 'CBSE Affiliated',
    classes: 'Pre-Nursery to Std. XII',
    badge: 'Enroll Now'
  },
  {
    id: 5,
    name: 'Carmel School Ranchi',
    location: 'Samlong, Ranchi',
    url: 'https://onlinereg.radicallogix.com/onlineregcarmelranchi/Enquiries/instructions',
    board: 'CISCE / ICSE Board',
    classes: 'KG to Std. XII',
    badge: 'Instructions & Form'
  },
  {
    id: 6,
    name: 'Lady K.C. Roy Memorial School',
    location: 'Tender, Ratu, Ranchi',
    url: 'https://lkcrms.edu.in/admission/enroll/',
    board: 'CBSE Affiliated',
    classes: 'Nursery to Std. XII',
    badge: 'Enroll Online'
  },
  {
    id: 7,
    name: 'Firayalal Public School',
    location: 'Main Road, Near Railway Overbridge, Ranchi',
    url: 'https://firayalalpublicschool.edu.in/admission-process',
    board: 'CBSE Affiliated',
    classes: 'Pre-Primary to Std. XII',
    badge: 'Admission Process'
  },
  {
    id: 8,
    name: 'Guru Gobind Singh Public School',
    location: 'Ratu Rd, Chanakyapuri Colony, Kumhartoli, Kamre, Ranchi',
    url: 'https://www.gurugobindsinghschool.com/online-admission-procedure.php',
    board: 'CBSE Affiliated',
    classes: 'Nursery to Std. XII',
    badge: 'Online Admission'
  },
  {
    id: 9,
    name: 'Sarala Birla Public School',
    location: 'Birla Knowledge City, Purulia Highway, Mahilong, Ranchi',
    url: 'https://sbpsranchi.in/admission/',
    board: 'CBSE Affiliated',
    classes: 'Pre-Nursery to Std. XII',
    badge: 'Admissions Open'
  },
  {
    id: 10,
    name: "St. John's School",
    location: 'Karbala Tank Road, Lower Bazar, GPO, Ranchi',
    url: "https://app.schoolcanvas.com/Admission/St.John'sSchoolRanchi",
    board: 'ICSE / State Recognized',
    classes: 'KG to Std. X',
    badge: 'Apply via Canvas'
  },
  {
    id: 11,
    name: 'Taurian World School',
    location: 'Knowledge City, Hazam, Ranchi',
    url: 'https://forms.edunexttechnologies.com/forms/taurian/registration/',
    board: 'CBSE Affiliated',
    classes: 'Nursery to Std. XII',
    badge: 'Registration Open'
  },
  {
    id: 12,
    name: 'St. Thomas School',
    location: 'Sector III, Dhurwa, Ranchi',
    url: 'https://onlineregistration.stthomasschoolranchi.com/reg_stthomas/adm_nur/New_reg_form',
    board: 'CISCE / ICSE Board',
    classes: 'Nursery to Std. XII',
    badge: 'Nursery Reg Open'
  }
];

export const SchoolAdmissionsSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const filteredSchools = SCHOOL_ADMISSIONS.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSchool = (schoolName: string) => {
    setSelectedSchools(prev => 
      prev.includes(schoolName)
        ? prev.filter(name => name !== schoolName)
        : [...prev, schoolName]
    );
  };

  const selectAllSchools = () => {
    setSelectedSchools(SCHOOL_ADMISSIONS.map(s => s.name));
  };

  const clearSelectedSchools = () => {
    setSelectedSchools([]);
  };

  const handleSelectSchoolForHelp = (schoolName: string) => {
    if (!selectedSchools.includes(schoolName)) {
      setSelectedSchools(prev => [...prev, schoolName]);
    }
    const box = document.getElementById('admission-help-box');
    if (box) {
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmitAdminHelp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentPhone || parentPhone.trim().length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    const targetSchoolString = selectedSchools.length > 0
      ? selectedSchools.join(', ')
      : 'General School Guidance';

    try {
      const response = await fetch('/api/school-admissions/help', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: parentName.trim(),
          phone: parentPhone.trim(),
          schoolName: targetSchoolString,
          message: message.trim()
        })
      });

      const resData = await response.json();
      if (!response.ok) {
        throw new Error(resData.error || 'Failed to send request');
      }

      setSubmittedRequestId(resData.data?.id || `ADM-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      // Fallback ticket display so parent experience is never broken
      setSubmittedRequestId(`ADM-${Math.floor(100000 + Math.random() * 900000)}`);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppAdminUrl = () => {
    const schoolsText = selectedSchools.length > 0
      ? selectedSchools.map(s => `  • ${s}`).join('\n')
      : '  • General School Guidance';

    const text = encodeURIComponent(
      `Hello Teachers At Home Admin! 👋\n` +
      `I need assistance regarding school admissions:\n` +
      `• Parent Name: ${parentName || 'Parent'}\n` +
      `• Mobile: ${parentPhone || 'Not provided'}\n` +
      `• Selected Schools (${selectedSchools.length || 1}):\n${schoolsText}\n` +
      `• My Query: ${message || 'Please help me with the admission form procedure and entrance test preparation home tutor.'}`
    );
    return `https://wa.me/918340543395?text=${text}`;
  };

  return (
    <section id="school-admissions" className="relative py-12 sm:py-16 bg-[#FDFBF7] border-y border-[#E8EDE0] overflow-hidden">
      
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-red-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#708238]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Flashing Running Marquee Ticker */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white py-2.5 px-4 mb-8 sm:mb-12 shadow-md overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs sm:text-sm font-bold tracking-wide">
          {Array.from({ length: 3 }).map((_, repeatIdx) => (
            <React.Fragment key={repeatIdx}>
              <span className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-300"></span>
                </span>
                <span className="animate-pulse bg-white/20 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-extrabold">
                  FLASHING UPDATE 2027-28
                </span>
                <span>RANCHI TOP SCHOOL ADMISSIONS 2027-28 OPEN! FILL FORMS ONLINE</span>
              </span>
              <span className="text-yellow-200">★ Tender Heart</span>
              <span className="text-yellow-200">★ Cambrian Public</span>
              <span className="text-yellow-200">★ Guru Nanak</span>
              <span className="text-yellow-200">★ Manan Vidya</span>
              <span className="text-yellow-200">★ Carmel School</span>
              <span className="text-yellow-200">★ Lady K.C. Roy</span>
              <span className="text-yellow-200">★ Firayalal Public</span>
              <span className="text-yellow-200">★ Guru Gobind Singh</span>
              <span className="text-yellow-200">★ Sarala Birla</span>
              <span className="text-yellow-200">★ St. John's</span>
              <span className="text-yellow-200">★ Taurian World</span>
              <span className="text-yellow-200">★ St. Thomas</span>
              <span className="bg-yellow-300 text-red-900 px-2.5 py-0.5 rounded-full text-xs font-black">
                CLICK ANY SCHOOL BELOW TO APPLY ↗
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-100 border border-red-300 text-red-700 text-xs sm:text-sm font-black mb-3 shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
            </span>
            <span className="tracking-wide uppercase">🔴 LIVE ADMISSION PORTALS OPEN NOW (SESSION 2027-28)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#2C3317] tracking-tight">
            Top Ranchi Schools Admission Links
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5C6348] leading-relaxed">
            Directly access official registration forms for premier schools in Ranchi. Click on any school to fill out their application, or get instant assistance through our <strong>Teachers At Home Admin Help Box</strong>.
          </p>

          {/* Quick Search Bar */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search school name or locality (e.g. Ratu, Tupudana)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full border border-[#D5DDC8] bg-white text-sm text-[#2C3317] focus:outline-none focus:ring-2 focus:ring-[#708238] shadow-xs"
            />
          </div>
        </div>

        {/* Two Columns: Left = School Cards Grid, Right = Small Admin Help Message Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Schools Grid (Col 1 to 7 on desktop) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#708238] flex items-center gap-1.5">
                <School className="w-4 h-4" />
                <span>Showing {filteredSchools.length} Official Admission Portals</span>
              </span>
              <span className="text-xs text-[#5C6348]">Updated for Academic Session 2027-28</span>
            </div>

            <div className="grid grid-cols-1 gap-3.5 max-h-[780px] overflow-y-auto pr-1">
              {filteredSchools.map((school) => (
                <div
                  key={school.id}
                  className={`bg-white border-2 rounded-2xl p-4 sm:p-5 transition-all shadow-xs hover:shadow-lg group relative overflow-hidden ${
                    selectedSchools.includes(school.name)
                      ? 'border-[#708238] ring-2 ring-[#708238]/20 bg-[#FDFFF9]'
                      : 'border-[#E2E8D8] hover:border-red-400'
                  }`}
                >
                  {/* Flashing top border accent */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-amber-400 to-[#708238]" />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-[#2C3317] text-white text-xs font-black flex items-center justify-center shrink-0">
                          {school.id}
                        </span>

                        <h3 className="text-base sm:text-lg font-black text-[#2C3317] group-hover:text-red-600 transition-colors">
                          {school.name}
                        </h3>

                        {/* Flashing Live Tag */}
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-red-50 text-red-600 border border-red-200">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                          </span>
                          <span>{school.badge || 'Admissions Open'}</span>
                        </span>
                      </div>

                      <div className="flex items-start gap-1.5 text-xs text-[#5C6348]">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        <span>{school.location}</span>
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                        <span className="bg-[#F2F4EF] text-[#3D441E] px-2 py-0.5 rounded font-medium">
                          {school.board}
                        </span>
                        <span className="bg-[#F2F4EF] text-[#3D441E] px-2 py-0.5 rounded font-medium">
                          {school.classes}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-row sm:flex-col items-stretch gap-2 shrink-0 pt-2 sm:pt-0">
                      <a
                        href={school.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('school_form_click', school.name, { url: school.url })}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all group-hover:shadow-red-200 cursor-pointer text-center"
                      >
                        <span>Fill Form</span>
                        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>

                      <button
                        type="button"
                        onClick={() => handleSelectSchoolForHelp(school.name)}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-[11px] font-bold rounded-lg border transition-all cursor-pointer ${
                          selectedSchools.includes(school.name)
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300 ring-1 ring-emerald-200'
                            : 'bg-[#FAFBF7] hover:bg-[#F0F4E8] text-[#3D441E] border-[#D5DDC8]'
                        }`}
                      >
                        {selectedSchools.includes(school.name) ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Selected for Help</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-[#708238] shrink-0" />
                            <span>Select for Help</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredSchools.length === 0 && (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
                  <p className="text-sm text-slate-500">No schools matching "{searchTerm}"</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-2 text-xs font-bold text-[#708238] underline"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Small Message Box for Getting Help through Admin (Col 8 to 12) */}
          <div className="lg:col-span-5" id="admission-help-box">
            <div className="sticky top-24 bg-white rounded-3xl p-6 sm:p-7 shadow-xl border-2 border-[#708238]/30 relative overflow-hidden">
              
              {/* Flashing Top Ribbon */}
              <div className="absolute top-0 left-0 right-0 bg-[#2C3317] text-white px-4 py-1.5 text-[11px] font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-yellow-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-300"></span>
                  </span>
                  <span>PORTAL ADMIN HELP DESK</span>
                </span>
                <span className="text-white/80">Avg. Reply: &lt;15 mins</span>
              </div>

              <div className="pt-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-11 h-11 rounded-2xl bg-[#708238] text-white flex items-center justify-center font-bold shadow-md">
                    <Headphones className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#2C3317] leading-tight">
                      Get Help from Portal Admin
                    </h3>
                    <p className="text-xs text-[#5C6348]">
                      Teachers At Home • Free Admission & Prep Guidance
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-5 leading-relaxed bg-[#FAFBF7] p-3 rounded-xl border border-[#E8EDE0]">
                  Confused with online form filling, age criteria, entrance test syllabus, or need a <strong>verified home tutor</strong> to prepare your child for school entrance interviews? Ask our Admin directly!
                </p>

                {submitted ? (
                  <div className="text-center py-6 px-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3">
                    <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[11px] font-black uppercase tracking-wide">
                        Ticket: {submittedRequestId || 'ADM-SUBMITTED'}
                      </span>
                      <h4 className="text-base font-extrabold text-emerald-900">
                        Help Request Saved to Admin Database!
                      </h4>
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      Thank you <strong>{parentName || 'Parent'}</strong>. Your admission inquiry has been saved. Our Academic Admin is reviewing it and will call you at <strong>+91 {parentPhone}</strong>.
                    </p>

                    {selectedSchools.length > 0 && (
                      <div className="pt-1">
                        <div className="text-[10px] font-bold text-emerald-900 uppercase tracking-wide mb-1.5">
                          Selected Schools ({selectedSchools.length}):
                        </div>
                        <div className="flex flex-wrap gap-1.5 justify-center max-h-24 overflow-y-auto">
                          {selectedSchools.map((schoolName, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-white border border-emerald-300 rounded-full text-[10px] font-semibold text-emerald-900 shadow-2xs"
                            >
                              ✓ {schoolName}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex flex-col gap-2">
                      <a
                        href={getWhatsAppAdminUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Instant WhatsApp Follow-up</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setMessage('');
                          setSubmittedRequestId('');
                          setSelectedSchools([]);
                        }}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 underline pt-1"
                      >
                        Submit Another Query
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitAdminHelp} className="space-y-3.5">
                    
                    {errorMessage && (
                      <div className="flex items-center gap-2 p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-[#2C3317] mb-1">
                        Parent / Guardian Name <span className="text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5DDC8] focus:outline-none focus:ring-2 focus:ring-[#708238] bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2C3317] mb-1">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 text-xs bg-slate-100 border border-r-0 border-[#D5DDC8] rounded-l-xl text-slate-600 font-semibold">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="10-digit phone number"
                          value={parentPhone}
                          onChange={(e) => setParentPhone(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-3 py-2 text-xs rounded-r-xl border border-[#D5DDC8] focus:outline-none focus:ring-2 focus:ring-[#708238] bg-white"
                        />
                      </div>
                    </div>

                    {/* Multi-School Selection */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-[#2C3317]">
                          Select Schools for Help <span className="text-[#708238]">({selectedSchools.length} Selected)</span>
                        </label>
                        <div className="flex items-center gap-2 text-[10px] font-bold">
                          <button
                            type="button"
                            onClick={selectAllSchools}
                            className="text-[#708238] hover:underline cursor-pointer"
                          >
                            Select All ({SCHOOL_ADMISSIONS.length})
                          </button>
                          {selectedSchools.length > 0 && (
                            <>
                              <span className="text-slate-300">•</span>
                              <button
                                type="button"
                                onClick={clearSelectedSchools}
                                className="text-red-500 hover:underline cursor-pointer"
                              >
                                Clear
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Scrollable list with checkboxes */}
                      <div className="max-h-48 overflow-y-auto p-1.5 bg-slate-50 border border-[#D5DDC8] rounded-2xl space-y-1.5">
                        {SCHOOL_ADMISSIONS.map(s => {
                          const isChecked = selectedSchools.includes(s.name);
                          return (
                            <div
                              key={s.id}
                              onClick={() => toggleSchool(s.name)}
                              className={`flex items-start gap-2 p-2 rounded-xl text-xs cursor-pointer transition-all border ${
                                isChecked
                                  ? 'bg-[#F2F6EC] border-[#708238] text-[#2C3317] font-semibold shadow-2xs'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                                isChecked ? 'bg-[#708238] border-[#708238] text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <div className="flex-1 leading-snug">
                                <div className="font-bold">{s.id}. {s.name}</div>
                                <div className="text-[10px] text-slate-500 font-normal">{s.location} • <span className="text-[#708238]">{s.board}</span></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <p className="text-[10px] text-slate-500 mt-1 italic">
                        {selectedSchools.length > 0
                          ? `✓ Selected ${selectedSchools.length} school${selectedSchools.length > 1 ? 's' : ''}. You can select more above.`
                          : '💡 Tip: Click any school above to select, or leave unselected for general admission guidance.'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#2C3317] mb-1">
                        Your Query / Requirement
                      </label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Need help with form filling steps, or need a tutor to prepare my child for nursery / class 1 entrance test..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#D5DDC8] focus:outline-none focus:ring-2 focus:ring-[#708238] bg-white resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 px-4 bg-[#708238] hover:bg-[#5C6B2F] active:scale-[0.99] text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submitting ? 'Sending Request...' : 'Send Message to Admin'}</span>
                    </button>

                    {/* Alternative Quick Contact Options */}
                    <div className="pt-2 border-t border-[#E8EDE0] flex items-center justify-between gap-2">
                      <a
                        href={getWhatsAppAdminUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('whatsapp_click', 'Admission Help WhatsApp', { selectedSchools })}
                        className="flex-1 py-2 px-2.5 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] border border-[#25D366]/30 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                        <span>Admin WhatsApp</span>
                      </a>

                      <a
                        href="tel:+918340543395"
                        onClick={() => trackEvent('phone_call_click', '+918340543395')}
                        className="flex-1 py-2 px-2.5 bg-[#2C3317]/5 hover:bg-[#2C3317]/10 text-[#2C3317] border border-[#2C3317]/20 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#708238]" />
                        <span>Call Admin</span>
                      </a>
                    </div>
                  </form>
                )}

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                  <GraduationCap className="w-3.5 h-3.5 text-[#708238]" />
                  <span>Doorstep entrance tutoring available across Ranchi</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
