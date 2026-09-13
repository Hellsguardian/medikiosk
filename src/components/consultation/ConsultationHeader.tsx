import React from 'react';
import { ArrowLeft, Sparkles, Shield, RotateCcw } from 'lucide-react';
import { MediKioskLogo } from '../SvgIllustrations';

interface ConsultationHeaderProps {
  onBackToDashboard: () => void;
  onRestart: () => void;
  currentStageText?: string;
  isComplete?: boolean;
}

export const ConsultationHeader: React.FC<ConsultationHeaderProps> = ({
  onBackToDashboard,
  onRestart,
  currentStageText = 'New Consultation',
  isComplete = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E3E0F3] shadow-xs px-4 sm:px-6 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Back to Dashboard CTA */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToDashboard}
            className="flex items-center gap-2 text-xs sm:text-sm font-bold text-[#4C499E] hover:text-[#38357B] bg-[#F2F0FB] hover:bg-[#E8E5F8] px-3 sm:px-4 py-2 rounded-xl transition-all active:scale-95 cursor-pointer shadow-2xs border border-[#DFDCF5]"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          <div className="hidden sm:block h-5 w-[1px] bg-[#E3E0F0]" />

          {/* Logo & Brand Identity */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#4C499E] to-[#6763BE] flex items-center justify-center p-1 shadow-sm">
              <MediKioskLogo className="w-6 h-6" />
            </div>
            <div className="leading-none">
              <span className="text-sm font-bold tracking-tight text-[#232142]">
                MediKiosk
              </span>
              <span className="text-[10px] text-[#8481A2] block font-medium">
                Clinical Consultation
              </span>
            </div>
          </div>
        </div>

        {/* Center: Active Stage Pill */}
        <div className="hidden md:flex items-center gap-2 bg-[#FAF9FE] border border-[#E4E1F6] px-3 py-1 rounded-full text-xs">
          <span className="w-2 h-2 rounded-full bg-[#E85A9F] animate-pulse" />
          <span className="text-[#646187] font-medium">Status:</span>
          <span className="font-bold text-[#4C499E]">{currentStageText}</span>
        </div>

        {/* Right: Security Badge & Restart */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold text-[#534F91] bg-[#F5F4FD] px-2.5 py-1 rounded-lg border border-[#E3E0F5]">
            <Shield className="w-3.5 h-3.5 text-[#2BA055]" />
            <span>ABHA Encrypted Intake</span>
          </div>

          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#7E7A9D] hover:text-[#4C499E] hover:bg-[#F2EFFB] px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            title="Reset consultation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Start Over</span>
          </button>
        </div>
      </div>
    </header>
  );
};
