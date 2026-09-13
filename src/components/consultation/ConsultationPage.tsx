import React, { useState } from 'react';
import {
  PatientProfile,
  MedicalEpisode,
  ConsultationIntake,
} from '../../types';
import {
  EditablePatientInfo,
  BodyRegionId,
  ConversationTurn,
  ConsultationSummaryData,
  StageKey,
} from '../../types/consultation';
import { ConsultationHeader } from './ConsultationHeader';
import { ConsultationStepIndicator } from './ConsultationStepIndicator';
import { Stage1PersonalDetails } from './stages/Stage1PersonalDetails';
import { Stage2HealthDetails } from './stages/Stage2HealthDetails';
import { Stage3BodyAndQuestions } from './stages/Stage3BodyAndQuestions';
import { Stage4Review } from './stages/Stage4Review';
import { SubmissionState } from './SubmissionState';
import {
  buildConsultationSummary,
  getPrimaryRegionLabel,
} from './questionEngine';

interface ConsultationPageProps {
  patient: PatientProfile;
  currentEpisodes: MedicalEpisode[];
  onBackToDashboard: () => void;
  onConsultationSaved: (newEpisode: MedicalEpisode, intake: ConsultationIntake) => void;
}

export const ConsultationPage: React.FC<ConsultationPageProps> = ({
  patient,
  currentEpisodes,
  onBackToDashboard,
  onConsultationSaved,
}) => {
  // 1. Stage 1 State: Personal Details (compact, pre-filled, directly editable)
  const [patientInfo, setPatientInfo] = useState<EditablePatientInfo>(() => ({
    name: patient.name || 'Ramesh Kumar',
    age: patient.age || 46,
    gender: patient.gender || 'Male',
    dob: '14 Aug 1980',
    patientId: '•••• 4821',
    ongoingConditions:
      patient.chronicConditions.length > 0
        ? [...patient.chronicConditions, 'Jaundice (Under treatment)']
        : ['Mild Hypertension (diagnosed 2022)', 'Jaundice (Under treatment)'],
    currentMedications: [
      'Silymarin 140mg (Twice daily)',
      'Ursodeoxycholic Acid 300mg',
      'Multivitamin & B-Complex',
    ],
    allergies:
      patient.allergies.length > 0
        ? patient.allergies
        : ['Penicillin (Moderate rash)', 'Sulfa drugs'],
    otherHealthInfo: '',
    isConfirmed: true,
  }));

  // 2. Stage 3 State: Selected Body Regions & Problem Description
  const [selectedRegions, setSelectedRegions] = useState<BodyRegionId[]>([]);
  const [isOtherSelected, setIsOtherSelected] = useState<boolean>(false);
  const [initialDescription, setInitialDescription] = useState<string>('');

  // 3. Overall 4-Stage Consultation State
  const [stage, setStage] = useState<StageKey>('stage1_personal');

  // 4. Guided Questioning History & Answers
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  // 5. Review & Submission Data
  const [consultationSummary, setConsultationSummary] = useState<ConsultationSummaryData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Body Region Toggle
  const handleToggleRegion = (regionId: BodyRegionId) => {
    setSelectedRegions((prev) =>
      prev.includes(regionId) ? prev.filter((r) => r !== regionId) : [...prev, regionId]
    );
  };

  const handleClearSelection = () => {
    setSelectedRegions([]);
    setIsOtherSelected(false);
  };

  const handleToggleOther = () => {
    setIsOtherSelected((prev) => !prev);
  };

  // Calculate Progress Percent and Label based on the 4 stages
  const getProgressInfo = () => {
    switch (stage) {
      case 'stage1_personal':
        return { percent: 25, label: 'Stage 1 of 4 • Personal Details' };
      case 'stage2_health':
        return { percent: 50, label: 'Stage 2 of 4 • Health Details' };
      case 'stage3_problem':
        return {
          percent: 75,
          label: 'Stage 3 of 4 • Problem & Questions',
        };
      case 'stage4_review':
        return { percent: 95, label: 'Stage 4 of 4 • Review' };
      case 'submitted':
        return { percent: 100, label: 'Consultation Recorded' };
    }
  };

  const { percent: progressPercent, label: progressStageText } = getProgressInfo();

  // Handle completion of Stage 3 (AI questions done -> prepare summary for Stage 4)
  const handleCompleteStage3 = (
    finalAnswers: Record<string, any>,
    finalTurns: ConversationTurn[]
  ) => {
    const summary = buildConsultationSummary({
      selectedRegions,
      isOtherSelected,
      initialDescription: initialDescription.trim(),
      patientInfo,
      answers: finalAnswers,
      turns: finalTurns,
    });
    setConsultationSummary(summary);
    setStage('stage4_review');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Submission to Health Records
  const handleSubmitConsultation = () => {
    if (!consultationSummary) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const primaryRegion = selectedRegions[0] || 'other';

      const iconMap: Record<string, MedicalEpisode['iconType']> = {
        head: 'head',
        neck: 'head',
        abdomen: 'stomach',
        chest: 'heart',
        pelvis: 'stomach',
        other: 'head',
      };

      const newEpisode: MedicalEpisode = {
        id: `ep-consult-${Date.now()}`,
        condition: `${consultationSummary.concern} (${consultationSummary.primaryArea})`,
        icdCode: 'R51 / Clinical Intake',
        startDate: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        status: 'Ongoing',
        visitCount: 1,
        reportCount: 0,
        prescriptionCount: 0,
        iconType: iconMap[primaryRegion] || 'head',
        categoryColor: '#4C499E',
        overview: {
          clinicalSummary: `Patient ${patientInfo.name} completed guided intake for ${consultationSummary.concern}. Area: ${consultationSummary.primaryArea}. Severity: ${consultationSummary.severity}. Duration: ${consultationSummary.duration}. Notes: ${consultationSummary.additionalInformation}`,
          primarySymptoms: [
            consultationSummary.concern,
            ...consultationSummary.associatedSymptoms,
          ],
          currentAssessment: `Pending physician review. Priority: ${consultationSummary.triagePriority}.`,
          doctorNotes:
            'Pre-consultation intake recorded via MediKiosk Health Assistant. Ready for attending doctor review.',
          attendingPhysician: 'OPD Attending Physician',
          hospital: 'Apollo Health City & District Civil Hospital',
        },
        reports: [],
        prescriptions: [],
        visits: [
          {
            id: `v-${Date.now()}`,
            title: 'Initial Consultation Intake',
            date: new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            }),
            doctorName: 'Dr. Triage Team',
            department: consultationSummary.recommendedDepartment,
            notes: `Chief complaint: ${consultationSummary.concern}. Area: ${consultationSummary.primaryArea}.`,
          },
        ],
      };

      const intakeData: ConsultationIntake = {
        id: `intake-${Date.now()}`,
        chiefComplaint: `${consultationSummary.concern} - ${consultationSummary.primaryArea}`,
        onsetDate: consultationSummary.duration,
        painLocation: consultationSummary.location,
        painSeverity: consultationSummary.severityScore || 5,
        associatedSymptoms: consultationSummary.associatedSymptoms,
        intakeMethod: 'touch',
        status: 'Submitted to Doctor',
        aiStructuredSummary: consultationSummary.additionalInformation || 'Intake completed',
        submittedAt: new Date().toISOString(),
      };

      onConsultationSaved(newEpisode, intakeData);
      setIsSubmitting(false);
      setStage('submitted');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 450);
  };

  // Reset or restart consultation
  const handleRestart = () => {
    setStage('stage1_personal');
    setSelectedRegions([]);
    setIsOtherSelected(false);
    setInitialDescription('');
    setTurns([]);
    setAnswers({});
    setConsultationSummary(null);
  };

  return (
    <div
      id="consultation-page-root"
      className="min-h-screen bg-gradient-to-b from-[#FAF8FC] via-[#F4F2FA] to-[#EDEAF8] flex flex-col font-sans selection:bg-[#4C499E] selection:text-white"
    >
      {/* Top Consultation Header */}
      <ConsultationHeader
        onBackToDashboard={onBackToDashboard}
        onRestart={handleRestart}
        currentStageText={progressStageText}
        isComplete={stage === 'submitted'}
      />

      {/* Main Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 lg:px-8 py-4 sm:py-5 lg:py-7">
        {/* Horizontal 4-Stage Stepper Breadcrumb */}
        <ConsultationStepIndicator
          currentStage={stage}
          onSelectStage={(targetStage) => setStage(targetStage)}
        />

        {/* Main Content Workspace: Centered, responsive tablet expansion and preserved desktop max-w */}
        <main className="w-full consultation-responsive-container flex flex-col space-y-5 sm:space-y-6">
          {/* =========================================================================
              STAGE 1: PERSONAL DETAILS
              Compact and focused: Full Name, Age, Gender, Patient ID / ABHA.
              Proper editable input fields, auto-populated from profile.
             ========================================================================= */}
            {stage === 'stage1_personal' && (
              <Stage1PersonalDetails
                patientInfo={patientInfo}
                onUpdate={setPatientInfo}
                onContinue={() => {
                  setStage('stage2_health');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* =========================================================================
                STAGE 2: HEALTH DETAILS
                Heading: "A little about your health"
                Allergies: [None] [Medicines] [Food] [Other]
                Ongoing health issues: [ Tell us about any ongoing health problems... ]
                Optional: Anything else we should know?
                Bottom: ← Back Continue →
               ========================================================================= */}
            {stage === 'stage2_health' && (
              <Stage2HealthDetails
                patientInfo={patientInfo}
                onUpdate={setPatientInfo}
                onBack={() => {
                  setStage('stage1_personal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onContinue={() => {
                  setStage('stage3_problem');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}

            {/* =========================================================================
                STAGE 3: PROBLEM / BODY AREA + AI QUESTIONS
                Sub-stage A: "Where are you experiencing the problem?"
                Large interactive human body illustration + Tell us what's bothering you.
                Sub-stage B: AI Questioning with interactive buttons, sliders, chips.
               ========================================================================= */}
            {stage === 'stage3_problem' && (
              <Stage3BodyAndQuestions
                patientInfo={patientInfo}
                selectedRegions={selectedRegions}
                isOtherSelected={isOtherSelected}
                initialDescription={initialDescription}
                turns={turns}
                answers={answers}
                onToggleRegion={handleToggleRegion}
                onClearRegions={handleClearSelection}
                onToggleOther={handleToggleOther}
                onUpdateDescription={setInitialDescription}
                onUpdateTurns={setTurns}
                onUpdateAnswers={setAnswers}
                onBackToHealthDetails={() => {
                  setStage('stage2_health');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onCompleteStage3={handleCompleteStage3}
              />
            )}

            {/* =========================================================================
                STAGE 4: REVIEW
                Clean review screen with:
                - Personal Details (Name, Age, Gender, Patient ID)
                - Health Details (Allergies, Ongoing issues, Other info)
                - Concern (Selected body area, Original problem description)
                - AI Responses (Questions asked, User's answers)
                Individual section editing + Confirm & Continue →
               ========================================================================= */}
            {stage === 'stage4_review' && consultationSummary && (
              <Stage4Review
                summary={consultationSummary}
                patientInfo={patientInfo}
                initialDescription={initialDescription}
                selectedRegions={selectedRegions}
                isOtherSelected={isOtherSelected}
                turns={turns}
                answers={answers}
                onUpdatePatientInfo={setPatientInfo}
                onUpdateInitialDescription={setInitialDescription}
                onUpdateAnswer={(questionId, val, label) => {
                  const nextAnswers = { ...answers, [questionId]: val };
                  setAnswers(nextAnswers);
                  const updatedSummary = buildConsultationSummary({
                    selectedRegions,
                    isOtherSelected,
                    initialDescription: initialDescription.trim(),
                    patientInfo,
                    answers: nextAnswers,
                    turns,
                  });
                  setConsultationSummary(updatedSummary);
                }}
                onGoToStage={(stageIdx) => {
                  if (stageIdx === 1) setStage('stage1_personal');
                  else if (stageIdx === 2) setStage('stage2_health');
                  else setStage('stage3_problem');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onConfirmAndContinue={handleSubmitConsultation}
                isSubmitting={isSubmitting}
              />
            )}

            {/* =========================================================================
                SUBMISSION STATE: CONSULTATION RECORDED
                ✓ Consultation information recorded
                "Your information has been prepared for review by your healthcare professional."
               ========================================================================= */}
            {stage === 'submitted' && consultationSummary && (
              <SubmissionState
                summary={consultationSummary}
                patientInfo={patientInfo}
                onViewRecord={onBackToDashboard}
                onBackToDashboard={onBackToDashboard}
              />
            )}
          </main>
      </div>
    </div>
  );
};
