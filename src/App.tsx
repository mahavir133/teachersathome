import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhyChooseUs } from './components/WhyChooseUs';
import { FeeCalculator } from './components/FeeCalculator';
import { TutorDirectory } from './components/TutorDirectory';
import { BoardCategoryGrid } from './components/BoardCategoryGrid';
import { HowItWorks } from './components/HowItWorks';
import { CoverageCities } from './components/CoverageCities';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { RequestTutorModal } from './components/RequestTutorModal';
import { BecomeTutorModal } from './components/BecomeTutorModal';
import { AdminConsoleDrawer } from './components/AdminConsoleDrawer';
import { Tutor, ParentRequest, BoardType } from './types';
import { Sparkles, X } from 'lucide-react';
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


        {/* Testimonials */}
        <Testimonials />

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
