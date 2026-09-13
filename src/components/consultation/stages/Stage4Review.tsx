import React, { useState } from 'react';
import {
  ConsultationSummaryData,
  EditablePatientInfo,
  BodyRegionId,
  ConversationTurn,
} from '../../../types/consultation';
import {
  CheckCircle2,
  Edit2,
  Clock,
  Activity,
  MapPin,
  ShieldCheck,
  Sparkles,
  User,
  HeartPulse,
  FileText,
  Check,
  X,
  ArrowRight,
  HelpCircle,
} from 'lucide-react';

interface Stage4ReviewProps {
  summary: ConsultationSummaryData;
  patientInfo: EditablePatientInfo;
  initialDescription: string;
  selectedRegions: BodyRegionId[];
  isOtherSelected?: boolean;
  turns: ConversationTurn[];
  answers: Record<string, any>;
  onUpdatePatientInfo: (updated: EditablePatientInfo) => void;
  onUpdateInitialDescription: (text: string) => void;
  onUpdateAnswer: (questionId: string, value: any, label?: string) => void;
  onGoToStage: (stageIndex: 1 | 2 | 3) => void;
  onConfirmAndContinue: () => void;
  isSubmitting?: boolean;
}

export const Stage4Review: React.FC<Stage4ReviewProps> = ({
  summary,
  patientInfo,
  initialDescription,
  selectedRegions,
  isOtherSelected = false,
  turns,
  answers,
  onUpdatePatientInfo,
  onUpdateInitialDescription,
  onUpdateAnswer,
  onGoToStage,
  onConfirmAndContinue,
  isSubmitting = false,
}) => {
  // Editing state for each of the 4 sections
  const [editingSection, setEditingSection] = useState<'personal' | 'health' | 'concern' | 'ai' | null>(null);

  // Temp states for inline editing
  const [tempPersonal, setTempPersonal] = useState({
    name: patientInfo.name,
    age: patientInfo.age,
    gender: patientInfo.gender,
    patientId: patientInfo.patientId || '•••• 4821',
  });

  const [tempHealth, setTempHealth] = useState({
    allergies: patientInfo.allergies?.join(', ') || 'None',
    ongoingConditions: patientInfo.ongoingConditions?.join(', ') || 'None',
    otherHealthInfo: patientInfo.otherHealthInfo || '',
  });

  const [tempDescription, setTempDescription] = useState(
    initialDescription || summary.concern || ''
  );

  const [tempSeverity, setTempSeverity] = useState(
    summary.severityScore || (summary.severity.includes('7') ? 7 : 5)
  );
  const [tempDuration, setTempDuration] = useState(summary.duration || '2–3 days');
  const [tempPainType, setTempPainType] = useState(
    answers['pain_description']?.label || answers['head_problem']?.label || 'Sharp'
  );

  const savePersonal = () => {
    onUpdatePatientInfo({
      ...patientInfo,
      name: tempPersonal.name.trim(),
      age: Number(tempPersonal.age) || patientInfo.age,
      gender: tempPersonal.gender,
      patientId: tempPersonal.patientId.trim() || '•••• 4821',
    });
    setEditingSection(null);
  };

  const saveHealth = () => {
    onUpdatePatientInfo({
      ...patientInfo,
      allergies: tempHealth.allergies
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.toLowerCase() !== 'none'),
      ongoingConditions: tempHealth.ongoingConditions
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.toLowerCase() !== 'none'),
      otherHealthInfo: tempHealth.otherHealthInfo.trim(),
    });
    setEditingSection(null);
  };

  const saveConcern = () => {
    onUpdateInitialDescription(tempDescription);
    setEditingSection(null);
  };

  const saveAIResponses = () => {
    onUpdateAnswer('severity_slider', tempSeverity, `${tempSeverity} / 10`);
    onUpdateAnswer('duration_slider', tempDuration, tempDuration);
    onUpdateAnswer('pain_description', { id: 'edited', label: tempPainType }, tempPainType);
    setEditingSection(null);
  };

  return (
    <div
      id="stage-4-review-screen"
      className="w-full consultation-responsive-container space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-12"
    >
      {/* Review Header */}
      <div className="text-center space-y-1.5 mb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDEAFB] text-[#4C499E] text-xs font-bold uppercase tracking-wider mb-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#1E7D3F]" />
          <span>Stage 4 of 4 • Review & Confirmation</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232142] tracking-tight">
          Let&apos;s review what you&apos;ve told us
        </h2>
        <p className="text-sm text-[#6C6891] max-w-md mx-auto leading-relaxed">
          Please check your answers below. You can edit any section before confirming.
        </p>
      </div>

      {/* 1. PERSONAL DETAILS */}
      <div
        id="review-personal-details"
        className="bg-white rounded-3xl border border-[#DFDCF5] p-5 sm:p-6 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-3"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-[#F2F0FC]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#EDEAFB] text-[#4C499E] flex items-center justify-center">
              <User className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#232142]">
              Personal Details
            </h3>
          </div>

          {editingSection !== 'personal' ? (
            <button
              type="button"
              onClick={() => {
                setTempPersonal({
                  name: patientInfo.name,
                  age: patientInfo.age,
                  gender: patientInfo.gender,
                  patientId: patientInfo.patientId || '•••• 4821',
                });
                setEditingSection('personal');
              }}
              className="text-xs font-semibold text-[#4C499E] hover:text-[#38357B] hover:bg-[#F2EFFB] px-3 py-1 rounded-xl border border-[#DFDCF5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={savePersonal}
                className="text-xs font-bold text-white bg-[#4C499E] hover:bg-[#3A3785] px-3 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="text-xs text-[#7A769C] hover:text-[#232142] px-2 py-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {editingSection === 'personal' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div>
              <label className="font-bold text-[#6D6995] block mb-1">Full Name</label>
              <input
                type="text"
                value={tempPersonal.name}
                onChange={(e) => setTempPersonal({ ...tempPersonal, name: e.target.value })}
                className="w-full font-semibold px-3 py-2 rounded-xl bg-[#FAF9FD] border border-[#4C499E] text-[#232142]"
              />
            </div>
            <div>
              <label className="font-bold text-[#6D6995] block mb-1">Age</label>
              <input
                type="number"
                value={tempPersonal.age}
                onChange={(e) => setTempPersonal({ ...tempPersonal, age: Number(e.target.value) })}
                className="w-full font-semibold px-3 py-2 rounded-xl bg-[#FAF9FD] border border-[#4C499E] text-[#232142]"
              />
            </div>
            <div>
              <label className="font-bold text-[#6D6995] block mb-1">Gender</label>
              <select
                value={tempPersonal.gender}
                onChange={(e) => setTempPersonal({ ...tempPersonal, gender: e.target.value })}
                className="w-full font-semibold px-3 py-2 rounded-xl bg-[#FAF9FD] border border-[#4C499E] text-[#232142]"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-[#6D6995] block mb-1">Patient ID / ABHA</label>
              <input
                type="text"
                value={tempPersonal.patientId}
                onChange={(e) => setTempPersonal({ ...tempPersonal, patientId: e.target.value })}
                className="w-full font-mono font-semibold px-3 py-2 rounded-xl bg-[#FAF9FD] border border-[#4C499E] text-[#232142]"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[#8783A6] block mb-0.5 font-medium">Name</span>
              <span className="font-bold text-[#232142] text-sm">{patientInfo.name}</span>
            </div>
            <div>
              <span className="text-[#8783A6] block mb-0.5 font-medium">Age</span>
              <span className="font-bold text-[#232142] text-sm">{patientInfo.age} yrs</span>
            </div>
            <div>
              <span className="text-[#8783A6] block mb-0.5 font-medium">Gender</span>
              <span className="font-bold text-[#232142] text-sm">{patientInfo.gender}</span>
            </div>
            <div>
              <span className="text-[#8783A6] block mb-0.5 font-medium">Patient ID</span>
              <span className="font-mono font-bold text-[#4C499E] text-sm">
                {patientInfo.patientId || '•••• 4821'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. HEALTH DETAILS */}
      <div
        id="review-health-details"
        className="bg-white rounded-3xl border border-[#DFDCF5] p-5 sm:p-6 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-3"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-[#F2F0FC]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#EDEAFB] text-[#4C499E] flex items-center justify-center">
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#232142]">
              Health Details
            </h3>
          </div>

          {editingSection !== 'health' ? (
            <button
              type="button"
              onClick={() => {
                setTempHealth({
                  allergies: patientInfo.allergies?.join(', ') || 'None',
                  ongoingConditions: patientInfo.ongoingConditions?.join(', ') || 'None',
                  otherHealthInfo: patientInfo.otherHealthInfo || '',
                });
                setEditingSection('health');
              }}
              className="text-xs font-semibold text-[#4C499E] hover:text-[#38357B] hover:bg-[#F2EFFB] px-3 py-1 rounded-xl border border-[#DFDCF5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={saveHealth}
                className="text-xs font-bold text-white bg-[#4C499E] hover:bg-[#3A3785] px-3 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="text-xs text-[#7A769C] hover:text-[#232142] px-2 py-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {editingSection === 'health' ? (
          <div className="space-y-2.5 text-xs">
            <div>
              <label className="font-bold text-[#6D6995] block mb-1">Allergies</label>
              <input
                type="text"
                value={tempHealth.allergies}
                onChange={(e) => setTempHealth({ ...tempHealth, allergies: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9FD] border border-[#4C499E] text-[#232142]"
              />
            </div>
            <div>
              <label className="font-bold text-[#6D6995] block mb-1">Ongoing Issues</label>
              <input
                type="text"
                value={tempHealth.ongoingConditions}
                onChange={(e) => setTempHealth({ ...tempHealth, ongoingConditions: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9FD] border border-[#4C499E] text-[#232142]"
              />
            </div>
            <div>
              <label className="font-bold text-[#6D6995] block mb-1">Other Information</label>
              <input
                type="text"
                value={tempHealth.otherHealthInfo}
                onChange={(e) => setTempHealth({ ...tempHealth, otherHealthInfo: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-[#FAF9FD] border border-[#4C499E] text-[#232142]"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-start justify-between">
              <span className="text-[#8783A6] font-medium w-28">Allergies:</span>
              <span className="font-semibold text-[#232142] flex-1 text-right">
                {patientInfo.allergies && patientInfo.allergies.length > 0 ? (
                  <span className="text-[#C91A39] bg-[#FEECEF] px-2 py-0.5 rounded-md inline-block">
                    {patientInfo.allergies.join(', ')}
                  </span>
                ) : (
                  'None reported'
                )}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-[#8783A6] font-medium w-28">Ongoing issues:</span>
              <span className="font-semibold text-[#232142] flex-1 text-right">
                {patientInfo.ongoingConditions && patientInfo.ongoingConditions.length > 0
                  ? patientInfo.ongoingConditions.join(', ')
                  : 'None reported'}
              </span>
            </div>

            {patientInfo.otherHealthInfo && (
              <div className="flex items-start justify-between pt-1 border-t border-[#F4F2FB]">
                <span className="text-[#8783A6] font-medium w-28">Other information:</span>
                <span className="font-medium text-[#4B4772] flex-1 text-right">
                  {patientInfo.otherHealthInfo}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. CONCERN */}
      <div
        id="review-concern-details"
        className="bg-white rounded-3xl border border-[#DFDCF5] p-5 sm:p-6 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-3"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-[#F2F0FC]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#EDEAFB] text-[#4C499E] flex items-center justify-center">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#232142]">
              Concern
            </h3>
          </div>

          {editingSection !== 'concern' ? (
            <button
              type="button"
              onClick={() => {
                setTempDescription(initialDescription || summary.concern || '');
                setEditingSection('concern');
              }}
              className="text-xs font-semibold text-[#4C499E] hover:text-[#38357B] hover:bg-[#F2EFFB] px-3 py-1 rounded-xl border border-[#DFDCF5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={saveConcern}
                className="text-xs font-bold text-white bg-[#4C499E] hover:bg-[#3A3785] px-3 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="text-xs text-[#7A769C] hover:text-[#232142] px-2 py-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {editingSection === 'concern' ? (
          <div className="space-y-2">
            <div>
              <label className="text-xs font-bold text-[#6D6995] block mb-1">
                Original Problem Description
              </label>
              <textarea
                rows={2}
                value={tempDescription}
                onChange={(e) => setTempDescription(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl bg-[#FAF9FD] border border-[#4C499E] text-[#232142] focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[#8783A6]">Selected area: {summary.primaryArea}</span>
              <button
                type="button"
                onClick={() => onGoToStage(3)}
                className="text-[#4C499E] font-bold hover:underline cursor-pointer"
              >
                Re-select body area →
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#8783A6] font-medium">Selected body area:</span>
              <span className="font-bold text-[#4C499E] bg-[#EDEAFB] px-2.5 py-1 rounded-lg">
                {summary.primaryArea} {summary.location ? `(${summary.location})` : ''}
              </span>
            </div>

            <div>
              <span className="text-[#8783A6] font-medium block mb-1">
                Original problem description:
              </span>
              <div className="p-3 bg-[#FAF9FD] rounded-xl border border-[#ECE8F7] font-semibold text-[#252243] text-xs sm:text-sm">
                &ldquo;{initialDescription || summary.concern || 'Not specified'}&rdquo;
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. AI RESPONSES */}
      <div
        id="review-ai-responses"
        className="bg-white rounded-3xl border border-[#DFDCF5] p-5 sm:p-6 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-3"
      >
        <div className="flex items-center justify-between pb-2.5 border-b border-[#F2F0FC]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#EDEAFB] text-[#4C499E] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#4C499E]" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[#232142]">
              AI Responses
            </h3>
          </div>

          {editingSection !== 'ai' ? (
            <button
              type="button"
              onClick={() => {
                setTempSeverity(summary.severityScore || (summary.severity.includes('7') ? 7 : 5));
                setTempDuration(summary.duration || '2–3 days');
                setTempPainType(
                  answers['pain_description']?.label || answers['head_problem']?.label || 'Sharp'
                );
                setEditingSection('ai');
              }}
              className="text-xs font-semibold text-[#4C499E] hover:text-[#38357B] hover:bg-[#F2EFFB] px-3 py-1 rounded-xl border border-[#DFDCF5] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={saveAIResponses}
                className="text-xs font-bold text-white bg-[#4C499E] hover:bg-[#3A3785] px-3 py-1 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
              >
                <Check className="w-3 h-3" />
                <span>Save</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingSection(null)}
                className="text-xs text-[#7A769C] hover:text-[#232142] px-2 py-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {editingSection === 'ai' ? (
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-[#6D6995] block mb-1">Pain Type / Sensation</label>
                <input
                  type="text"
                  value={tempPainType}
                  onChange={(e) => setTempPainType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9FD] border border-[#4C499E] text-[#232142]"
                />
              </div>
              <div>
                <label className="font-bold text-[#6D6995] block mb-1">Duration</label>
                <input
                  type="text"
                  value={tempDuration}
                  onChange={(e) => setTempDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF9FD] border border-[#4C499E] text-[#232142]"
                />
              </div>
            </div>
            <div>
              <label className="font-bold text-[#6D6995] block mb-1">
                Severity Rating: {tempSeverity} / 10
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
        ) : (
          <div className="space-y-2 text-xs divide-y divide-[#F6F4FD]">
            {/* If turns exist, render question -> answer pairs */}
            {turns.length > 0 ? (
              turns.map((turn, i) => (
                <div key={turn.id || i} className="pt-2 first:pt-0 flex items-start justify-between gap-3">
                  <span className="text-[#6D6992] font-medium flex-1">
                    {turn.question?.prompt || turn.aiMessage}
                  </span>
                  <span className="font-bold text-[#232142] bg-[#F2F0FB] px-2.5 py-1 rounded-lg text-right shrink-0">
                    {turn.userDisplayAnswer || 'Answered'}
                  </span>
                </div>
              ))
            ) : (
              /* Fallback structured display */
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#8783A6] block">Duration:</span>
                  <span className="font-bold text-[#232142]">{summary.duration}</span>
                </div>
                <div>
                  <span className="text-[#8783A6] block">Severity:</span>
                  <span className="font-bold text-[#232142]">{summary.severity}</span>
                </div>
                <div>
                  <span className="text-[#8783A6] block">Pain type:</span>
                  <span className="font-bold text-[#232142]">{tempPainType}</span>
                </div>
                <div>
                  <span className="text-[#8783A6] block">Prior episodes:</span>
                  <span className="font-bold text-[#232142]">{summary.previousEpisodes}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONFIRM & CONTINUE BUTTON */}
      <div
        id="review-action-container"
        className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <button
          type="button"
          onClick={() => onGoToStage(3)}
          className="text-xs font-bold text-[#6D6992] hover:text-[#4C499E] px-4 py-2 transition-colors cursor-pointer text-center sm:text-left"
        >
          ← Back to questions
        </button>

        <button
          type="button"
          id="btn-confirm-and-continue"
          onClick={onConfirmAndContinue}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#4C499E] to-[#635FB8] hover:from-[#3D3A8A] hover:to-[#534EA6] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#4C499E]/25 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Preparing Intake...</span>
            </>
          ) : (
            <>
              <span>Confirm &amp; Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
