import React, { useState, useMemo } from 'react';
import {
  PATIENT_DATA,
  MEDICAL_EPISODES,
  RECENT_DOCUMENTS,
  UPCOMING_APPOINTMENTS,
} from './data/mockData';
import { NavTab, MedicalEpisode, MedicalReport, Appointment, ConsultationIntake } from './types';
import { Sidebar } from './components/Sidebar';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [globalSearch, setGlobalSearch] = useState('');

  // Breakpoint-aware sidebar state:
  // Desktop (>= 1200px): Default EXPANDED (collapsed = false)
  // iPad / Tablet (768px - 1199px): Default COLLAPSED (collapsed = true)
  // Mobile (< 768px): Default COLLAPSED (collapsed = true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1200;
    }
    return false;
  });

  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const userManuallyToggledRef = React.useRef(false);

  React.useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      setIsMobileScreen(isMobile);

      // Only auto-update collapsed state if user hasn't explicitly toggled it manually
      if (!userManuallyToggledRef.current) {
        setSidebarCollapsed(window.innerWidth < 1200);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggleSidebar = () => {
    userManuallyToggledRef.current = true;
    setSidebarCollapsed((prev) => !prev);
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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

      {/* Left Collapsible Floating Sidebar */}
      <div className="pl-2.5 sm:pl-3 py-2.5 sm:py-3 flex-shrink-0 z-30">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onHelpClick={() => setAiHelpModalOpen(true)}
          onLogoutClick={() => showToast('Session locked. Re-authenticate via ABHA pin to continue.')}
          collapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
          isMobileOverlay={isMobileScreen}
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
        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 sm:py-7 overflow-y-auto">
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
                onStartConsultation={() => setConsultationModalOpen(true)}
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
                onStartConsultation={() => setConsultationModalOpen(true)}
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
                onStartConsultation={() => setConsultationModalOpen(true)}
              />
            </div>
          )}

          {/* TAB: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="mt-4 pb-6">
              <AppointmentsView
                appointments={appointments}
                onSelectAppointment={(apt) => setSelectedAppointment(apt)}
                onBookNew={() => setConsultationModalOpen(true)}
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
        />
      )}

      {/* 7. AI Help Modal ("Talk to MediKiosk") */}
      {aiHelpModalOpen && (
        <AIHelpModal
          isOpen={aiHelpModalOpen}
          onClose={() => setAiHelpModalOpen(false)}
          onStartConsultation={() => {
            setAiHelpModalOpen(false);
            setConsultationModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
