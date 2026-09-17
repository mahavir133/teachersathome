import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FeeCalculator } from './components/FeeCalculator';
import { TutorDirectory } from './components/TutorDirectory';
import { BoardCategoryGrid } from './components/BoardCategoryGrid';
import { HowItWorks } from './components/HowItWorks';
import { CoverageCities } from './components/CoverageCities';

import { FAQ } from './components/FAQ';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { RequestTutorModal } from './components/RequestTutorModal';
import { BecomeTutorModal } from './components/BecomeTutorModal';
import { AdminConsoleDrawer } from './components/AdminConsoleDrawer';
import { Tutor, ParentRequest, BoardType } from './types';
import { Sparkles, X, MessageSquare } from 'lucide-react';
import { Routes, Route } from 'react-router-dom';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './pages/Dashboard';

function LandingPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [adminConsoleOpen, setAdminConsoleOpen] = useState(false);

  const fetchTutors = async () => {
    try {
      const res = await fetch('/api/tutors');
      const data = await res.json();
      setTutors(data);
    } catch (e) {
      console.error("Failed to load dynamic tutors", e);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);


  const [activeSection, setActiveSection] = useState('hero');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedTutorForDemo, setSelectedTutorForDemo] = useState<Tutor | null>(null);
  const [becomeTutorModalOpen, setBecomeTutorModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleOpenRequestModal = (tutor?: Tutor | null) => {
    setSelectedTutorForDemo(tutor || null);
    setRequestModalOpen(true);
  };

  const handleSuccessParentRequest = (confirmedData: ParentRequest) => {
    // We rely on the backend now. Optional: Show a toast here.
  };

  const handleQuickDemoFromHeroOrCalc = (details: {
    studentClass: string;
    board: BoardType;
    city: string;
    phone: string;
    studentName?: string;
    notes?: string;
  }) => {
    const newReq: ParentRequest = {
      id: 'REQ-' + Math.floor(100000 + Math.random() * 900000),
      parentName: 'Parent (' + details.phone + ')',
      studentName: details.studentName || 'Parent (' + details.phone + ')\'s Child',
      phone: details.phone,
      studentClass: details.studentClass,
      board: details.board,
      subjects: ['Maths & Science'],
      city: details.city,
      preferredGender: 'Any',
      mode: 'Home Tuition',
      notes: details.notes || 'Submitted via Quick Hero Booking',
      status: 'Demo Scheduled',
      createdAt: new Date().toISOString()
    };

    handleSuccessParentRequest(newReq);
    setRequestModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header */}
      <Header
        onRequestTutor={() => handleOpenRequestModal()}
        onBecomeTutor={() => setBecomeTutorModalOpen(true)}
        onOpenAIAdvisor={() => setAiAdvisorModalOpen(true)}
        onOpenMyRequests={() => {}}
        onOpenAdmin={() => setAdminConsoleOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        myRequestsCount={0}
      />

      {/* Main Content Sections */}
      <main>
        {/* Hero with Quick Booking Widget */}
        <Hero
          onRequestDemoWithDetails={handleQuickDemoFromHeroOrCalc}
          onExploreTutors={() => scrollToSection('tutors')}
        />

        {/* Why Choose Us */}
        <WhyChooseUs />

        {/* Interactive Fee Calculator */}
        <FeeCalculator
          onRequestDemoWithDetails={handleQuickDemoFromHeroOrCalc}
        />

        {/* Tutor Directory */}
        <TutorDirectory
          tutors={tutors}
          onRequestSpecificTutor={(tutor) => handleOpenRequestModal(tutor)}
        />

        {/* Boards Category Grid */}
        <BoardCategoryGrid
          onSelectBoardFilter={() => scrollToSection('tutors')}
          onRequestTutor={() => handleOpenRequestModal()}
        />

        {/* How It Works Stepper */}
        <HowItWorks
          onRequestTutor={() => handleOpenRequestModal()}
        />

        {/* Cities Coverage */}
        <CoverageCities
          onSelectCityFilter={() => scrollToSection('tutors')}
          onRequestTutor={() => handleOpenRequestModal()}
        />



        {/* FAQs */}
        <FAQ />

        {/* Contact Section */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onRequestTutor={() => handleOpenRequestModal()}
        onBecomeTutor={() => setBecomeTutorModalOpen(true)}
      />

      {/* Modals & Drawers */}
      <RequestTutorModal
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
        preselectedTutor={selectedTutorForDemo}
        onSuccessSubmit={handleSuccessParentRequest}
      />

      <BecomeTutorModal
        isOpen={becomeTutorModalOpen}
        onClose={() => setBecomeTutorModalOpen(false)}
        onSuccessSubmit={() => {}}
      />

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />





      <AdminConsoleDrawer
        isOpen={adminConsoleOpen}
        onClose={() => setAdminConsoleOpen(false)}
        onRefreshTutors={fetchTutors}
      />

      {/* Floating WhatsApp Button (Desktop) */}
      <a
        href="https://wa.me/918340543395?text=Hello%20Teachers%20At%20Home"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex fixed bottom-6 right-6 z-50 items-center justify-center p-4 bg-[#25D366] text-white rounded-full shadow-2xl hover:scale-110 transition-transform cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-8 h-8"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>

      {/* Floating Action Bar for Mobile */}
      <div className="fixed bottom-4 right-4 z-40 md:hidden flex items-center gap-2">
        <a
          href="https://wa.me/918340543395?text=Hello%20Teachers%20At%20Home"
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 bg-emerald-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
          title="WhatsApp Us"
        >
          <span className="sr-only">WhatsApp Us</span>
          💬
        </a>

        <button
          onClick={() => handleOpenRequestModal()}
          className="px-4 py-3 bg-indigo-600 text-white text-xs font-black rounded-full shadow-xl flex items-center gap-1.5"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Book Free Demo</span>
        </button>
      </div>

    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
