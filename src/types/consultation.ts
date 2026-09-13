export type StageKey =
  | 'stage1_personal'
  | 'stage2_health'
  | 'stage3_problem'
  | 'stage4_review'
  | 'submitted';

export type BodyRegionId =
  | 'head'
  | 'face'
  | 'neck'
  | 'shoulder-left'
  | 'shoulder-right'
  | 'chest'
  | 'abdomen'
  | 'upper-back'
  | 'lower-back'
  | 'buttocks'
  | 'pelvis'
  | 'arm-left'
  | 'arm-right'
  | 'hand-left'
  | 'hand-right'
  | 'thigh-left'
  | 'thigh-right'
  | 'knee-left'
  | 'knee-right'
  | 'leg-left'
  | 'leg-right'
  | 'foot-left'
  | 'foot-right'
  | 'back'
  | 'other';

export interface BodyRegionInfo {
  id: BodyRegionId;
  label: string;
  side?: 'front' | 'back' | 'both';
  cx: number;
  cy: number;
  categoryMatch: string;
}

export interface ConcernCategory {
  id: string;
  label: string;
  emoji: string;
  bodyRegions: BodyRegionId[];
  description: string;
  popular?: boolean;
}

export interface EditablePatientInfo {
  name: string;
  age: number;
  patientId: string;
  gender: string;
  dob: string;
  ongoingConditions: string[];
  currentMedications: string[];
  allergies: string[];
  previousConditions?: string[];
  otherHealthInfo?: string;
  medicalHistory?: string;
  isConfirmed?: boolean;
}

export type ConsultationWorkflowStage =
  | 'personal_details'
  | 'body_problem'
  | 'ai_questioning'
  | 'review'
  | 'submitted';

export type QuestionType =
  | 'choice'
  | 'multiselect'
  | 'slider'
  | 'yesno'
  | 'text'
  | 'body-part'
  | 'date'
  | 'duration';

export interface QuestionOption {
  id: string;
  label: string;
  description?: string;
  emoji?: string;
  icon?: string;
  isEmergencyAlert?: boolean;
}

export interface ConsultationQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  helperText?: string;
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  minLabel?: string;
  maxLabel?: string;
  defaultValue?: number | string | string[];
  unit?: string;
  placeholder?: string;
  suggestions?: string[];
  allowNotSure?: boolean;
  optional?: boolean;
  isPainScale?: boolean;
  emergencyCheck?: (val: any) => { isEmergency: boolean; reason: string } | null;
}

export interface ConversationTurn {
  id: string;
  questionId: string;
  aiMessage: string;
  question: ConsultationQuestion;
  userAnswer?: any;
  userDisplayAnswer?: string;
  timestamp: string;
  isCurrent?: boolean;
}

export interface ConsultationSummaryData {
  primaryArea: string;
  selectedRegions: BodyRegionId[];
  concern: string;
  duration: string;
  severity: string;
  severityScore?: number;
  location: string;
  associatedSymptoms: string[];
  triggers: string[];
  previousEpisodes: string;
  additionalInformation?: string;
  triagePriority: 'Routine (Level 3)' | 'Priority OPD (Level 2)' | 'Urgent Attention (Level 1)';
  recommendedDepartment: string;
  createdAt: string;
}
