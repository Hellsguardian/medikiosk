import React from 'react';
import { AIHelpCard } from './AIHelpCard';

interface PatientGreetingProps {
  patientName: string;
  onHelpClick: () => void;
}

export const PatientGreeting: React.FC<PatientGreetingProps> = ({
  patientName,
  onHelpClick,
}) => {
  return (
    <section
      id="medikiosk-patient-greeting-section"
      aria-label="Patient Greeting"
      className="relative w-full overflow-hidden pt-1 pb-1 sm:pt-2 sm:pb-2 transition-all duration-300"
    >
      {/* ──────────────────────────────────────────────────────────── */}
      {/* SUBTLE AMBIENT HEALTHCARE VISUAL DETAILS (BACKGROUND DEPTH) */}
      {/* Subconscious, extremely low-opacity motifs that never compete with Current Treatment */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Soft ambient lavender radial glow centered behind greeting text */}
        <div className="absolute -top-12 -left-8 w-96 h-48 rounded-full bg-radial from-[#DEDEF8]/35 via-[#ECEBFA]/20 to-transparent blur-3xl" />

        {/* Faint ambient medical cross motif (4% opacity) */}
        <svg
          className="absolute left-[38%] sm:left-[44%] top-2 w-12 h-12 text-[#514DA6] opacity-[0.06] transform -rotate-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 4v16m-8-8h16" />
        </svg>

        {/* Faint subtle health rhythm waveform (5% opacity) */}
        <svg
          className="absolute right-[22%] sm:right-[26%] bottom-1 w-28 h-8 text-[#514DA6] opacity-[0.05]"
          viewBox="0 0 120 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M0 15h30l5-9 8 18 7-12 5 6 5-3h60" />
        </svg>

        {/* Tiny soft decorative floating particles */}
        <div className="absolute left-[24%] top-1/4 w-1.5 h-1.5 rounded-full bg-[#514DA6] opacity-[0.08]" />
        <div className="absolute left-[32%] bottom-1/4 w-1 h-1 rounded-full bg-[#7D80A6] opacity-[0.10]" />
        <div className="absolute right-[32%] top-1/3 w-1.5 h-1.5 rounded-full bg-[#E85A9D] opacity-[0.09]" />
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MAIN TWO-COLUMN GREETING + ASSISTANT COMPOSITION */}
      {/* Inherits exact horizontal boundaries as Current Treatment Card */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 px-[7px]">
        {/* LEFT COLUMN: HERO GREETING TYPOGRAPHY HIERARCHY */}
        <div className="flex-1 min-w-0">
          {/* Eyebrow: 14–16px */}
          <span className="text-[14px] sm:text-[15px] font-medium text-[#7D80A6] tracking-tight block leading-normal">
            Good Morning,
          </span>

          {/* Primary Heading: 32–42px on desktop with responsive clamp */}
          <h1 className="text-[28px] sm:text-[34px] md:text-[36px] lg:text-[40px] font-extrabold text-[#24264A] tracking-tight leading-[1.14] mt-0.5 sm:mt-1 flex items-center flex-wrap gap-2 sm:gap-2.5">
            <span>{patientName}</span>
            <span
              className="inline-block select-none text-[26px] sm:text-[32px] lg:text-[36px] transition-transform duration-300 hover:rotate-12 cursor-default origin-[70%_70%]"
              role="img"
              aria-label="waving hand"
            >
              👋
            </span>
          </h1>

          {/* Supporting Text: 15–17px, calm and informative */}
          <p className="text-[14.5px] sm:text-[15.5px] lg:text-[16px] text-[#6E719A] font-normal mt-1 sm:mt-1.5 leading-relaxed max-w-xl">
            Here&apos;s your health record. Stay informed, stay healthy.
          </p>
        </div>

        {/* RIGHT COLUMN: AI HEALTH ASSISTANT FLOATING WIDGET */}
        {/* Aligned to the exact right boundary line */}
        <div className="self-start md:self-center flex-shrink-0 w-full sm:w-auto flex justify-start sm:justify-end">
          <AIHelpCard onClick={onHelpClick} />
        </div>
      </div>
    </section>
  );
};
