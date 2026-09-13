import React from 'react';
import { Calendar, Users, FileText, ArrowRight } from 'lucide-react';
import { MedicalEpisode } from '../types';
import { LiverIconSmall } from './SvgIllustrations';

interface CurrentTreatmentCardProps {
  episode: MedicalEpisode;
  onViewDetails: () => void;
  onViewPrescriptions: () => void;
}

export const CurrentTreatmentCard: React.FC<CurrentTreatmentCardProps> = ({
  episode,
  onViewDetails,
  onViewPrescriptions,
}) => {
  return (
    <div
      id="current-treatment-hero-card"
      className="group relative overflow-hidden rounded-[22px] sm:rounded-[26px] text-white p-4.5 xs:p-5 sm:p-7 lg:p-8 border border-white/24 shadow-[0_16px_35px_rgba(49,45,120,0.22),0_4px_14px_rgba(49,45,120,0.12),inset_0_1px_1px_0_rgba(255,255,255,0.36)] transition-all duration-500"
      style={{
        background:
          'linear-gradient(110deg, #4C499E 0%, #5754AD 35%, #6864BF 65%, #7773C9 100%)',
      }}
    >
      {/* ──────────────────────────────────────────────────────────── */}
      {/* SCOPED KEYFRAME ANIMATIONS FOR SUBTLE LIVING REASSURANCE */}
      {/* ──────────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes treatmentAuraPulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.88;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
        @keyframes treatmentOrbitalRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes treatmentOrbitalReverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
      `}</style>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* LAYER 0: ULTRA-SUBTLE TACTILE NOISE / MATERIAL TEXTURE */}
      {/* ──────────────────────────────────────────────────────────── */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.022] mix-blend-overlay z-0"
      >
        <filter id="treatment-card-noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#treatment-card-noise-filter)" />
      </svg>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* LAYER 1: MULTI-ZONE LIGHTING ARCHITECTURE (LEFT/CENTER/RIGHT) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {/* Top subtle sheen highlight line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/55 to-transparent pointer-events-none z-20"
      />

      {/* ZONE 1 (LEFT): Slightly darker vignette for crisp white typography contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#38357A]/35 via-[#454293]/15 to-transparent pointer-events-none z-0"
      />

      {/* ZONE 2 (CENTER): Atmospheric radial illumination specifically calibrated behind the liver */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background:
            'radial-gradient(circle at 60% 50%, rgba(183, 178, 244, 0.18) 0%, rgba(143, 136, 230, 0.12) 32%, rgba(92, 86, 184, 0.08) 55%, transparent 72%), radial-gradient(circle at 62% 48%, rgba(210, 205, 255, 0.14) 0%, rgba(143, 136, 230, 0.06) 35%, transparent 60%)',
        }}
      />

      {/* ZONE 3 (RIGHT): Soft periwinkle ambient depth bloom behind the glass statistics panel */}
      <div
        aria-hidden="true"
        className="absolute -bottom-16 right-4 w-88 h-88 rounded-full bg-radial from-[#7C77D1]/18 via-[#6864BF]/10 to-transparent blur-3xl pointer-events-none z-0"
      />

      {/* Top-left soft ambient light bloom */}
      <div
        aria-hidden="true"
        className="absolute -top-14 -left-14 w-72 h-72 rounded-full bg-radial from-[#B7B2F4]/12 via-[#8F88E6]/[0.08] to-transparent blur-3xl pointer-events-none z-0"
      />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* ATMOSPHERIC BACKGROUND EFFECTS & LIVER ILLUSTRATION (DESKTOP) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="hidden lg:flex absolute right-[21%] xl:right-[23%] 2xl:right-[25%] top-1/2 -translate-y-1/2 items-center justify-center pointer-events-none select-none z-[1]"
      >
        {/* Layer 2: Multi-tiered luminous lavender/purple radial aura & bloom behind liver (no harsh white) */}
        {/* Outer soft royal purple & lavender bloom */}
        <div
          className="absolute w-[440px] h-[440px] rounded-full pointer-events-none -z-10 blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(143, 136, 230, 0.22) 0%, rgba(92, 86, 184, 0.15) 45%, transparent 75%)',
            animation: 'treatmentAuraPulse 9s ease-in-out infinite',
          }}
        />
        {/* Mid soft mist lavender bloom */}
        <div
          className="absolute w-[320px] h-[320px] rounded-full pointer-events-none -z-10 blur-2xl"
          style={{
            background:
              'radial-gradient(circle, rgba(183, 178, 244, 0.24) 0%, rgba(210, 205, 255, 0.15) 40%, transparent 70%)',
          }}
        />
        {/* Diffused soft lavender core (brightest point is lavender, not white) */}
        <div
          className="absolute w-[200px] h-[200px] rounded-full pointer-events-none -z-10 blur-xl"
          style={{
            background:
              'radial-gradient(circle, rgba(210, 205, 255, 0.18) 0%, rgba(183, 178, 244, 0.12) 50%, transparent 75%)',
          }}
        />

        {/* Layer 3: Layered biometric orbital visualization with slow, elegant movement */}
        <div className="absolute w-[440px] h-[440px] flex items-center justify-center pointer-events-none -z-10">
          {/* Static precision axis ticks & concentric guide rings */}
          <svg
            className="absolute w-[440px] h-[440px]"
            viewBox="0 0 440 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Very faint outer ring */}
            <circle cx="220" cy="220" r="202" stroke="white" strokeWidth="1" strokeOpacity="0.09" />

            {/* Slightly brighter inner ring */}
            <circle cx="220" cy="220" r="118" stroke="#C7CBF3" strokeWidth="1" strokeOpacity="0.18" />

            {/* Innermost ring */}
            <circle cx="220" cy="220" r="74" stroke="white" strokeWidth="1" strokeDasharray="2 5" strokeOpacity="0.12" />

            {/* Precision axis ticks */}
            <line x1="220" y1="8" x2="220" y2="24" stroke="white" strokeWidth="1.5" strokeOpacity="0.22" />
            <line x1="220" y1="416" x2="220" y2="432" stroke="white" strokeWidth="1.5" strokeOpacity="0.22" />
            <line x1="8" y1="220" x2="24" y2="220" stroke="white" strokeWidth="1.5" strokeOpacity="0.22" />
            <line x1="416" y1="220" x2="432" y2="220" stroke="white" strokeWidth="1.5" strokeOpacity="0.22" />

            {/* Subtle horizontal and vertical markers */}
            <circle cx="220" cy="58" r="2" fill="white" fillOpacity="0.65" />
            <circle cx="382" cy="220" r="2" fill="white" fillOpacity="0.65" />
            <circle cx="220" cy="382" r="2" fill="white" fillOpacity="0.65" />
            <circle cx="58" cy="220" r="2" fill="white" fillOpacity="0.65" />
          </svg>

          {/* Dotted orbital path with subtle slow 60s rotation and illuminated nodes */}
          <svg
            className="absolute w-[440px] h-[440px] motion-safe:animate-[treatmentOrbitalRotate_60s_linear_infinite]"
            viewBox="0 0 440 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Dotted orbital path */}
            <circle
              cx="220"
              cy="220"
              r="160"
              stroke="white"
              strokeWidth="1.2"
              strokeDasharray="4 8"
              strokeOpacity="0.15"
            />

            {/* Tiny illuminated orbital nodes */}
            <circle cx="333" cy="107" r="3" fill="#C7CBF3" fillOpacity="0.85" />
            <circle cx="333" cy="107" r="6" fill="#C7CBF3" fillOpacity="0.25" />
            <circle cx="107" cy="333" r="2.5" fill="white" fillOpacity="0.75" />
          </svg>

          {/* Secondary counter-orbital faint arc with micro-nodes */}
          <svg
            className="absolute w-[440px] h-[440px] motion-safe:animate-[treatmentOrbitalReverse_80s_linear_infinite]"
            viewBox="0 0 440 440"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Faint outer satellite node */}
            <circle cx="362" cy="285" r="2" fill="#A9A7DE" fillOpacity="0.7" />
            <circle cx="78" cy="155" r="2" fill="#C7CBF3" fillOpacity="0.65" />
          </svg>
        </div>

        {/* Layer 4: Real liver.png illustration with soft feathered vertical boundaries to blend smoothly */}
        <div
          className="relative flex items-center justify-center"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0%, black 9%, black 91%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0%, black 9%, black 91%, transparent 100%)',
          }}
        >
          <img
            src="/assets/liver.png?v=3"
            alt="3D Holographic Liver Anatomy"
            className="w-[320px] xl:w-[370px] 2xl:w-[410px] h-auto max-h-[310px] object-contain transition-all duration-700 hover:scale-[1.025]"
            style={{
              filter:
                'drop-shadow(0 16px 32px rgba(35, 25, 80, 0.38)) drop-shadow(0 0 38px rgba(183, 178, 244, 0.24)) drop-shadow(0 2px 8px rgba(183, 178, 244, 0.18))',
            }}
          />
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MOBILE SPECIFIC LAYOUT (< 768px): STRICT ISOLATED HIERARCHY */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 md:hidden flex flex-col gap-4">
        {/* 1. Floating Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.14] backdrop-blur-md text-[10.5px] font-bold tracking-wider uppercase text-white/95 border border-white/28 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_12px_rgba(40,30,85,0.18)] self-start">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C7CBF3] opacity-60"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C7CBF3] shadow-[0_0_8px_#C7CBF3]"></span>
          </span>
          <span>CURRENT TREATMENT</span>
        </div>

        {/* 2. Condition Title & Icon */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/[0.16] border border-white/28 flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_14px_rgba(40,30,85,0.18)] backdrop-blur-md flex-shrink-0">
            <LiverIconSmall className="w-5.5 h-5.5 text-[#C7CBF3] drop-shadow-[0_2px_4px_rgba(40,30,85,0.25)]" />
          </div>
          <div>
            <h2 className="text-[22px] font-bold tracking-tight text-white leading-tight drop-shadow-[0_2px_4px_rgba(30,20,70,0.18)]">
              {episode.condition}
            </h2>
            <p className="text-xs text-white/85 font-normal mt-0.5">
              Treatment started on {episode.startDate}
            </p>
          </div>
        </div>

        {/* 3. Description */}
        <p className="text-xs text-white/85 leading-relaxed font-normal">
          Undergoing treatment for jaundice. Keep your follow-ups and complete medications as advised by your doctor.
        </p>

        {/* 4. Action Buttons (Stacked / Touch Friendly) */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            id="mobile-view-treatment-details-btn"
            onClick={onViewDetails}
            className="w-full h-11 rounded-xl bg-white text-[#4C499E] font-semibold text-xs shadow-[0_4px_14px_rgba(40,30,85,0.22),inset_0_1px_0_rgba(255,255,255,0.95)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Treatment Details</span>
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>

          <button
            id="mobile-view-treatment-prescriptions-btn"
            onClick={onViewPrescriptions}
            className="w-full h-11 rounded-xl bg-white/[0.14] active:scale-[0.98] text-white font-medium text-xs border border-white/26 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.28),0_4px_14px_rgba(40,30,85,0.14)] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-white/90" strokeWidth={1.8} />
            <span>View Prescriptions</span>
          </button>
        </div>

        {/* 5. Centered Liver Illustration (Dedicated Container, attractive, no text cover) */}
        <div
          aria-hidden="true"
          className="relative flex items-center justify-center my-2 py-3 pointer-events-none select-none"
        >
          {/* Luminous layered lavender halo */}
          <div
            className="absolute w-[220px] h-[220px] rounded-full pointer-events-none blur-2xl"
            style={{
              background:
                'radial-gradient(circle, rgba(183, 178, 244, 0.25) 0%, rgba(143, 136, 230, 0.16) 40%, rgba(92, 86, 184, 0.08) 65%, transparent 80%)',
              animation: 'treatmentAuraPulse 9s ease-in-out infinite',
            }}
          />
          {/* Concentric rings */}
          <svg
            className="absolute w-[220px] h-[220px] opacity-25"
            viewBox="0 0 220 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="110" cy="110" r="100" stroke="white" strokeWidth="1" strokeDasharray="3 6" />
            <circle cx="110" cy="110" r="70" stroke="#C7CBF3" strokeWidth="1" strokeOpacity="0.6" />
          </svg>

          {/* Scaled Liver image */}
          <div
            className="relative flex items-center justify-center"
            style={{
              maskImage:
                'linear-gradient(to bottom, transparent 0%, black 9%, black 91%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to bottom, transparent 0%, black 9%, black 91%, transparent 100%)',
            }}
          >
            <img
              src="/assets/liver.png?v=3"
              alt="3D Holographic Liver Anatomy"
              className="w-44 xs:w-48 max-w-[200px] h-auto max-h-[155px] object-contain"
              style={{
                filter:
                  'drop-shadow(0 12px 24px rgba(35, 25, 80, 0.40)) drop-shadow(0 0 26px rgba(183, 178, 244, 0.24)) drop-shadow(0 2px 8px rgba(183, 178, 244, 0.18))',
              }}
            />
          </div>
        </div>

        {/* 6. Statistics Panel (Clean, full width glassmorphic card) */}
        <div
          className="w-full rounded-[20px] p-4 space-y-3"
          style={{
            background: 'rgba(255, 255, 255, 0.10)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow:
              '0 8px 24px rgba(26, 20, 84, 0.16), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
          }}
        >
          {/* Stat Row 1: Last Visit */}
          <div className="flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{
                  background: 'rgba(183, 178, 244, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                <Calendar className="w-3.5 h-3.5 text-white" strokeWidth={1.9} />
              </div>
              <span className="text-xs font-medium text-white/80">Last Visit</span>
            </div>
            <span className="text-xs font-bold text-white">09 Sep 2026</span>
          </div>

          <div className="border-t border-white/12" />

          {/* Stat Row 2: Total Visits */}
          <div className="flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{
                  background: 'rgba(183, 178, 244, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                <Users className="w-3.5 h-3.5 text-white" strokeWidth={1.9} />
              </div>
              <span className="text-xs font-medium text-white/80">Total Visits</span>
            </div>
            <span className="text-xs font-bold text-white">{episode.visitCount}</span>
          </div>

          <div className="border-t border-white/12" />

          {/* Stat Row 3: Reports */}
          <div className="flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{
                  background: 'rgba(183, 178, 244, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                }}
              >
                <FileText className="w-3.5 h-3.5 text-white" strokeWidth={1.9} />
              </div>
              <span className="text-xs font-medium text-white/80">Reports</span>
            </div>
            <span className="text-xs font-bold text-white">{episode.reportCount}</span>
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TABLET & DESKTOP LAYOUT (md and above: UNTOUCHED & LOCKED)   */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 hidden md:flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-8">
        {/* ── ZONE 1: LEFT TREATMENT INFORMATION & ACTIONS ── */}
        <div className="flex-1 max-w-xl flex flex-col justify-between">
          {/* Floating Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.14] backdrop-blur-md text-[11px] font-bold tracking-wider uppercase text-white/95 mb-4 border border-white/28 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_12px_rgba(40,30,85,0.18)] self-start transition-transform duration-200 hover:scale-[1.02]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C7CBF3] opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C7CBF3] shadow-[0_0_8px_#C7CBF3]"></span>
            </span>
            <span>CURRENT TREATMENT</span>
          </div>

          {/* Condition Title & Icon Container */}
          <div className="flex items-center gap-3.5 mb-2.5">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.16] border border-white/28 flex items-center justify-center text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_14px_rgba(40,30,85,0.18)] backdrop-blur-md flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <LiverIconSmall id="condition-liver-icon" className="w-6 h-6 text-[#C7CBF3] drop-shadow-[0_2px_4px_rgba(40,30,85,0.25)]" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold tracking-tight text-white leading-tight drop-shadow-[0_2px_4px_rgba(30,20,70,0.18)]">
                {episode.condition}
              </h2>
              <p className="text-xs sm:text-sm text-white/85 font-normal mt-0.5">
                Treatment started on {episode.startDate}
              </p>
            </div>
          </div>

          {/* Clinical Description */}
          <p className="text-xs sm:text-[13.5px] text-white/85 leading-relaxed max-w-md lg:max-w-[430px] mb-6 font-normal">
            Undergoing treatment for jaundice. Keep your follow-ups and complete medications as
            advised by your doctor.
          </p>

          {/* ── MOBILE / TABLET ONLY: Centered Liver Illustration (< lg) ── */}
          <div
            aria-hidden="true"
            className="lg:hidden relative flex items-center justify-center my-3 py-2 pointer-events-none select-none"
          >
            {/* Luminous layered lavender halo (no harsh white) */}
            <div
              className="absolute w-[260px] h-[260px] rounded-full pointer-events-none blur-2xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(183, 178, 244, 0.22) 0%, rgba(143, 136, 230, 0.14) 40%, rgba(92, 86, 184, 0.08) 65%, transparent 80%)',
                animation: 'treatmentAuraPulse 9s ease-in-out infinite',
              }}
            />
            <div
              className="absolute w-[180px] h-[180px] rounded-full pointer-events-none blur-xl"
              style={{
                background:
                  'radial-gradient(circle, rgba(210, 205, 255, 0.18) 0%, rgba(183, 178, 244, 0.10) 50%, transparent 75%)',
              }}
            />

            {/* Faint concentric rings */}
            <svg
              className="absolute w-[280px] h-[280px] opacity-25"
              viewBox="0 0 280 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="140" cy="140" r="130" stroke="white" strokeWidth="1" strokeDasharray="3 6" />
              <circle cx="140" cy="140" r="95" stroke="#C7CBF3" strokeWidth="1" strokeOpacity="0.6" />
              <circle cx="140" cy="140" r="60" stroke="white" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.4" />
            </svg>

            {/* Liver image with soft feathered vertical boundaries */}
            <div
              className="relative flex items-center justify-center"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, black 9%, black 91%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, black 9%, black 91%, transparent 100%)',
              }}
            >
              <img
                src="/assets/liver.png?v=3"
                alt="3D Holographic Liver Anatomy"
                className="w-52 sm:w-60 max-w-[85vw] h-auto max-h-[190px] object-contain"
                style={{
                  filter:
                    'drop-shadow(0 14px 28px rgba(35, 25, 80, 0.40)) drop-shadow(0 0 30px rgba(183, 178, 244, 0.24)) drop-shadow(0 2px 8px rgba(183, 178, 244, 0.18))',
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Primary Button */}
            <button
              id="view-treatment-details-btn"
              onClick={onViewDetails}
              className="group/primary px-5 py-2.5 rounded-xl bg-white text-[#4C499E] font-semibold text-xs sm:text-sm shadow-[0_4px_14px_rgba(40,30,85,0.22),inset_0_1px_0_rgba(255,255,255,0.95)] hover:shadow-[0_8px_22px_rgba(40,30,85,0.30)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <span>View Treatment Details</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/primary:translate-x-1" strokeWidth={2} />
            </button>

            {/* Secondary Button */}
            <button
              id="view-treatment-prescriptions-btn"
              onClick={onViewPrescriptions}
              className="px-4.5 py-2.5 rounded-xl bg-white/[0.14] hover:bg-white/[0.22] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] text-white font-medium text-xs sm:text-sm border border-white/26 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.28),0_4px_14px_rgba(40,30,85,0.14)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_6px_18px_rgba(40,30,85,0.20),0_0_14px_rgba(199,203,243,0.18)] transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-white/90" strokeWidth={1.8} />
              <span>View Prescriptions</span>
            </button>
          </div>
        </div>

        {/* ── ZONE 3: FAR-RIGHT PREMIUM FLOATING GLASS STATISTICS PANEL ── */}
        <div className="flex flex-col items-start lg:items-end justify-between self-stretch lg:min-w-[215px] xl:min-w-[235px] pt-2 lg:pt-0 z-10">
          {/* Glassmorphism Floating Panel */}
          <div
            className="w-full sm:w-60 lg:w-[215px] xl:w-[235px] rounded-[22px] p-4.5 sm:p-5 space-y-3.5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(26,20,84,0.24),inset_0_1px_0_0_rgba(255,255,255,0.20)]"
            style={{
              background: 'rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              boxShadow:
                '0 10px 30px rgba(26, 20, 84, 0.18), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
            }}
          >
            {/* Stat Row 1: Last Visit */}
            <div className="flex items-center gap-3 text-left">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-transform duration-200 hover:scale-105"
                style={{
                  background: 'rgba(183, 178, 244, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow:
                    'inset 0 1px 2px rgba(255, 255, 255, 0.30), 0 2px 8px rgba(26, 20, 84, 0.12)',
                }}
              >
                <Calendar className="w-4 h-4 text-white" strokeWidth={1.9} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-white/70 leading-none mb-1">
                  Last Visit
                </div>
                <div className="text-[13px] sm:text-sm font-semibold text-white tracking-tight">
                  09 Sep 2026
                </div>
              </div>
            </div>

            {/* Subtle Translucent Separator */}
            <div
              className="border-t"
              style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}
            />

            {/* Stat Row 2: Total Visits */}
            <div className="flex items-center gap-3 text-left">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-transform duration-200 hover:scale-105"
                style={{
                  background: 'rgba(183, 178, 244, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow:
                    'inset 0 1px 2px rgba(255, 255, 255, 0.30), 0 2px 8px rgba(26, 20, 84, 0.12)',
                }}
              >
                <Users className="w-4 h-4 text-white" strokeWidth={1.9} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-white/70 leading-none mb-1">
                  Total Visits
                </div>
                <div className="text-[13px] sm:text-sm font-semibold text-white tracking-tight">
                  {episode.visitCount}
                </div>
              </div>
            </div>

            {/* Subtle Translucent Separator */}
            <div
              className="border-t"
              style={{ borderColor: 'rgba(255, 255, 255, 0.12)' }}
            />

            {/* Stat Row 3: Reports */}
            <div className="flex items-center gap-3 text-left">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 transition-transform duration-200 hover:scale-105"
                style={{
                  background: 'rgba(183, 178, 244, 0.18)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  boxShadow:
                    'inset 0 1px 2px rgba(255, 255, 255, 0.30), 0 2px 8px rgba(26, 20, 84, 0.12)',
                }}
              >
                <FileText className="w-4 h-4 text-white" strokeWidth={1.9} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider font-semibold text-white/70 leading-none mb-1">
                  Reports
                </div>
                <div className="text-[13px] sm:text-sm font-semibold text-white tracking-tight">
                  {episode.reportCount}
                </div>
              </div>
            </div>
          </div>

          {/* Script cursive handwritten accent */}
          <div className="hidden lg:block pt-3.5 pr-1 text-right select-none">
            <span
              className="text-white/70 hover:text-white/85 text-sm lg:text-[15px] italic tracking-wide drop-shadow-[0_1px_2px_rgba(30,20,70,0.15)] transition-colors"
              style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
            >
              Take care. Keep going ~
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


