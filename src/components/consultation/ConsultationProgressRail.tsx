import React from 'react';
import {
  EditablePatientInfo,
  BodyRegionId,
  ConversationTurn,
  ConsultationSummaryData,
} from '../../types/consultation';
import {
  Check,
  Circle,
  ShieldCheck,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Plus,
  HeartPulse,
  BrainCircuit,
  Lock,
  FileCheck,
} from 'lucide-react';
import {
  getPrimaryRegionLabel,
  parseDurationFromText,
} from './questionEngine';

export type StageKey =
  | 'stage1_personal'
  | 'stage2_health'
  | 'stage3_problem'
  | 'stage4_review'
  | 'submitted';

export interface ConsultationProgressRailProps {
  stage: StageKey;
  progressPercent?: number;
  patientInfo: EditablePatientInfo;
  selectedRegions: BodyRegionId[];
  isOtherSelected?: boolean;
  initialDescription?: string;
  answers?: Record<string, any>;
  turns?: ConversationTurn[];
  consultationSummary?: ConsultationSummaryData | null;
  onSelectStage?: (stage: StageKey) => void;
  onEditReviewSection?: (section: 'personal' | 'health' | 'problem') => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers for Extracting Symptom Profile
// ─────────────────────────────────────────────────────────────────────────────

function getMainConcern(
  initialDescription?: string,
  primaryAreaLabel?: string,
  answers?: Record<string, any>,
  summaryConcern?: string
): string {
  if (summaryConcern && summaryConcern !== 'General Health Consultation') {
    return summaryConcern;
  }

  // Check specific answered problem choices
  const probKeys = [
    'head_problem',
    'chest_problem',
    'abdomen_problem',
    'back_problem',
    'arm_problem',
    'leg_problem',
    'general_problem',
  ];
  if (answers) {
    for (const key of probKeys) {
      if (answers[key]?.label) {
        return answers[key].label;
      }
    }
  }

  if (initialDescription && initialDescription.trim().length > 0) {
    const text = initialDescription.trim();
    const firstPeriod = text.indexOf('.');
    const firstComma = text.indexOf(',');
    const limit = Math.min(
      firstPeriod > 0 ? firstPeriod : 999,
      firstComma > 0 ? firstComma : 999,
      35
    );
    const candidate = text.substring(0, limit).trim();
    if (candidate.length > 2) return candidate;
  }

  if (primaryAreaLabel && primaryAreaLabel !== 'Health concern') {
    if (primaryAreaLabel.toLowerCase().includes('head')) return 'Headache / Discomfort';
    if (primaryAreaLabel.toLowerCase().includes('abdomen')) return 'Abdominal Pain';
    if (primaryAreaLabel.toLowerCase().includes('chest')) return 'Chest Discomfort';
    return `${primaryAreaLabel} Discomfort`;
  }

  return 'Describing concern...';
}

function getBodyAreaDisplay(regions: BodyRegionId[], isOther?: boolean) {
  if (regions.length === 0 && !isOther) {
    return { emoji: '📍', label: 'Not selected yet', hasSelected: false };
  }

  const primary = regions[0] || (isOther ? 'other' : '');
  const emojiMap: Record<string, string> = {
    head: '🧠',
    face: '🤕',
    neck: '🧣',
    chest: '🫀',
    abdomen: '🩺',
    pelvis: '⚕️',
    'arm-left': '💪',
    'arm-right': '💪',
    'hand-left': '🖐️',
    'hand-right': '🖐️',
    'leg-left': '🦵',
    'leg-right': '🦵',
    'foot-left': '🦶',
    'foot-right': '🦶',
    back: '🦴',
    other: '🩺',
  };

  const label = getPrimaryRegionLabel(regions, isOther);
  return {
    emoji: emojiMap[primary] || '🩺',
    label,
    hasSelected: true,
  };
}

function getDurationDisplay(answers?: Record<string, any>, initialDescription?: string) {
  if (answers) {
    if (answers['duration_slider'] !== undefined) {
      const days = Number(answers['duration_slider']);
      return {
        answered: true,
        text: `${days} ${days === 1 ? 'day' : days >= 10 ? 'days+' : 'days'}`,
      };
    }
    if (answers['duration_auto_extracted']) {
      return { answered: true, text: String(answers['duration_auto_extracted']) };
    }
    if (answers['duration']) {
      const d = answers['duration'];
      return { answered: true, text: typeof d === 'object' ? d.label || d.text : String(d) };
    }
    if (answers['onset_duration']) {
      const od = answers['onset_duration'];
      return { answered: true, text: typeof od === 'object' ? od.label : String(od) };
    }
  }

  if (initialDescription) {
    const parsed = parseDurationFromText(initialDescription);
    if (parsed?.label) {
      return { answered: true, text: parsed.label };
    }
  }

  return { answered: false, text: 'Not answered' };
}

function getPainLevelDisplay(answers?: Record<string, any>) {
  if (!answers) return { answered: false, text: 'Not answered' };

  if (answers['pain_severity']) {
    const sev = answers['pain_severity'];
    const label = typeof sev === 'object' ? sev.label || sev.id : String(sev);
    return { answered: true, text: label };
  }
  if (answers['severity_slider'] !== undefined) {
    const s = Number(answers['severity_slider']);
    const desc = s <= 3 ? 'Mild' : s <= 6 ? 'Moderate' : 'Severe';
    return { answered: true, text: `${desc} (${s}/10)` };
  }
  if (answers['severity']) {
    const s = answers['severity'];
    return { answered: true, text: typeof s === 'object' ? s.label : String(s) };
  }

  return { answered: false, text: 'Not answered' };
}

function getCollectedSymptoms(answers?: Record<string, any>): string[] {
  if (!answers) return [];
  const list: string[] = [];

  const addVal = (val: any) => {
    if (!val) return;
    if (Array.isArray(val)) {
      val.forEach((item) => addVal(item));
    } else if (typeof val === 'object' && val.label) {
      if (!list.includes(val.label)) list.push(val.label);
    } else if (typeof val === 'string' && val.trim() && val !== 'none') {
      if (!list.includes(val.trim())) list.push(val.trim());
    }
  };

  addVal(answers['associated_symptoms']);
  addVal(answers['head_symptoms']);
  addVal(answers['chest_symptoms']);
  addVal(answers['abdomen_symptoms']);
  addVal(answers['pelvis_symptoms']);
  addVal(answers['back_symptoms']);
  addVal(answers['headache_type']);
  addVal(answers['chest_sensation']);
  addVal(answers['abdomen_type']);
  addVal(answers['symptom_nature']);
  addVal(answers['pain_quality']);

  return list;
}

export const ConsultationProgressRail: React.FC<ConsultationProgressRailProps> = ({
  stage,
  patientInfo,
  selectedRegions,
  isOtherSelected = false,
  initialDescription = '',
  answers = {},
  consultationSummary,
  onEditReviewSection,
}) => {
  // Symptom Profile Computations for Stage 3
  const bodyArea = getBodyAreaDisplay(selectedRegions, isOtherSelected);
  const mainConcern = getMainConcern(
    initialDescription,
    bodyArea.label,
    answers,
    consultationSummary?.concern
  );
  const duration = getDurationDisplay(answers, initialDescription);
  const painLevel = getPainLevelDisplay(answers);
  const symptoms = getCollectedSymptoms(answers);

  // Flexible Profile Completeness metrics
  const hasBodyArea = bodyArea.hasSelected;
  const hasMainConcern =
    mainConcern !== 'Describing concern...' && mainConcern !== 'Health concern';
  const hasDuration = duration.answered;
  const hasPainLevel = painLevel.answered;
  const hasSymptoms = symptoms.length > 0;

  let collectedCount = 0;
  if (hasBodyArea) collectedCount++;
  if (hasMainConcern) collectedCount++;
  if (hasDuration) collectedCount++;
  if (hasPainLevel) collectedCount++;
  if (hasSymptoms) collectedCount++;

  // Profile building percentage (20% per key element)
  const completenessPercent = Math.min(100, Math.max(20, collectedCount * 20));
  const detailsNeeded = Math.max(0, 5 - collectedCount);

  // Focus helper for Stage 2 action
  const handleAddHealthInfoClick = () => {
    const el = document.getElementById('stage-2-health-details') || document.querySelector('textarea');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (el instanceof HTMLTextAreaElement || el.querySelector('textarea')) {
        const input = el instanceof HTMLTextAreaElement ? el : el.querySelector('textarea');
        input?.focus();
      }
    }
  };

  return (
    <aside
      id="consultation-companion-sidebar"
      className="w-full space-y-4 text-left select-none"
    >
      {/* Companion Subtitle Header */}
      <div className="flex items-center justify-between px-1">
        <div className="inline-flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7B77D4] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4C499E]" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#686494]">
            Consultation Companion
          </span>
        </div>
        <span className="text-[11px] font-semibold text-[#8C88B0] flex items-center gap-1">
          <BrainCircuit className="w-3.5 h-3.5 text-[#7B77D4]" />
          <span>Active</span>
        </span>
      </div>

      {/* =========================================================================
          STAGE 1 — PERSONAL DETAILS
          CONSULTATION CHECKLIST + YOUR PRIVACY
          No repetition of Name, Age, Gender, ID
         ========================================================================= */}
      {stage === 'stage1_personal' && (
        <div
          key="stage1_personal_companion"
          className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
            {/* Consultation Checklist Card */}
            <div className="bg-white rounded-3xl border border-[#DFDCF5] p-5 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-[#F2EFFB]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7799]">
                  Consultation Checklist
                </span>
                <span className="text-[10px] font-bold text-[#4C499E] bg-[#EDEAFB] px-2 py-0.5 rounded-full">
                  Step 1 of 4
                </span>
              </div>

              <div className="space-y-2.5">
                {/* 1. Personal details (Active / In-progress) */}
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F6F4FD] border border-[#DDD9F4] text-[#242142]">
                  <div className="w-5 h-5 rounded-full bg-[#4C499E] text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-xs font-bold">Personal details</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4C499E] bg-[#EDEAFB] px-2 py-0.5 rounded-full">
                      In progress
                    </span>
                  </div>
                </div>

                {/* 2. Health details */}
                <div className="flex items-center gap-3 p-2 rounded-xl text-[#8E8BA8]">
                  <Circle className="w-4 h-4 text-[#C5C0E2] shrink-0 ml-0.5" />
                  <span className="text-xs font-medium">Health details</span>
                </div>

                {/* 3. Main concern */}
                <div className="flex items-center gap-3 p-2 rounded-xl text-[#8E8BA8]">
                  <Circle className="w-4 h-4 text-[#C5C0E2] shrink-0 ml-0.5" />
                  <span className="text-xs font-medium">Main concern</span>
                </div>

                {/* 4. Symptoms & questions */}
                <div className="flex items-center gap-3 p-2 rounded-xl text-[#8E8BA8]">
                  <Circle className="w-4 h-4 text-[#C5C0E2] shrink-0 ml-0.5" />
                  <span className="text-xs font-medium">Symptoms & questions</span>
                </div>

                {/* 5. Review */}
                <div className="flex items-center gap-3 p-2 rounded-xl text-[#8E8BA8]">
                  <Circle className="w-4 h-4 text-[#C5C0E2] shrink-0 ml-0.5" />
                  <span className="text-xs font-medium">Review</span>
                </div>
              </div>
            </div>

            {/* Privacy Card */}
            <div className="bg-[#FAF9FE] rounded-3xl border border-[#E4E0F4] p-5 space-y-2.5 shadow-2xs">
              <div className="flex items-center gap-2 text-[#4C499E]">
                <ShieldCheck className="w-4 h-4 text-[#1E7D3F]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#35315E]">
                  Your Privacy
                </span>
              </div>
              <p className="text-xs text-[#6B678F] leading-relaxed">
                Your information is used only to prepare this consultation and organize your symptoms for your healthcare professional.
              </p>
              <div className="pt-2 border-t border-[#EDEAF7] flex items-center justify-between text-[11px] text-[#7A769C]">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-[#7B77D4]" />
                  <span>Confidential</span>
                </span>
                <span>Doctor-reviewed</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 2 — HEALTH DETAILS
            HEALTH SNAPSHOT + WHY WE ASK
            Dynamic updates as user enters allergies/conditions
           ========================================================================= */}
        {stage === 'stage2_health' && (
          <div
            key="stage2_health_companion"
            className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {/* Health Snapshot Card */}
            <div className="bg-white rounded-3xl border border-[#DFDCF5] p-5 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-4">
              <div className="flex items-center justify-between pb-1 border-b border-[#F2EFFB]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7799]">
                  Health Snapshot
                </span>
                <span className="text-[10px] font-bold text-[#1E7D3F] bg-[#EBF6EE] px-2 py-0.5 rounded-full border border-[#D5ECD9]">
                  Live Sync
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                {/* Allergies */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B678F] block">
                    Allergies
                  </span>
                  {patientInfo.allergies && patientInfo.allergies.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {patientInfo.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F6F4FD] text-[#4C499E] font-semibold text-[11px] border border-[#E0DCF7]"
                        >
                          <Check className="w-3 h-3 text-[#1E7D3F] stroke-[2.5]" />
                          {allergy}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#9B97B5] italic">None added</p>
                  )}
                </div>

                {/* Existing Conditions */}
                <div className="space-y-1 pt-2 border-t border-[#F5F3FB]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B678F] block">
                    Existing conditions
                  </span>
                  {patientInfo.ongoingConditions && patientInfo.ongoingConditions.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {patientInfo.ongoingConditions.map((condition, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAF9FE] text-[#332F5C] font-semibold text-[11px] border border-[#E4E0F5]"
                        >
                          <Check className="w-3 h-3 text-[#1E7D3F] stroke-[2.5]" />
                          {condition}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#9B97B5] italic">None added</p>
                  )}
                </div>

                {/* Current Medications */}
                <div className="space-y-1 pt-2 border-t border-[#F5F3FB]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B678F] block">
                    Current medications
                  </span>
                  {patientInfo.currentMedications && patientInfo.currentMedications.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {patientInfo.currentMedications.map((med, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#F8F7FD] text-[#4E4A78] text-[11px] font-medium border border-[#E9E6F8]"
                        >
                          {med}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-[#9B97B5] italic">None added</p>
                  )}
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={handleAddHealthInfoClick}
                className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold text-[#4C499E] hover:text-[#383584] hover:bg-[#F2EFFB] border border-dashed border-[#CFCAEF] transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add health information</span>
              </button>
            </div>

            {/* Why We Ask Card */}
            <div className="bg-[#FAF9FE] rounded-3xl border border-[#E4E0F4] p-4 sm:p-5 space-y-2 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#4C499E]">
                <HelpCircle className="w-4 h-4 text-[#7B77D4]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#35315E]">
                  Why We Ask
                </span>
              </div>
              <p className="text-xs text-[#6B678F] leading-relaxed">
                These details help us understand your situation and avoid asking irrelevant questions.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 3 — PROBLEM & QUESTIONS (MOST IMPORTANT)
            YOUR SYMPTOM PROFILE: Main concern, Body area, Duration, Pain level, Symptoms
            Smooth auto-updates as user answers AI questions
            PROFILE BUILDING at bottom with flexible completeness
           ========================================================================= */}
        {stage === 'stage3_problem' && (
          <div
            key="stage3_problem_companion"
            className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {/* Symptom Profile Card */}
            <div className="bg-white rounded-3xl border border-[#DFDCF5] p-5 sm:p-6 shadow-[0_6px_28px_rgba(76,73,158,0.06)] space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#F2EFFB]">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#4C499E]" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6A6694]">
                    Your Symptom Profile
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#4C499E] bg-[#EDEAFB] px-2.5 py-0.5 rounded-full border border-[#DDD8F4]">
                  Interactive
                </span>
              </div>

              {/* Profile Details List */}
              <div className="space-y-3.5">
                {/* 1. Main Concern */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7799] block">
                    Main Concern
                  </span>
                  <div className="p-2.5 rounded-2xl bg-[#FAF9FD] border border-[#ECE9F7] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#232142] truncate">
                      {mainConcern}
                    </span>
                    {hasMainConcern && (
                      <Check className="w-3.5 h-3.5 text-[#1E7D3F] stroke-[3] shrink-0 ml-1" />
                    )}
                  </div>
                </div>

                {/* 2. Body Area */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7799] block">
                    Body Area
                  </span>
                  <div
                    className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between ${
                      bodyArea.hasSelected
                        ? 'bg-[#F5F3FD] border-[#DCD7F5] text-[#242142]'
                        : 'bg-[#FAF9FD] border-[#ECE9F7] text-[#908DAF]'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base leading-none">{bodyArea.emoji}</span>
                      <span className="text-xs font-bold truncate">{bodyArea.label}</span>
                    </div>
                    {bodyArea.hasSelected && (
                      <Check className="w-3.5 h-3.5 text-[#1E7D3F] stroke-[3] shrink-0 ml-1" />
                    )}
                  </div>
                </div>

                {/* 3. Duration */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7799] block">
                    Duration
                  </span>
                  <div
                    className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between ${
                      duration.answered
                        ? 'bg-[#F7FBF8] border-[#D6EDDC] text-[#1E5C32]'
                        : 'bg-[#FAF9FD] border-[#ECE9F7] text-[#908DAF]'
                    }`}
                  >
                    <span
                      className={`text-xs ${
                        duration.answered ? 'font-bold text-[#1E5C32]' : 'italic text-[#908DAF]'
                      }`}
                    >
                      {duration.text}
                    </span>
                    {duration.answered && (
                      <Check className="w-3.5 h-3.5 text-[#1E7D3F] stroke-[3] shrink-0 ml-1" />
                    )}
                  </div>
                </div>

                {/* 4. Pain Level */}
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7799] block">
                    Pain Level
                  </span>
                  <div
                    className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between ${
                      painLevel.answered
                        ? 'bg-[#F6F4FD] border-[#DDD9F4] text-[#242142]'
                        : 'bg-[#FAF9FD] border-[#ECE9F7] text-[#908DAF]'
                    }`}
                  >
                    <span
                      className={`text-xs ${
                        painLevel.answered ? 'font-bold text-[#232142]' : 'italic text-[#908DAF]'
                      }`}
                    >
                      {painLevel.text}
                    </span>
                    {painLevel.answered && (
                      <Check className="w-3.5 h-3.5 text-[#1E7D3F] stroke-[3] shrink-0 ml-1" />
                    )}
                  </div>
                </div>

                {/* 5. Symptoms */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A7799] block">
                    Symptoms
                  </span>
                  {symptoms.length > 0 ? (
                    <div className="space-y-1.5">
                      {symptoms.map((symp, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded-xl bg-[#F8F7FD] border border-[#EAE7F8] text-xs font-semibold text-[#34305E]"
                        >
                          <div className="w-4 h-4 rounded-full bg-[#EBF6EE] text-[#1E7D3F] flex items-center justify-center shrink-0">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="truncate">{symp}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-2xl bg-[#FAF9FD] border border-[#ECE9F7] text-left">
                      <span className="text-xs text-[#908DAF] italic">
                        Awaiting symptom details
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Building Card Section */}
              <div className="pt-3 border-t border-[#F2EFFB] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A5682]">
                    Profile Building
                  </span>
                  <span className="font-extrabold text-[#4C499E] bg-[#EDEAFB] px-2 py-0.5 rounded-full text-[11px]">
                    {completenessPercent}%
                  </span>
                </div>

                {/* Smooth Progress Bar */}
                <div className="w-full h-2.5 bg-[#EEEBF8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4C499E] via-[#635FB8] to-[#8C52FF] transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${completenessPercent}%` }}
                  />
                </div>

                <p className="text-[11px] font-semibold text-[#736F99] text-right pt-0.5">
                  {detailsNeeded > 0
                    ? `${detailsNeeded} ${detailsNeeded === 1 ? 'detail' : 'details'} still needed`
                    : 'Profile well defined ✓'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STAGE 4 — REVIEW
            READY TO REVIEW checklist + BEFORE YOU CONTINUE guidance
            Subtle "Edit information →" action
           ========================================================================= */}
        {stage === 'stage4_review' && (
          <div
            key="stage4_review_companion"
            className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            {/* Ready to Review Card */}
            <div className="bg-white rounded-3xl border border-[#DFDCF5] p-5 sm:p-6 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-3.5">
              <div className="flex items-center justify-between pb-1 border-b border-[#F2EFFB]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7799]">
                  Ready to Review
                </span>
                <span className="text-[10px] font-bold text-[#1E7D3F] bg-[#EAF6ED] px-2 py-0.5 rounded-full border border-[#D5EED9]">
                  All Set
                </span>
              </div>

              {/* Checklist */}
              <div className="space-y-2 text-xs">
                {[
                  'Personal details',
                  'Health details',
                  'Main concern',
                  'Selected body area',
                  'Symptoms',
                  'AI responses',
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-[#F9F8FD] border border-[#ECE9F8] text-[#242142]"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#1E7D3F] text-white flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="font-semibold text-xs text-[#2A274E]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Before You Continue Card */}
            <div className="bg-[#FAF9FE] rounded-3xl border border-[#E4E0F4] p-5 space-y-3 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[#4C499E]">
                <FileCheck className="w-4 h-4 text-[#4C499E]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#35315E]">
                  Before You Continue
                </span>
              </div>
              <p className="text-xs text-[#6B678F] leading-relaxed">
                Please make sure your information is accurate. You can edit any section before continuing.
              </p>

              {/* Edit Information Action */}
              <button
                type="button"
                onClick={() => onEditReviewSection?.('personal')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4C499E] hover:text-[#37337F] pt-1 transition-colors cursor-pointer group"
              >
                <span>Edit information</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            SUBMISSION STATE: CONSULTATION RECORDED
           ========================================================================= */}
        {stage === 'submitted' && (
          <div
            key="submitted_companion"
            className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            <div className="bg-white rounded-3xl border border-[#DFDCF5] p-5 shadow-[0_4px_24px_rgba(76,73,158,0.05)] space-y-3.5 text-center">
              <div className="w-10 h-10 rounded-2xl bg-[#EAF6ED] text-[#1E7D3F] flex items-center justify-center mx-auto shadow-2xs">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#232142]">Consultation Ready</h4>
                <p className="text-xs text-[#6B678F] mt-1 leading-relaxed">
                  Your intake summary has been compiled and saved to your health record for physician review.
                </p>
              </div>
            </div>
          </div>
        )}
    </aside>
  );
};
