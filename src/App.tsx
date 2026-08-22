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
import { AITutorAdvisor } from './components/AITutorAdvisor';
import { UserRequestsDrawer } from './components/UserRequestsDrawer';
import { AdminConsoleDrawer } from './components/AdminConsoleDrawer';
import { Tutor, ParentRequest, BoardType } from './types';
import { Sparkles, X } from 'lucide-react';

export default function App() {
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
  const [myRequests, setMyRequests] = useState<ParentRequest[]>(() => {
    try {
      const saved = localStorage.getItem('teachers_at_home_requests');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeSection, setActiveSection] = useState('hero');
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedTutorForDemo, setSelectedTutorForDemo] = useState<Tutor | null>(null);
  const [becomeTutorModalOpen, setBecomeTutorModalOpen] = useState(false);
  const [aiAdvisorModalOpen, setAiAdvisorModalOpen] = useState(false);
  const [myRequestsDrawerOpen, setMyRequestsDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('teachers_at_home_requests', JSON.stringify(myRequests));
    } catch (e) {
      console.error(e);
    }
  }, [myRequests]);

  const handleOpenRequestModal = (tutor?: Tutor | null) => {
    setSelectedTutorForDemo(tutor || null);
    setRequestModalOpen(true);
  };

  const handleSuccessParentRequest = (confirmedData: ParentRequest) => {
    setMyRequests((prev) => [confirmedData, ...prev]);
  };

  const handleQuickDemoFromHeroOrCalc = (details: {
    studentClass: string;
    board: BoardType;
    city: string;
    phone: string;
    notes?: string;
  }) => {
    const newReq: ParentRequest = {
      id: 'REQ-' + Math.floor(100000 + Math.random() * 900000),
      parentName: 'Parent (' + details.phone + ')',
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
        onOpenMyRequests={() => setMyRequestsDrawerOpen(true)}
        onOpenAdmin={() => setAdminConsoleOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        myRequestsCount={myRequests.length}
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

        {/* AI Advisor Embedded Section */}
        <section id="ai-advisor" className="py-16 bg-slate-100 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-black text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Guidance
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
                Ask Our AI Home Tuition & Study Advisor
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Get instant answers regarding board exam preparation, study timetables, recommended tuition hours, and subject strategies.
              </p>
            </div>

            <AITutorAdvisor
              onRequestTutor={() => handleOpenRequestModal()}
            />
          </div>
        </section>

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
        onOpenAIAdvisor={() => setAiAdvisorModalOpen(true)}
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

      {aiAdvisorModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <AITutorAdvisor
              onClose={() => setAiAdvisorModalOpen(false)}
              onRequestTutor={() => {
                setAiAdvisorModalOpen(false);
                handleOpenRequestModal();
              }}
            />
          </div>
        </div>
      )}

      <UserRequestsDrawer
        isOpen={myRequestsDrawerOpen}
        onClose={() => setMyRequestsDrawerOpen(false)}
        requests={myRequests}
      />

      <AdminConsoleDrawer
        isOpen={adminConsoleOpen}
        onClose={() => setAdminConsoleOpen(false)}
        onRefreshTutors={fetchTutors}
      />

      {/* Floating Action Bar for Mobile */}
      <div className="fixed bottom-4 right-4 z-40 md:hidden flex items-center gap-2">
        <a
          href="https://wa.me/919334349207?text=Hello%20Teachers%20At%20Home"
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
