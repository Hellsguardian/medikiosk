import React, { useState } from 'react';
import {
  ConsultationSummaryData,
  EditablePatientInfo,
  BodyRegionId,
} from '../../types/consultation';
import {
  CheckCircle2,
  Edit2,
  Clock,
  Activity,
  MapPin,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  User,
  Stethoscope,
  FileText,
  Check,
  X,
  Send,
} from 'lucide-react';

interface ConsultationSummaryProps {
  summary: ConsultationSummaryData;
  patientInfo: EditablePatientInfo;
  initialDescription?: string;
  answers: Record<string, any>;
  onUpdatePatientInfo: (updated: EditablePatientInfo) => void;
  onUpdateInitialDescription?: (text: string) => void;
  onUpdateAnswer: (questionId: string, value: any, label?: string) => void;
  onSubmitConsultation: () => void;
  onBackToBodySelect?: () => void;
  isSubmitting?: boolean;
}

export const ConsultationSummary: React.FC<ConsultationSummaryProps> = ({
  summary,
  patientInfo,
  initialDescription = '',
  answers,
  onUpdatePatientInfo,
  onUpdateInitialDescription,
  onUpdateAnswer,
  onSubmitConsultation,
  onBackToBodySelect,
  isSubmitting = false,
}) => {
  const [editingSection, setEditingSection] = useState<number | null>(null);

  // Temporary edit states
  const [tempPersonal, setTempPersonal] = useState({ ...patientInfo });
  const [tempHealth, setTempHealth] = useState({
    allergies: patientInfo.allergies?.join(', ') || '',
    ongoingConditions: patientInfo.ongoingConditions?.join(', ') || '',
    currentMedications: patientInfo.currentMedications?.join(', ') || '',
    previousConditions: patientInfo.previousConditions?.join(', ') || '',
    otherHealthInfo: patientInfo.otherHealthInfo || '',
  });
  const [tempDescription, setTempDescription] = useState(
    initialDescription || summary.concern || ''
  );
  const [tempDuration, setTempDuration] = useState(summary.duration || '');
  const [tempSeverity, setTempSeverity] = useState(
    summary.severityScore || (summary.severity.includes('7') ? 7 : 5)
  );
  const [tempPainType, setTempPainType] = useState(
    answers['pain_description']?.label || answers['head_problem']?.label || 'Sharp'
  );
  const [tempLocation, setTempLocation] = useState(summary.location || '');
  const [tempAdditionalNotes, setTempAdditionalNotes] = useState(
    summary.additionalInformation || answers['additional_notes'] || ''
  );

  // Save Personal Details
  const savePersonal = () => {
    onUpdatePatientInfo(tempPersonal);
    setEditingSection(null);
  };

  // Save Health Details
  const saveHealth = () => {
    const updated: EditablePatientInfo = {
      ...patientInfo,
      allergies: tempHealth.allergies
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      ongoingConditions: tempHealth.ongoingConditions
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      currentMedications: tempHealth.currentMedications
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      previousConditions: tempHealth.previousConditions
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      otherHealthInfo: tempHealth.otherHealthInfo.trim(),
    };
    onUpdatePatientInfo(updated);
    setEditingSection(null);
  };

  // Save Primary Concern
  const savePrimaryConcern = () => {
    if (onUpdateInitialDescription) {
      onUpdateInitialDescription(tempDescription);
    }
    setEditingSection(null);
  };

  // Save AI Questioning Answers (targeted modification)
  const saveAIAnswers = () => {
    onUpdateAnswer('duration_slider', tempDuration, tempDuration);
    onUpdateAnswer('severity_slider', tempSeverity, `${tempSeverity} / 10`);
    onUpdateAnswer('pain_description', { id: 'edited', label: tempPainType }, tempPainType);
    onUpdateAnswer('abdomen_location', { id: 'edited', label: tempLocation }, tempLocation);
    setEditingSection(null);
  };

  // Save Additional Info
  const saveAdditionalInfo = () => {
    onUpdateAnswer('additional_notes', tempAdditionalNotes, tempAdditionalNotes);
    setEditingSection(null);
  };

  return (
    <div
      id="consultation-review-container"
      className="w-full max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300 pb-16"
    >
      {/* Review Header */}
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232142] tracking-tight">
          Let's review what you've told us.
        </h2>
        <p className="text-sm sm:text-base text-[#65618A] max-w-lg mx-auto leading-relaxed">
          Please check the summary below. You can edit any section directly before submitting.
        </p>
      </div>

      {/* SECTION 1: PERSONAL DETAILS */}
      <div
        id="review-section-1"
        className="bg-white rounded-3xl border border-[#E1DEFA] p-6 sm:p-7 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F0FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F0EDFB] text-[#4C499E] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#232142]">
                Section 1: Personal Details
              </h3>
              <span className="text-[11px] text-[#7E7A9F]">Verified patient records</span>
            </div>
          </div>

          {editingSection !== 1 ? (
            <button
              type="button"
              onClick={() => {
                setTempPersonal({ ...patientInfo });
                setEditingSection(1);
              }}
              className="text-xs font-semibold text-[#4C499E] hover:text-[#38357B] hover:bg-[#F2EFFB] px-3 py-1.5 rounded-xl border border-[#DCD7F5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={savePersonal}
                className="text-xs font-bold text-white bg-[#4C499E] hover:bg-[#3A3785] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="text-xs text-[#7B779C] hover:text-[#232142] px-2 py-1.5 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {editingSection === 1 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-sm">
            <div>
              <label className="text-[11px] font-bold text-[#726E96] block mb-1">Full Name</label>
              <input
                type="text"
                value={tempPersonal.name}
                onChange={(e) => setTempPersonal({ ...tempPersonal, name: e.target.value })}
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#726E96] block mb-1">Age</label>
              <input
                type="number"
                value={tempPersonal.age}
                onChange={(e) =>
                  setTempPersonal({ ...tempPersonal, age: parseInt(e.target.value, 10) || patientInfo.age })
                }
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142]"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#726E96] block mb-1">Gender</label>
              <select
                value={tempPersonal.gender}
                onChange={(e) => setTempPersonal({ ...tempPersonal, gender: e.target.value })}
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#726E96] block mb-1">Date of Birth</label>
              <input
                type="text"
                value={tempPersonal.dob}
                onChange={(e) => setTempPersonal({ ...tempPersonal, dob: e.target.value })}
                className="w-full text-xs font-bold px-3 py-2 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142]"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#8783A6] block mb-0.5 font-medium">Name</span>
              <span className="font-bold text-[#232142] text-sm">{patientInfo.name}</span>
            </div>
            <div>
              <span className="text-[#8783A6] block mb-0.5 font-medium">Age & Gender</span>
              <span className="font-bold text-[#232142] text-sm">
                {patientInfo.age}y, {patientInfo.gender}
              </span>
            </div>
            <div>
              <span className="text-[#8783A6] block mb-0.5 font-medium">Patient / ABHA ID</span>
              <span className="font-mono font-bold text-[#4C499E] text-sm">
                {patientInfo.patientId || '•••• 4821'}
              </span>
            </div>
            <div>
              <span className="text-[#8783A6] block mb-0.5 font-medium">Date of Birth</span>
              <span className="font-bold text-[#232142] text-sm">{patientInfo.dob || '14 Aug 2002'}</span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: HEALTH DETAILS */}
      <div
        id="review-section-2"
        className="bg-white rounded-3xl border border-[#E1DEFA] p-6 sm:p-7 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F0FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F0EDFB] text-[#4C499E] flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#232142]">
                Section 2: Health Details
              </h3>
              <span className="text-[11px] text-[#7E7A9F]">Allergies & Medical Background</span>
            </div>
          </div>

          {editingSection !== 2 ? (
            <button
              type="button"
              onClick={() => {
                setTempHealth({
                  allergies: patientInfo.allergies?.join(', ') || '',
                  ongoingConditions: patientInfo.ongoingConditions?.join(', ') || '',
                  currentMedications: patientInfo.currentMedications?.join(', ') || '',
                  previousConditions: patientInfo.previousConditions?.join(', ') || '',
                  otherHealthInfo: patientInfo.otherHealthInfo || '',
                });
                setEditingSection(2);
              }}
              className="text-xs font-semibold text-[#4C499E] hover:text-[#38357B] hover:bg-[#F2EFFB] px-3 py-1.5 rounded-xl border border-[#DCD7F5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={saveHealth}
                className="text-xs font-bold text-white bg-[#4C499E] hover:bg-[#3A3785] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="text-xs text-[#7B779C] hover:text-[#232142] px-2 py-1.5 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {editingSection === 2 ? (
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-[#6D6993] block mb-1">Known Allergies (comma-separated)</label>
              <input
                type="text"
                value={tempHealth.allergies}
                onChange={(e) => setTempHealth({ ...tempHealth, allergies: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142]"
              />
            </div>
            <div>
              <label className="font-bold text-[#6D6993] block mb-1">Ongoing Conditions</label>
              <input
                type="text"
                value={tempHealth.ongoingConditions}
                onChange={(e) => setTempHealth({ ...tempHealth, ongoingConditions: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142]"
              />
            </div>
            <div>
              <label className="font-bold text-[#6D6993] block mb-1">Current Medications</label>
              <input
                type="text"
                value={tempHealth.currentMedications}
                onChange={(e) => setTempHealth({ ...tempHealth, currentMedications: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142]"
              />
            </div>
            <div>
              <label className="font-bold text-[#6D6993] block mb-1">Previous Medical Conditions</label>
              <input
                type="text"
                value={tempHealth.previousConditions}
                onChange={(e) => setTempHealth({ ...tempHealth, previousConditions: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142]"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[#8783A6] block mb-1 font-medium">Known Allergies</span>
              {patientInfo.allergies && patientInfo.allergies.length > 0 ? (
                <span className="font-semibold text-[#C91A39] bg-[#FEECEF] px-2.5 py-1 rounded-lg inline-block">
                  {patientInfo.allergies.join(', ')}
                </span>
              ) : (
                <span className="text-[#8480A3] italic">None reported</span>
              )}
            </div>
            <div>
              <span className="text-[#8783A6] block mb-1 font-medium">Ongoing Conditions</span>
              {patientInfo.ongoingConditions && patientInfo.ongoingConditions.length > 0 ? (
                <span className="font-semibold text-[#4C499E] bg-[#EDEAFB] px-2.5 py-1 rounded-lg inline-block">
                  {patientInfo.ongoingConditions.join(', ')}
                </span>
              ) : (
                <span className="text-[#8480A3] italic">None</span>
              )}
            </div>
            <div>
              <span className="text-[#8783A6] block mb-1 font-medium">Current Medications</span>
              <span className="font-semibold text-[#232142]">
                {patientInfo.currentMedications && patientInfo.currentMedications.length > 0
                  ? patientInfo.currentMedications.join(', ')
                  : 'None'}
              </span>
            </div>
            <div>
              <span className="text-[#8783A6] block mb-1 font-medium">Previous Medical History</span>
              <span className="font-semibold text-[#232142]">
                {patientInfo.previousConditions && patientInfo.previousConditions.length > 0
                  ? patientInfo.previousConditions.join(', ')
                  : patientInfo.medicalHistory || 'Viral Hepatitis (June 2026)'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: PRIMARY CONCERN */}
      <div
        id="review-section-3"
        className="bg-white rounded-3xl border border-[#E1DEFA] p-6 sm:p-7 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F0FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F0EDFB] text-[#4C499E] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#232142]">
                Section 3: Primary Concern
              </h3>
              <span className="text-[11px] text-[#7E7A9F]">Body area and initial report</span>
            </div>
          </div>

          {editingSection !== 3 ? (
            <button
              type="button"
              onClick={() => {
                setTempDescription(initialDescription || summary.concern || '');
                setEditingSection(3);
              }}
              className="text-xs font-semibold text-[#4C499E] hover:text-[#38357B] hover:bg-[#F2EFFB] px-3 py-1.5 rounded-xl border border-[#DCD7F5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={savePrimaryConcern}
                className="text-xs font-bold text-white bg-[#4C499E] hover:bg-[#3A3785] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="text-xs text-[#7B779C] hover:text-[#232142] px-2 py-1.5 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {editingSection === 3 ? (
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-[#6D6993] block mb-1">
                Your Original Description
              </label>
              <textarea
                rows={3}
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                className="w-full text-xs font-semibold p-3 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142] focus:outline-none"
              />
            </div>
            {onBackToBodySelect && (
              <button
                type="button"
                onClick={onBackToBodySelect}
                className="text-xs font-semibold text-[#4C499E] hover:underline cursor-pointer"
              >
                ← Change body area on interactive body illustration
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#8480A5] font-medium">Selected body area:</span>
              <span className="font-bold text-[#4C499E] bg-[#EDEAFB] px-2.5 py-1 rounded-lg">
                {summary.primaryArea} {summary.location ? `→ ${summary.location}` : ''}
              </span>
            </div>
            <div>
              <span className="text-[#8480A5] font-medium block mb-1">
                Patient's original description:
              </span>
              <div className="p-3 bg-[#FAF9FD] rounded-xl border border-[#ECE8F7] font-semibold text-[#252243] text-xs sm:text-sm">
                "{initialDescription || summary.concern || 'Not specified'}"
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: INFORMATION FROM AI QUESTIONING */}
      <div
        id="review-section-4"
        className="bg-white rounded-3xl border border-[#E1DEFA] p-6 sm:p-7 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F0FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F0EDFB] text-[#4C499E] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#4C499E]" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#232142]">
                Section 4: Information from AI Questioning
              </h3>
              <span className="text-[11px] text-[#7E7A9F]">Targeted clinical questionnaire findings</span>
            </div>
          </div>

          {editingSection !== 4 ? (
            <button
              type="button"
              onClick={() => {
                setTempDuration(summary.duration);
                setTempSeverity(summary.severityScore || (summary.severity.includes('7') ? 7 : 5));
                setTempPainType(
                  answers['pain_description']?.label || answers['head_problem']?.label || 'Sharp'
                );
                setTempLocation(summary.location || '');
                setEditingSection(4);
              }}
              className="text-xs font-semibold text-[#4C499E] hover:text-[#38357B] hover:bg-[#F2EFFB] px-3 py-1.5 rounded-xl border border-[#DCD7F5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={saveAIAnswers}
                className="text-xs font-bold text-white bg-[#4C499E] hover:bg-[#3A3785] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="text-xs text-[#7B779C] hover:text-[#232142] px-2 py-1.5 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {editingSection === 4 ? (
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#6B6790] block mb-1">Duration</label>
                <input
                  type="text"
                  value={tempDuration}
                  onChange={(e) => setTempDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142]"
                />
              </div>
              <div>
                <label className="font-bold text-[#6B6790] block mb-1">Pain Type / Sensation</label>
                <input
                  type="text"
                  value={tempPainType}
                  onChange={(e) => setTempPainType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142]"
                />
              </div>
              <div>
                <label className="font-bold text-[#6B6790] block mb-1">Specific Location</label>
                <input
                  type="text"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142]"
                />
              </div>
              <div>
                <label className="font-bold text-[#6B6790] block mb-1">
                  Severity Score: {tempSeverity} / 10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={tempSeverity}
                  onChange={(e) => setTempSeverity(Number(e.target.value))}
                  className="w-full accent-[#4C499E]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            <div className="p-3 rounded-2xl bg-[#FAF9FD] border border-[#ECE8F7] flex items-center justify-between">
              <span className="text-[#7B779F] font-medium">Duration:</span>
              <span className="font-bold text-[#232142] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#4C499E]" />
                <span>{summary.duration}</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF9FD] border border-[#ECE8F7] flex items-center justify-between">
              <span className="text-[#7B779F] font-medium">Pain Type:</span>
              <span className="font-bold text-[#232142]">
                {answers['pain_description']?.label ||
                  answers['head_problem']?.label ||
                  answers['chest_sensation']?.label ||
                  'Sharp / Localized'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF9FD] border border-[#ECE8F7] flex items-center justify-between">
              <span className="text-[#7B779F] font-medium">Severity:</span>
              <span className="font-bold text-[#232142] flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-[#D8426C]" />
                <span>{summary.severity}</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF9FD] border border-[#ECE8F7] flex items-center justify-between">
              <span className="text-[#7B779F] font-medium">Location:</span>
              <span className="font-bold text-[#232142]">{summary.location || 'Reported region'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF9FD] border border-[#ECE8F7] flex items-center justify-between sm:col-span-2">
              <span className="text-[#7B779F] font-medium">Triggers / Aggravating factors:</span>
              <span className="font-semibold text-[#232142] text-right">
                {summary.triggers && summary.triggers.length > 0
                  ? summary.triggers.join(', ')
                  : 'Nothing specific'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF9FD] border border-[#ECE8F7] flex items-center justify-between">
              <span className="text-[#7B779F] font-medium">Associated symptoms:</span>
              <span className="font-semibold text-[#232142]">
                {summary.associatedSymptoms && summary.associatedSymptoms.length > 0
                  ? summary.associatedSymptoms.join(', ')
                  : 'None reported'}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#FAF9FD] border border-[#ECE8F7] flex items-center justify-between">
              <span className="text-[#7B779F] font-medium">Previous episodes:</span>
              <span className="font-semibold text-[#232142]">{summary.previousEpisodes}</span>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 5: ADDITIONAL INFORMATION */}
      <div
        id="review-section-5"
        className="bg-white rounded-3xl border border-[#E1DEFA] p-6 sm:p-7 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-3"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#F2F0FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F0EDFB] text-[#4C499E] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#232142]">
                Section 5: Additional Information
              </h3>
              <span className="text-[11px] text-[#7E7A9F]">Free-text notes for the doctor</span>
            </div>
          </div>

          {editingSection !== 5 ? (
            <button
              type="button"
              onClick={() => {
                setTempAdditionalNotes(
                  summary.additionalInformation || answers['additional_notes'] || ''
                );
                setEditingSection(5);
              }}
              className="text-xs font-semibold text-[#4C499E] hover:text-[#38357B] hover:bg-[#F2EFFB] px-3 py-1.5 rounded-xl border border-[#DCD7F5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>{summary.additionalInformation ? 'Edit' : '+ Add Note'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={saveAdditionalInfo}
                className="text-xs font-bold text-white bg-[#4C499E] hover:bg-[#3A3785] px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="text-xs text-[#7B779C] hover:text-[#232142] px-2 py-1.5 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {editingSection === 5 ? (
          <div>
            <textarea
              rows={3}
              value={tempAdditionalNotes}
              onChange={(e) => setTempAdditionalNotes(e.target.value)}
              placeholder="Any other notes or questions for your doctor..."
              className="w-full text-xs font-semibold p-3 rounded-xl bg-[#FAF8FE] border border-[#4C499E] text-[#232142] focus:outline-none"
            />
          </div>
        ) : (
          <p className="text-xs font-medium text-[#58547C]">
            {summary.additionalInformation || answers['additional_notes'] || (
              <span className="italic text-[#8E8AAE]">
                No additional free-text notes provided. Everything has been gathered from the questioning steps.
              </span>
            )}
          </p>
        )}
      </div>

      {/* FINAL CONFIRMATION BAR */}
      <div
        id="review-final-bar"
        className="bg-gradient-to-tr from-[#FFFFFF] to-[#FAF8FD] rounded-3xl border border-[#D5D0F5] p-6 sm:p-7 shadow-[0_8px_30px_rgba(76,73,158,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h4 className="text-base font-extrabold text-[#232142]">Everything looks good?</h4>
          <p className="text-xs text-[#6F6B92] mt-0.5">
            Your responses will be compiled into your clinical intake report.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditingSection(editingSection ? null : 1)}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#F2EFFB] border border-[#DDD8F4] text-[#4C499E] text-xs font-bold transition-all cursor-pointer"
          >
            {editingSection ? 'Close Editing' : 'Edit Information'}
          </button>

          <button
            type="button"
            id="submit-consultation-cta"
            onClick={onSubmitConsultation}
            disabled={isSubmitting}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#4C499E] to-[#605CB8] hover:from-[#3E3B87] hover:to-[#504C9C] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#4C499E]/25 flex items-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Preparing Intake...</span>
              </>
            ) : (
              <>
                <span>Submit Consultation</span>
                <Send className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
