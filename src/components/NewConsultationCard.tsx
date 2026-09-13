import React from 'react';
import { Stethoscope, Plus, ArrowRight, Sparkles } from 'lucide-react';

interface NewConsultationCardProps {
  onStartConsultation: () => void;
}

export const NewConsultationCard: React.FC<NewConsultationCardProps> = ({
  onStartConsultation,
}) => {
  return (
    <div
      id="new-consultation-hero-card"
      className="group relative overflow-hidden rounded-[22px] sm:rounded-[24px] px-5 sm:px-6 lg:px-8 border border-[#E85A9F]/[0.18] shadow-[0_10px_30px_rgba(76,73,158,0.08),inset_0_1px_1px_rgba(255,255,255,0.90)] transition-all duration-300 min-h-[146px] sm:h-[156px] lg:h-[162px] flex items-center"
      style={{
        background:
          'linear-gradient(105deg, #FFF8FC 0%, #FDECF5 38%, #F8E3F2 65%, #EEEAF9 100%)',
      }}
    >
      {/* ──────────────────────────────────────────────────────────── */}
      {/* SCOPED AMBIENT FLOATING & PULSE ANIMATION KEYFRAMES */}
      {/* ──────────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes medikioskNurseFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        @keyframes medikioskGlowPulse {
          0%, 100% {
            opacity: 0.85;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.06);
          }
        }
        @keyframes medikioskOrbitalDrift {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(6deg);
          }
        }
      `}</style>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* LAYER 1: MULTI-ZONE ATMOSPHERIC LIGHTING & GRADIENTS */}
      {/* Continuous, soft transitions — NO hard vertical lines */}
      {/* ──────────────────────────────────────────────────────────── */}
      {/* Top subtle sheen highlight line */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent pointer-events-none z-20"
      />

      {/* LEFT: Soft pale pink ambient illumination near consultation text */}
      <div
        aria-hidden="true"
        className="absolute -top-12 -left-12 w-64 h-64 rounded-full bg-radial from-[#E85A9F]/10 via-[#FDEAF4]/30 to-transparent blur-3xl pointer-events-none z-0"
      />

      {/* CENTER-RIGHT ATMOSPHERIC CENTER: Richer pink + lavender glow behind nurse */}
      {/* Centered along nurse visual axis (~60-65%) */}
      <div
        aria-hidden="true"
        className="absolute left-[59%] lg:left-[62%] xl:left-[64%] 2xl:left-[65%] -translate-x-1/2 bottom-[-24px] lg:bottom-[-30px] w-[340px] sm:w-[420px] lg:w-[480px] h-[340px] sm:h-[420px] lg:h-[480px] rounded-full pointer-events-none z-0 motion-safe:animate-[medikioskGlowPulse_9s_ease-in-out_infinite]"
        style={{
          background:
            'radial-gradient(circle, rgba(232, 90, 159, 0.18) 0%, rgba(247, 200, 223, 0.22) 28%, rgba(216, 211, 243, 0.16) 52%, transparent 75%)',
          filter: 'blur(32px)',
        }}
      />

      {/* Secondary diffused lavender bloom extending toward the right CTA */}
      <div
        aria-hidden="true"
        className="absolute -right-8 -bottom-10 w-72 h-72 rounded-full bg-radial from-[#D8D3F3]/25 via-[#E8E4FA]/15 to-transparent blur-3xl pointer-events-none z-0"
      />

      {/* Subtle soft white overhead diffuser */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/4 w-80 h-36 rounded-full bg-radial from-white/70 via-white/20 to-transparent blur-2xl pointer-events-none z-0"
      />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* LAYER 2: CONTINUOUS OUTWARD-FLOWING DECORATIVE MOTIFS */}
      {/* Elements flow organically from LEFT -> CENTER -> RIGHT */}
      {/* ──────────────────────────────────────────────────────────── */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-0 overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Continuous undulating harmonic line flowing across entire card behind nurse */}
        <path
          d="M-30 84 C 140 32, 280 120, 520 62 C 760 14, 930 94, 1180 38"
          fill="none"
          stroke="#E85A9F"
          strokeWidth="1.2"
          strokeOpacity="0.10"
          strokeDasharray="4 8"
        />
        <path
          d="M-20 118 C 180 138, 360 44, 620 92 C 840 140, 990 64, 1200 108"
          fill="none"
          stroke="#7773C9"
          strokeWidth="1"
          strokeOpacity="0.08"
          strokeDasharray="3 6"
        />

        {/* ── LEFT ZONE: Subtle particles and plus signs ── */}
        <circle cx="16%" cy="86%" r="3" fill="#E85A9F" fillOpacity="0.16" />
        <circle cx="28%" cy="24%" r="3.5" fill="#7773C9" fillOpacity="0.14" />
        <circle cx="36%" cy="80%" r="2.5" fill="#E85A9F" fillOpacity="0.18" />
        <g fill="#E85A9F" fillOpacity="0.12">
          <path d="M210 32 h5 v-5 h2.5 v5 h5 v2.5 h-5 v5 h-2.5 v-5 h-5 z" />
          <path d="M340 76 h4 v-4 h2 v4 h4 v2 h-4 v4 h-2 v-4 h-4 z" />
        </g>

        {/* ── CENTER-RIGHT ZONE: Floral petals, sparkles, orbital rings around nurse ── */}
        {/* Soft translucent circular accents */}
        <circle cx="58%" cy="18%" r="30" fill="rgba(255,255,255,0.42)" stroke="rgba(232,90,159,0.12)" strokeWidth="1" />
        <circle cx="70%" cy="24%" r="22" fill="#FDEAF4" fillOpacity="0.45" stroke="rgba(143,136,230,0.12)" strokeWidth="1" />
        <circle cx="56%" cy="82%" r="24" fill="#E8E4FA" fillOpacity="0.30" />
        <circle cx="74%" cy="78%" r="20" fill="#E85A9F" fillOpacity="0.08" />

        {/* Floating micro-dots & medical cross accents around nurse */}
        <circle cx="54%" cy="28%" r="3.5" fill="#E85A9F" fillOpacity="0.22" />
        <circle cx="57%" cy="74%" r="4" fill="#C7CBF3" fillOpacity="0.32" />
        <circle cx="68%" cy="16%" r="3.5" fill="#E85A9F" fillOpacity="0.25" />
        <circle cx="72%" cy="70%" r="3" fill="#7773C9" fillOpacity="0.22" />

        <g fill="#E85A9F" fillOpacity="0.14">
          <path d="M660 36 h5 v-5 h2.5 v5 h5 v2.5 h-5 v5 h-2.5 v-5 h-5 z" />
        </g>
        <g fill="#7773C9" fillOpacity="0.12">
          <path d="M545 68 h4 v-4 h2 v4 h4 v2 h-4 v4 h-2 v-4 h-4 z" />
        </g>

        {/* Center sparkles (radiant 4-point stars) */}
        <path
          d="M685 28 Q685 33 690 33 Q685 33 685 38 Q685 33 680 33 Q685 33 685 28 Z"
          fill="#E85A9F"
          fillOpacity="0.24"
        />
        <path
          d="M570 56 Q570 60 574 60 Q570 60 570 64 Q570 60 566 60 Q570 60 570 56 Z"
          fill="#7773C9"
          fillOpacity="0.20"
        />
        <path
          d="M710 68 Q710 72 714 72 Q710 72 710 76 Q710 72 706 72 Q710 72 710 68 Z"
          fill="#E85A9F"
          fillOpacity="0.20"
        />

        {/* Center medical plus crosses */}
        <g fill="#E85A9F" fillOpacity="0.15">
          <path d="M470 20 h6 v-6 h3 v6 h6 v3 h-6 v6 h-3 v-6 h-6 z" />
          <path d="M690 22 h5 v-5 h2.5 v5 h5 v2.5 h-5 v5 h-2.5 v-5 h-5 z" />
        </g>
        <g fill="#7773C9" fillOpacity="0.14">
          <path d="M660 74 h5 v-5 h2.5 v5 h5 v2.5 h-5 v5 h-2.5 v-5 h-5 z" />
          <path d="M455 80 h4 v-4 h2 v4 h4 v2 h-4 v4 h-2 v-4 h-4 z" />
        </g>

        {/* ── RIGHT ZONE: Gentle circles and particles around CTA ── */}
        <circle cx="82%" cy="26%" r="3.5" fill="#E85A9F" fillOpacity="0.18" />
        <circle cx="86%" cy="76%" r="3" fill="#7773C9" fillOpacity="0.22" />
        <circle cx="91%" cy="22%" r="18" fill="rgba(255,255,255,0.30)" stroke="rgba(216,211,243,0.15)" strokeWidth="1" />
        <circle cx="94%" cy="65%" r="2.5" fill="#E85A9F" fillOpacity="0.16" />
        <g fill="#7773C9" fillOpacity="0.12">
          <path d="M830 18 h5 v-5 h2.5 v5 h5 v2.5 h-5 v5 h-2.5 v-5 h-5 z" />
        </g>
      </svg>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* ATMOSPHERIC NURSE ENVIRONMENT (MIDGROUND LAYER z-[1])        */}
      {/* Positioned in the center-right visual zone between text & CTA */}
      {/* Anchored to the BOTTOM of the card, emerging organically    */}
      {/* NO RECTANGULAR CONTAINER — completely integrated into card  */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="hidden md:flex absolute left-[59%] lg:left-[62%] xl:left-[64%] 2xl:left-[65%] bottom-[-10px] sm:bottom-[-12px] lg:bottom-[-14px] -translate-x-1/2 items-end justify-center pointer-events-none select-none z-[1]"
      >
        {/* Layer 1: Grounding aura at card base — soft pink & lavender glow directly beneath/behind lower figure */}
        <div
          className="absolute -bottom-4 w-60 sm:w-72 lg:w-80 h-28 rounded-full pointer-events-none -z-10 blur-xl opacity-75"
          style={{
            background:
              'radial-gradient(ellipse at 50% 85%, rgba(232, 90, 159, 0.35) 0%, rgba(248, 194, 228, 0.24) 40%, rgba(120, 114, 205, 0.14) 65%, transparent 85%)',
          }}
        />

        {/* Layer 2: Core luminous glow directly behind the figure to boost separation & contrast */}
        <div
          className="absolute -bottom-2 w-64 sm:w-72 lg:w-80 h-60 sm:h-64 rounded-full pointer-events-none -z-10 blur-2xl opacity-80 motion-safe:animate-[medikioskGlowPulse_8s_ease-in-out_infinite]"
          style={{
            background:
              'radial-gradient(ellipse at 50% 55%, rgba(255, 255, 255, 0.80) 0%, rgba(254, 240, 248, 0.50) 40%, rgba(235, 230, 250, 0.25) 65%, transparent 80%)',
          }}
        />

        {/* Layer 3: Deeper lavender ambient halo behind the hair for crisp silhouette contrast */}
        <div
          className="absolute top-0 w-48 sm:w-56 h-36 rounded-full pointer-events-none -z-10 blur-xl opacity-60"
          style={{
            background:
              'radial-gradient(ellipse at 50% 35%, rgba(120, 114, 205, 0.26) 0%, rgba(150, 144, 226, 0.14) 50%, transparent 75%)',
          }}
        />

        {/* Layer 4: Concentric orbital guide rings and medical accents (mirroring liver's orbital aesthetics) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 motion-safe:animate-[medikioskOrbitalDrift_14s_ease-in-out_infinite]">
          <svg
            className="w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 translate-y-3"
            viewBox="0 0 280 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="140" cy="140" r="112" stroke="#7773C9" strokeWidth="1" strokeDasharray="3 7" strokeOpacity="0.12" />
            <circle cx="140" cy="140" r="84" stroke="#E85A9F" strokeWidth="1" strokeOpacity="0.10" />
            <circle cx="140" cy="140" r="56" stroke="white" strokeWidth="1.2" strokeOpacity="0.45" />
            {/* Micro decorative accents around the orbit */}
            <circle cx="218" cy="80" r="2" fill="#E85A9F" fillOpacity="0.35" />
            <circle cx="62" cy="195" r="2.5" fill="#7773C9" fillOpacity="0.30" />
            <circle cx="224" cy="170" r="1.5" fill="white" fillOpacity="0.70" />
          </svg>
        </div>

        {/* Layer 5: Nurse illustration anchored to bottom edge, emerging from card */}
        {/* HEAD = FULLY VISIBLE with 22-26px breathing room; crisp, saturated & sharp */}
        {/* BOTTOM = Gently emerges beyond bottom boundary, cleanly clipped by card overflow */}
        <div
          className="relative w-[225px] sm:w-[245px] lg:w-[270px] xl:w-[285px] h-[162px] sm:h-[168px] lg:h-[174px] xl:h-[178px] flex items-end justify-center pointer-events-none motion-safe:animate-[medikioskNurseFloat_8s_ease-in-out_infinite]"
          style={{
            maskImage:
              'linear-gradient(to bottom, black 0%, black 88%, transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, black 0%, black 88%, transparent 100%)',
          }}
        >
          {/* Inner wrapper: provides controlled horizontal edge feathering (9% each side) to prevent box edges */}
          <div
            className="w-full h-full flex items-end justify-center pointer-events-none"
            style={{
              maskImage:
                'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent 0%, black 9%, black 91%, transparent 100%)',
            }}
          >
            <img
              src="/assets/nurse2.png"
              alt="MediKiosk Healthcare Assistant"
              className="w-full h-full object-cover object-[53.4%_top] select-none pointer-events-none transition-transform duration-500 will-change-transform group-hover:scale-105"
              style={{
                filter:
                  'drop-shadow(0 10px 22px rgba(76, 73, 158, 0.14)) drop-shadow(0 2px 6px rgba(232, 90, 159, 0.10))',
              }}
            />
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* MOBILE SPECIFIC LAYOUT (< 768px): STRICT ISOLATED HIERARCHY */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full flex flex-col gap-3 py-4 md:hidden">
        {/* 1. Stethoscope Icon & Eyebrow */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/75 border border-[#E85A9F]/15 text-[#E85A9F] flex items-center justify-center shadow-xs flex-shrink-0">
            <Stethoscope className="w-5 h-5 text-[#E85A9F]" strokeWidth={1.9} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold tracking-wider uppercase text-[#E85A9F]">
                HAVE A NEW HEALTH CONCERN?
              </span>
              <Sparkles className="w-3 h-3 text-[#E85A9F]/70" />
            </div>
            <h3 className="text-base font-bold text-[#2E2C3A] tracking-tight leading-snug">
              Start a New Consultation
            </h3>
          </div>
        </div>

        {/* 2. Description */}
        <p className="text-xs text-[#777895] leading-relaxed">
          Tell us what&apos;s bothering you and we&apos;ll help prepare your consultation.
        </p>

        {/* 3. Example Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 text-xs text-[#777895] border border-[#E85A9F]/12 shadow-2xs self-start">
          <span className="font-semibold text-[#E85A9F] text-[10.5px]">Example:</span>
          <span className="italic text-[11px] text-[#2E2C3A]/90">
            &ldquo;I&apos;ve had abdominal pain for 4 days.&rdquo;
          </span>
        </div>

        {/* 4. Dedicated Centered Nurse Illustration */}
        <div
          aria-hidden="true"
          className="relative flex items-center justify-center my-1 py-1 pointer-events-none select-none"
        >
          <div
            className="absolute w-36 h-36 rounded-full blur-xl pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(232, 90, 159, 0.18) 0%, rgba(204, 118, 172, 0.10) 55%, transparent 75%)',
            }}
          />
          <div
            className="relative h-32 w-32 flex items-center justify-center"
            style={{
              maskImage:
                'radial-gradient(circle at 50% 48%, black 50%, rgba(0,0,0,0.85) 75%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(circle at 50% 48%, black 50%, rgba(0,0,0,0.85) 75%, transparent 100%)',
            }}
          >
            <img
              src="/assets/nurse2.png"
              alt="Healthcare Assistant"
              className="h-full w-full object-cover object-[53%_top]"
            />
          </div>
        </div>

        {/* 5. Full Width Action CTA Button */}
        <button
          id="mobile-start-new-consultation-btn"
          onClick={onStartConsultation}
          className="w-full h-11 rounded-xl text-white font-semibold text-xs shadow-[0_6px_18px_rgba(232,90,159,0.24)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, #E85A9F 0%, #D84E93 100%)',
          }}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Start New Consultation</span>
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* TABLET & DESKTOP FOREGROUND CONTENT (UNTOUCHED & LOCKED)     */}
      {/* ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full h-full hidden md:flex md:items-center justify-between gap-4 py-3.5 sm:py-0 pointer-events-auto">
        {/* ── LEFT: CONSULTATION INFORMATION ── */}
        <div className="flex items-center gap-4 sm:gap-5 max-w-[330px] sm:max-w-[370px] lg:max-w-[410px] xl:max-w-[450px] z-10">
          {/* Stethoscope Icon in Soft Pink Container */}
          <div className="relative flex-shrink-0">
            <div
              aria-hidden="true"
              className="absolute -inset-1 rounded-2xl bg-[#E85A9F]/14 blur-md pointer-events-none animate-[pulse_6s_ease-in-out_infinite]"
            />
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/60 border border-[#E85A9F]/15 text-[#E85A9F] flex items-center justify-center shadow-[0_4px_12px_rgba(232,90,159,0.12)] transition-transform duration-300 group-hover:scale-105">
              <Stethoscope className="w-5 h-5 sm:w-5.5 sm:h-5.5 drop-shadow-[0_1px_2px_rgba(232,90,159,0.2)]" strokeWidth={1.9} />
            </div>
          </div>

          {/* Typography & Example Pill */}
          <div className="flex-1 min-w-0">
            {/* Eyebrow Label */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="block text-[10.5px] sm:text-[11px] font-bold tracking-wider uppercase text-[#E85A9F]">
                HAVE A NEW HEALTH CONCERN?
              </span>
              <Sparkles className="w-3 h-3 text-[#E85A9F]/70" />
            </div>

            {/* Main Headline */}
            <h3 className="text-base sm:text-lg lg:text-[20px] font-bold text-[#2E2C3A] tracking-tight leading-snug">
              Start a New Consultation
            </h3>

            {/* Supporting Description */}
            <p className="text-xs sm:text-[13px] text-[#777895] mt-0.5 leading-tight">
              Tell us what&apos;s bothering you and we&apos;ll help prepare your consultation.
            </p>

            {/* Compact Example Pill */}
            <div className="mt-1.5 flex items-center flex-wrap gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/75 hover:bg-white/95 text-xs text-[#777895] border border-[#E85A9F]/12 shadow-[0_2px_6px_rgba(204,118,172,0.06)] backdrop-blur-xs transition-colors">
                <span className="font-semibold text-[#E85A9F] text-[10.5px]">Example:</span>
                <span className="italic text-[11px] text-[#2E2C3A]/90">
                  &ldquo;I&apos;ve had abdominal pain for 4 days.&rdquo;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: BALANCED CTA BUTTON ── */}
        <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-4 flex-shrink-0 z-10">
          {/* Mobile-only compact nurse accent with feathered edge (no hard box) */}
          <div
            aria-hidden="true"
            className="md:hidden flex items-center justify-center relative flex-shrink-0 pointer-events-none select-none h-16 w-16"
            style={{
              maskImage:
                'radial-gradient(circle at 53% 48%, black 48%, rgba(0,0,0,0.85) 68%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(circle at 53% 48%, black 48%, rgba(0,0,0,0.85) 68%, transparent 100%)',
            }}
          >
            <img
              src="/assets/nurse2.png"
              alt="Healthcare Assistant"
              className="h-full w-full object-cover object-[53.4%_top]"
            />
          </div>

          {/* Primary Action CTA Button */}
          <button
            id="start-new-consultation-btn"
            onClick={onStartConsultation}
            className="group/btn relative inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-white font-semibold text-xs sm:text-[13.5px] shadow-[0_8px_20px_rgba(232,90,159,0.22)] hover:shadow-[0_12px_24px_rgba(232,90,159,0.32)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex-shrink-0 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #E85A9F 0%, #D84E93 100%)',
            }}
          >
            <Plus className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:rotate-90" strokeWidth={2.5} />
            <span className="whitespace-nowrap">Start New Consultation</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};



