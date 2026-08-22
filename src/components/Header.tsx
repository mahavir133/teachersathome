import React, { useState } from 'react';
import { GraduationCap, Phone, MessageSquare, PlusCircle, UserPlus, Sparkles, BookOpen, Clock, Menu, X, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  onRequestTutor: () => void;
  onBecomeTutor: () => void;
  onOpenAIAdvisor: () => void;
  onOpenMyRequests: () => void;
  onOpenAdmin: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  myRequestsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onRequestTutor,
  onBecomeTutor,
  onOpenAIAdvisor,
  onOpenMyRequests,
  onOpenAdmin,
  activeSection,
  setActiveSection,
  myRequestsCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E6E8E1] shadow-xs">
      {/* Top Bar Banner */}
      <div className="bg-[#2C3317] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-[#708238] text-white px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider">
              Free Demo
            </span>
            <span className="text-white/90">🎁 Book a 100% FREE 1-Hour Home Demo Class Today! Verified Tutors within 24-48 Hours</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <a 
              href="tel:+919334349207" 
              className="flex items-center gap-1 hover:text-[#E9EDDE] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#708238]" />
              <span>Call: +91 93343 49207</span>
            </a>
            <a 
              href="https://wa.me/919334349207?text=Hello%20Teachers%20At%20Home,%20I%20need%20a%20home%20tutor%20for%20my%20child." 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[#E9EDDE] hover:text-white transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#708238]" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => scrollTo('hero')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-xl bg-[#708238] flex items-center justify-center text-white shadow-sm group-hover:bg-[#5A692D] transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold text-[#2C3317] tracking-tight">
                Teachers<span className="text-[#708238]">AtHome</span>
              </span>
              <span className="text-[10px] font-bold bg-[#E9EDDE] text-[#2C3317] px-1.5 py-0.5 rounded-md uppercase">
                India
              </span>
            </div>
            <p className="text-[11px] text-[#5C6348] font-medium">
              Verified 1-on-1 Home Tutors • Ranchi, Patna & Pan-India
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-[#3D441E]">
          <button 
            onClick={() => scrollTo('hero')} 
            className={`hover:text-[#708238] transition-colors ${activeSection === 'hero' ? 'text-[#708238] font-bold' : ''}`}
          >
            Home
          </button>
          <button 
            onClick={() => scrollTo('tutors')} 
            className={`hover:text-[#708238] transition-colors ${activeSection === 'tutors' ? 'text-[#708238] font-bold' : ''}`}
          >
            Find Tutors
          </button>
          <button 
            onClick={() => scrollTo('fee-calculator')} 
            className={`hover:text-[#708238] transition-colors ${activeSection === 'fee-calculator' ? 'text-[#708238] font-bold' : ''}`}
          >
            Fee Calculator
          </button>
          <button 
            onClick={() => scrollTo('boards')} 
            className={`hover:text-[#708238] transition-colors ${activeSection === 'boards' ? 'text-[#708238] font-bold' : ''}`}
          >
            Boards
          </button>
          <button 
            onClick={() => scrollTo('how-it-works')} 
            className={`hover:text-[#708238] transition-colors ${activeSection === 'how-it-works' ? 'text-[#708238] font-bold' : ''}`}
          >
            How It Works
          </button>
          <button 
            onClick={() => scrollTo('cities')} 
            className={`hover:text-[#708238] transition-colors ${activeSection === 'cities' ? 'text-[#708238] font-bold' : ''}`}
          >
            Cities
          </button>
          <button 
            onClick={() => scrollTo('faqs')} 
            className={`hover:text-[#708238] transition-colors ${activeSection === 'faqs' ? 'text-[#708238] font-bold' : ''}`}
          >
            FAQs
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-extrabold text-white bg-indigo-950 hover:bg-indigo-900 border border-indigo-900 rounded-full transition-colors cursor-pointer"
            title="Operational Console"
          >
            <span>Admin Console</span>
          </button>

          <button
            onClick={onOpenAIAdvisor}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#2C3317] bg-[#E9EDDE] hover:bg-[#D1D5CB] border border-[#D1D5CB] rounded-full transition-colors cursor-pointer"
            title="AI Study & Fee Advisor"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#708238]" />
            <span>AI Advisor</span>
          </button>

          {myRequestsCount > 0 && (
            <button
              onClick={onOpenMyRequests}
              className="relative flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#2C3317] bg-[#F2F4EF] hover:bg-[#E2E6D5] border border-[#E6E8E1] rounded-full transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-[#708238]" />
              <span>My Requests</span>
              <span className="ml-1 bg-[#708238] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-extrabold">
                {myRequestsCount}
              </span>
            </button>
          )}

          <button
            onClick={onBecomeTutor}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#2C3317] bg-white hover:bg-[#F2F4EF] border border-[#D1D5CB] rounded-full transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5 text-[#708238]" />
            <span>Join as Tutor</span>
          </button>

          <button
            onClick={onRequestTutor}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-extrabold text-white bg-[#708238] hover:bg-[#5A692D] rounded-full shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Request Tutor</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onRequestTutor}
            className="px-3 py-1.5 text-xs font-extrabold text-white bg-[#708238] hover:bg-[#5A692D] rounded-full shadow-xs"
          >
            Book Demo
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#2C3317] hover:bg-[#F2F4EF] rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E6E8E1] px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-[#E6E8E1]">
            <button
              onClick={() => { setMobileMenuOpen(false); onRequestTutor(); }}
              className="w-full py-2 px-3 text-xs font-bold text-white bg-[#708238] hover:bg-[#5A692D] rounded-full flex items-center justify-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Request Tutor</span>
            </button>

            <button
              onClick={() => { setMobileMenuOpen(false); onBecomeTutor(); }}
              className="w-full py-2 px-3 text-xs font-bold text-[#2C3317] bg-[#F2F4EF] hover:bg-[#E9EDDE] border border-[#E6E8E1] rounded-full flex items-center justify-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#708238]" />
              <span>Join as Tutor</span>
            </button>
          </div>

          <div className="flex flex-col space-y-2 text-sm font-medium text-[#3D441E] pt-1">
            <button 
              onClick={() => scrollTo('hero')} 
              className="text-left py-1.5 px-2 hover:bg-[#F2F4EF] rounded-md font-semibold"
            >
              Home
            </button>
            <button 
              onClick={() => scrollTo('tutors')} 
              className="text-left py-1.5 px-2 hover:bg-[#F2F4EF] rounded-md font-semibold"
            >
              Find Tutors Directory
            </button>
            <button 
              onClick={() => scrollTo('fee-calculator')} 
              className="text-left py-1.5 px-2 hover:bg-[#F2F4EF] rounded-md font-semibold"
            >
              Monthly Fee Calculator
            </button>
            <button 
              onClick={() => scrollTo('boards')} 
              className="text-left py-1.5 px-2 hover:bg-[#F2F4EF] rounded-md font-semibold"
            >
              Boards & Subjects
            </button>
            <button 
              onClick={() => scrollTo('how-it-works')} 
              className="text-left py-1.5 px-2 hover:bg-[#F2F4EF] rounded-md font-semibold"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollTo('cities')} 
              className="text-left py-1.5 px-2 hover:bg-[#F2F4EF] rounded-md font-semibold"
            >
              Cities & Localities Covered
            </button>
            <button 
              onClick={() => scrollTo('faqs')} 
              className="text-left py-1.5 px-2 hover:bg-[#F2F4EF] rounded-md font-semibold"
            >
              Frequently Asked Questions
            </button>
            <button 
              onClick={() => { setMobileMenuOpen(false); onOpenAIAdvisor(); }} 
              className="text-left py-2 px-3 bg-[#E9EDDE] text-[#2C3317] rounded-full font-bold flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#708238]" />
              <span>Ask AI Tuition Advisor</span>
            </button>
            {myRequestsCount > 0 && (
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenMyRequests(); }} 
                className="text-left py-2 px-3 bg-[#F2F4EF] text-[#2C3317] rounded-full font-bold flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#708238]" />
                  <span>My Demo Requests</span>
                </span>
                <span className="bg-[#708238] text-white text-xs px-2 py-0.5 rounded-full">
                  {myRequestsCount}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
