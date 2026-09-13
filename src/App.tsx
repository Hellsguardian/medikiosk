import React, { useState, useMemo } from 'react';
import {
  PATIENT_DATA,
  MEDICAL_EPISODES,
  RECENT_DOCUMENTS,
  UPCOMING_APPOINTMENTS,
} from './data/mockData';
import { NavTab, MedicalEpisode, MedicalReport, Appointment, ConsultationIntake } from './types';
import { Sidebar } from './components/Sidebar';
import { MobileSidebarDrawer } from './components/MobileSidebarDrawer';
import { Header } from './components/Header';
import { CurrentTreatmentCard } from './components/CurrentTreatmentCard';
import { NewConsultationCard } from './components/NewConsultationCard';
import { HealthTimeline } from './components/HealthTimeline';
import { RecentDocuments } from './components/RecentDocuments';
import { AppointmentCard } from './components/AppointmentCard';
import { PatientGreeting } from './components/PatientGreeting';

// Modals
import { EpisodeDetailModal } from './components/EpisodeDetailModal';
import { NewConsultationModal } from './components/NewConsultationModal';
import { DocumentModal } from './components/DocumentModal';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { AppointmentModal } from './components/AppointmentModal';
import { ProfileModal } from './components/ProfileModal';
import { AIHelpModal } from './components/AIHelpModal';

// Subviews
import { MyHealthView } from './components/views/MyHealthView';
import { DocumentsView } from './components/views/DocumentsView';
import { PrescriptionsView } from './components/views/PrescriptionsView';
import { AppointmentsView } from './components/views/AppointmentsView';

// Dedicated Full-Page Consultation Experience
import { ConsultationPage } from './components/consultation/ConsultationPage';

// Dedicated Authentication Experience (Sign In / Create Account)
import { AuthPage, AuthSuccessPayload } from './components/auth/AuthPage';

type ScreenCategory = 'mobile' | 'tablet' | 'desktop';

const getScreenCategory = (width: number): ScreenCategory => {
  if (width < 768) return 'mobile';
  if (width < 1200) return 'tablet';
  return 'desktop';
};

const getDefaultSidebarCollapsed = (category: ScreenCategory): boolean => {
  // Desktop (>= 1200px): Default EXPANDED (collapsed = false)
  // iPad / Tablet (768px - 1199px): Default COLLAPSED (collapsed = true)
  // Mobile (< 768px): Default COLLAPSED (hidden in normal flow, collapsed = true)
  return category !== 'desktop';
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [globalSearch, setGlobalSearch] = useState('');

  // 1. Responsive Screen Category State:
  // - 'mobile': < 768px
  // - 'tablet': 768px - 1199px
  // - 'desktop': >= 1200px
  const [screenCategory, setScreenCategory] = useState<ScreenCategory>(() => {
    if (typeof window !== 'undefined') {
      return getScreenCategory(window.innerWidth);
    }
    return 'desktop';
  });

  // 2. Sidebar Collapsed State:
  // Automatically synchronized to screen category defaults:
  // - Desktop: EXPANDED (collapsed = false)
  // - Tablet: COLLAPSED (collapsed = true)
  // - Mobile: COLLAPSED / Off-canvas drawer (collapsed = true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return getDefaultSidebarCollapsed(getScreenCategory(window.innerWidth));
    }
    return false;
  });

  // Mobile off-canvas drawer visibility (< 768px)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Track active category to detect breakpoint transitions without flickering
  const currentCategoryRef = React.useRef<ScreenCategory>(screenCategory);

  React.useEffect(() => {
    const updateCategory = () => {
      if (typeof window === 'undefined') return;
      const width = window.innerWidth;
      const newCategory = getScreenCategory(width);

      // Only transition when the viewport crosses a breakpoint category boundary
      if (newCategory !== currentCategoryRef.current) {
        currentCategoryRef.current = newCategory;
        setScreenCategory(newCategory);
        // Reset to category default whenever screen category changes
        setSidebarCollapsed(getDefaultSidebarCollapsed(newCategory));
        setMobileDrawerOpen(false);
      }
    };

    // matchMedia queries for instant, zero-re-render breakpoint notifications
    const mobileQuery = window.matchMedia('(max-width: 767.98px)');
    const tabletQuery = window.matchMedia('(min-width: 768px) and (max-width: 1199.98px)');
    const desktopQuery = window.matchMedia('(min-width: 1200px)');

    const handleMediaChange = () => {
      updateCategory();
    };

    try {
      mobileQuery.addEventListener('change', handleMediaChange);
      tabletQuery.addEventListener('change', handleMediaChange);
      desktopQuery.addEventListener('change', handleMediaChange);
    } catch {
      // Fallback for environments with legacy MediaQueryList
      mobileQuery.addListener(handleMediaChange);
      tabletQuery.addListener(handleMediaChange);
      desktopQuery.addListener(handleMediaChange);
    }

    // Secondary throttled resize listener for fluid window drags, zoom, and orientation changes
    let rAFId: number | null = null;
    const handleResize = () => {
      if (rAFId !== null) return;
      rAFId = window.requestAnimationFrame(() => {
        rAFId = null;
        updateCategory();
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    // Initial check on mount
    updateCategory();

    return () => {
      try {
        mobileQuery.removeEventListener('change', handleMediaChange);
        tabletQuery.removeEventListener('change', handleMediaChange);
        desktopQuery.removeEventListener('change', handleMediaChange);
      } catch {
        mobileQuery.removeListener(handleMediaChange);
        tabletQuery.removeListener(handleMediaChange);
        desktopQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (rAFId !== null) {
        cancelAnimationFrame(rAFId);
      }
    };
  }, []);

  // Manual toggle handler:
  // - Mobile (< 768px): Toggles the off-canvas drawer
  // - Tablet & Desktop (>= 768px): Toggles between collapsed and expanded
  const handleToggleSidebar = () => {
    if (screenCategory === 'mobile') {
      setMobileDrawerOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  // Data states
  const [episodes, setEpisodes] = useState<MedicalEpisode[]>(MEDICAL_EPISODES);
  const [documents, setDocuments] = useState<MedicalReport[]>(RECENT_DOCUMENTS);
  const [appointments, setAppointments] = useState<Appointment[]>(UPCOMING_APPOINTMENTS);

  // Active modals
  const [selectedEpisode, setSelectedEpisode] = useState<MedicalEpisode | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<MedicalReport | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [aiHelpModalOpen, setAiHelpModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication State:
  // - Checked on mount. Defaults to true so dashboard is immediately previewable,
  //   unless user explicitly logs out (which stores 'false' in localStorage).
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('medikiosk_authenticated');
      if (stored === 'false') return false;
      return true;
    }
    return true;
  });

  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup'>('signin');

  // Full-Page View Navigation State:
  // - 'dashboard': Default patient dashboard with sidebar, current treatment, etc.
  // - 'consultation': Dedicated full-page AI consultation intake experience (/consultation)
  const [currentView, setCurrentView] = useState<'dashboard' | 'consultation'>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/consultation')) {
      return 'consultation';
    }
    return 'dashboard';
  });

  React.useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        if (window.location.pathname.startsWith('/consultation')) {
          setCurrentView('consultation');
        } else {
          setCurrentView('dashboard');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToConsultation = () => {
    setCurrentView('consultation');
    if (typeof window !== 'undefined' && window.location.pathname !== '/consultation') {
      window.history.pushState(null, '', '/consultation');
    }
  };

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.pushState(null, '', '/');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Authentication Handlers
  const handleLogout = () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('medikiosk_authenticated', 'false');
      if (window.location.pathname !== '/') {
        window.history.pushState(null, '', '/');
      }
    }
    setAuthInitialMode('signin');
    setMobileDrawerOpen(false);
    setProfileModalOpen(false);
    setAiHelpModalOpen(false);
    setConsultationModalOpen(false);
    setSelectedEpisode(null);
    setSelectedDocument(null);
    setSelectedAppointment(null);
    setCurrentView('dashboard');
    showToast('You have been logged out securely.');
  };

  const handleLoginSuccess = (payload: AuthSuccessPayload) => {
    setIsAuthenticated(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('medikiosk_authenticated', 'true');
    }
    setActiveTab('home');
    setCurrentView('dashboard');
    showToast(`Welcome back, ${payload.name || 'Rahul Verma'}! Session authenticated.`);
  };

  const handleConsultationSaved = (newEpisode: MedicalEpisode, intake: ConsultationIntake) => {
    setEpisodes((prev) => [newEpisode, ...prev]);
    showToast(`Consultation for ${newEpisode.condition} saved to your health record!`);
  };

  // Primary active treatment episode (Jaundice 2026)
  const currentTreatmentEpisode = useMemo(() => {
    return episodes.find((ep) => ep.condition === 'Jaundice') || episodes[0];
  }, [episodes]);

  // Filtered episodes based on global search
  const searchedEpisodes = useMemo(() => {
    if (!globalSearch.trim()) return episodes;
    const query = globalSearch.toLowerCase();
    return episodes.filter(
      (ep) =>
        ep.condition.toLowerCase().includes(query) ||
        ep.startDate.toLowerCase().includes(query) ||
        ep.overview.primarySymptoms.some((s) => s.toLowerCase().includes(query))
    );
  }, [episodes, globalSearch]);

  // All prescriptions from current episodes
  const allPrescriptions = useMemo(() => {
    return episodes.flatMap((ep) => ep.prescriptions);
  }, [episodes]);

  // New consultation submission handler
  const handleIntakeSubmit = (intake: ConsultationIntake) => {
    setConsultationModalOpen(false);

    // Create a new ongoing concern episode if appropriate
    const newEp: MedicalEpisode = {
      id: `ep-${Date.now()}`,
      condition: intake.painLocation.includes('Abdomen') ? 'Acute Abdominal Concern' : 'Acute Clinical Concern',
      startDate: '09 Sep 2026',
      status: 'Ongoing',
      visitCount: 1,
      reportCount: 0,
      prescriptionCount: 0,
      iconType: 'liver',
      categoryColor: '#E86D58',
      overview: {
        clinicalSummary: intake.aiStructuredSummary,
        primarySymptoms: [intake.chiefComplaint, ...intake.associatedSymptoms],
        currentAssessment: 'Pending preliminary doctor evaluation & diagnostic triage.',
        doctorNotes: 'Consultation intake received via MediKiosk. Triage priority: Level 3 (Routine OPD).',
        attendingPhysician: 'Dr. Anjali Sharma (Assigned OPD)',
        hospital: 'Apollo Health City & District Civil Hospital',
      },
      reports: [],
      prescriptions: [],
      visits: [
        {
          id: `vis-${Date.now()}`,
          title: 'Initial MediKiosk Clinical Intake',
          date: '09 Sep 2026',
          doctorName: 'Digital Clinical Intake Terminal',
          department: 'Emergency & General Triage',
          notes: intake.aiStructuredSummary,
        },
      ],
    };

    setEpisodes([newEp, ...episodes]);
    showToast('New consultation draft submitted to doctor’s queue successfully!');
  };

  // Document uploaded handler
  const handleDocumentAdded = (newDoc: MedicalReport) => {
    setDocuments([newDoc, ...documents]);
    showToast(`"${newDoc.title}" uploaded & scanned to your health records!`);
  };

  // 1. Dedicated Authentication Gate:
  // If user is not authenticated, render the premium AuthPage
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen">
        <AuthPage
          onLoginSuccess={handleLoginSuccess}
          initialMode={authInitialMode}
        />
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-200 bg-[#4C499E] text-white text-xs font-semibold px-5 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-2">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  // 2. If user is currently on the dedicated full-page consultation experience:
  if (currentView === 'consultation') {
    return (
      <div className="relative min-h-screen">
        <ConsultationPage
          patient={PATIENT_DATA}
          currentEpisodes={episodes}
          onBackToDashboard={navigateToDashboard}
          onConsultationSaved={handleConsultationSaved}
        />
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-200 bg-[#4C499E] text-white text-xs font-semibold px-5 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-2">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      id="medikiosk-root"
      className="min-h-screen w-full bg-[#EDEEF8] flex flex-row font-sans antialiased text-[#2E2C3A] selection:bg-[#C7CBF3]/40 selection:text-[#4C499E]"
    >
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-200 bg-[#4C499E] text-white text-xs font-semibold px-5 py-3 rounded-full shadow-2xl border border-white/20 flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mobile Off-Canvas Sidebar Drawer */}
      <MobileSidebarDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setMobileDrawerOpen(false);
        }}
        onHelpClick={() => {
          setMobileDrawerOpen(false);
          setAiHelpModalOpen(true);
        }}
        onLogoutClick={handleLogout}
      />

      {/* Desktop & Tablet Sidebar (Hidden on mobile < md, visible on tablet & desktop) */}
      <div className="hidden md:block pl-2.5 sm:pl-3 py-2.5 sm:py-3 flex-shrink-0 z-30">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onHelpClick={() => setAiHelpModalOpen(true)}
          onLogoutClick={handleLogout}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          isMobileOverlay={false}
        />
      </div>

      {/* Right Main Application Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen bg-gradient-to-b from-[#EDEEF8] via-[#F0F1FA] to-[#F7F7FB] transition-all duration-300 ease-in-out">
        {/* LAYER 1: GLOBAL APPLICATION HEADER */}
        <Header
          patient={PATIENT_DATA}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          onOpenProfile={() => setProfileModalOpen(true)}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* LAYER 2 & DASHBOARD CONTENT SHELL */}
        <main className="flex-1 px-3.5 xs:px-4 sm:px-6 md:px-8 py-4 sm:py-7 overflow-y-auto max-w-full overflow-x-hidden">
          {/* TAB: HOME (Exact match to reference image) */}
          {activeTab === 'home' && (
            <div className="space-y-6 md:space-y-7 pb-6">
              {/* LAYER 2: PATIENT GREETING / HERO WELCOME ZONE */}
              <PatientGreeting
                patientName={PATIENT_DATA.name}
                onHelpClick={() => setAiHelpModalOpen(true)}
              />

              {/* Main Card 1 — CURRENT TREATMENT (Hero Card) */}
              <CurrentTreatmentCard
                episode={currentTreatmentEpisode}
                onViewDetails={() => setSelectedEpisode(currentTreatmentEpisode)}
                onViewPrescriptions={() => setActiveTab('prescriptions')}
              />

              {/* Main Card 2 — NEW CONSULTATION */}
              <NewConsultationCard
                onStartConsultation={navigateToConsultation}
              />

              {/* Main Section 3 — HEALTH TIMELINE / MEDICAL HISTORY */}
              <HealthTimeline
                episodes={searchedEpisodes}
                onSelectEpisode={(ep) => setSelectedEpisode(ep)}
              />

              {/* Secondary Section 4 — RECENT DOCUMENTS */}
              <RecentDocuments
                documents={documents}
                onViewReport={(doc) => setSelectedDocument(doc)}
                onUploadClick={() => setUploadModalOpen(true)}
                onViewAllClick={() => setActiveTab('documents')}
              />

              {/* Secondary Section 5 — COMPACT UPCOMING APPOINTMENT */}
              {appointments.length > 0 && (
                <div className="pt-1">
                  <AppointmentCard
                    appointment={appointments[0]}
                    onViewAppointment={(apt) => setSelectedAppointment(apt)}
                  />
                </div>
              )}
            </div>
          )}

          {/* TAB: MY HEALTH */}
          {activeTab === 'my-health' && (
            <div className="mt-4 pb-6">
              <MyHealthView
                episodes={episodes}
                onSelectEpisode={(ep) => setSelectedEpisode(ep)}
                onStartConsultation={navigateToConsultation}
              />
            </div>
          )}

          {/* TAB: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="mt-4 pb-6">
              <DocumentsView
                documents={documents}
                onSelectDocument={(doc) => setSelectedDocument(doc)}
                onOpenUpload={() => setUploadModalOpen(true)}
              />
            </div>
          )}

          {/* TAB: PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div className="mt-4 pb-6">
              <PrescriptionsView
                prescriptions={allPrescriptions}
                onStartConsultation={navigateToConsultation}
              />
            </div>
          )}

          {/* TAB: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="mt-4 pb-6">
              <AppointmentsView
                appointments={appointments}
                onSelectAppointment={(apt) => setSelectedAppointment(apt)}
                onBookNew={navigateToConsultation}
              />
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === 'profile' && (
            <div className="mt-4 pb-6">
              <div className="max-w-2xl mx-auto">
                <ProfileModal
                  patient={PATIENT_DATA}
                  isOpen={true}
                  onClose={() => setActiveTab('home')}
                  onLogout={handleLogout}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* OVERLAY MODALS */}
      {/* 1. Episode Detail Modal */}
      {selectedEpisode && (
        <EpisodeDetailModal
          episode={selectedEpisode}
          onClose={() => setSelectedEpisode(null)}
          onViewReport={(rep) => setSelectedDocument(rep)}
        />
      )}

      {/* 2. New Consultation Guided Interview */}
      {consultationModalOpen && (
        <NewConsultationModal
          isOpen={consultationModalOpen}
          onClose={() => setConsultationModalOpen(false)}
          onSubmitIntake={handleIntakeSubmit}
        />
      )}

      {/* 3. Document Viewer Modal */}
      {selectedDocument && (
        <DocumentModal
          report={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}

      {/* 4. Upload / Scan Document Modal */}
      {uploadModalOpen && (
        <UploadDocumentModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onDocumentAdded={handleDocumentAdded}
        />
      )}

      {/* 5. Appointment Detail Modal */}
      {selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {/* 6. Profile Modal */}
      {profileModalOpen && activeTab !== 'profile' && (
        <ProfileModal
          patient={PATIENT_DATA}
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          onLogout={handleLogout}
        />
      )}

      {/* 7. AI Help Modal ("Talk to MediKiosk") */}
      {aiHelpModalOpen && (
        <AIHelpModal
          isOpen={aiHelpModalOpen}
          onClose={() => setAiHelpModalOpen(false)}
          onStartConsultation={() => {
            setAiHelpModalOpen(false);
            navigateToConsultation();
          }}
        />
      )}
    </div>
  );
}
