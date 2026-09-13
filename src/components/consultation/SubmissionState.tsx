import React from 'react';
import {
  ConsultationSummaryData,
  EditablePatientInfo,
} from '../../types/consultation';
import {
  CheckCircle2,
  FileText,
  Home,
  ShieldCheck,
  ArrowRight,
  Clock,
  UserCheck,
} from 'lucide-react';

interface SubmissionStateProps {
  summary: ConsultationSummaryData;
  patientInfo: EditablePatientInfo;
  onViewRecord: () => void;
  onBackToDashboard: () => void;
}

export const SubmissionState: React.FC<SubmissionStateProps> = ({
  summary,
  patientInfo,
  onViewRecord,
  onBackToDashboard,
}) => {
  return (
    <div
      id="submission-state-stage"
      className="w-full max-w-2xl mx-auto py-8 sm:py-12 space-y-7 text-center animate-in fade-in zoom-in-95 duration-300"
    >
      {/* Success Badge */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-tr from-[#1E7D3F] to-[#2BA055] text-white flex items-center justify-center shadow-xl shadow-[#1E7D3F]/25">
        <CheckCircle2 className="w-11 h-11 stroke-[2.5]" />
      </div>

      {/* Title and Confirmation Subtitle */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-[#EAF7EE] text-[#1E7D3F] border border-[#C6EDD2] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>✓ Consultation information recorded</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232142] tracking-tight">
          Information Recorded
        </h2>

        <p className="text-base sm:text-lg text-[#524E75] max-w-md mx-auto font-medium leading-relaxed">
          &ldquo;Your information has been prepared for review by your healthcare professional.&rdquo;
        </p>
      </div>

      {/* Clean Compact Information Card */}
      <div className="bg-white rounded-3xl border border-[#DFDCF0] p-5 sm:p-6 shadow-xs text-left space-y-3.5 max-w-lg mx-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EDF9]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2BA055]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#736F95]">
              Intake Summary Ready
            </span>
          </div>
          <span className="text-xs text-[#736F95]">Recorded today</span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-xs font-semibold text-[#7E7B9E]">Patient:</span>
            <span className="text-xs font-bold text-[#232142]">{patientInfo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-semibold text-[#7E7B9E]">Concern:</span>
            <span className="text-xs font-bold text-[#232142]">
              {summary.concern} ({summary.primaryArea})
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-semibold text-[#7E7B9E]">Severity / Duration:</span>
            <span className="text-xs font-semibold text-[#232142]">
              {summary.severity} • {summary.duration}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs font-semibold text-[#7E7B9E]">Recommended Dept:</span>
            <span className="text-xs font-semibold text-[#4C499E]">
              {summary.recommendedDepartment}
            </span>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-[#7A769C] bg-[#FAF9FD] p-2.5 rounded-xl border border-[#ECE9F8]">
          MediKiosk does not provide automatic diagnoses or prescriptions. Your doctor will review this intake during your consultation.
        </div>
      </div>

      {/* Options: [ View in Medical History ] and [ Back to Dashboard ] */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          id="btn-view-medical-history"
          onClick={onViewRecord}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#4C499E] hover:bg-[#3B3885] text-white font-bold text-sm shadow-md shadow-[#4C499E]/20 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <FileText className="w-4 h-4" />
          <span>View in Medical History</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          id="btn-back-to-dashboard"
          onClick={onBackToDashboard}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-[#F6F5FC] border border-[#D5D1F2] text-[#4C499E] font-bold text-sm shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
