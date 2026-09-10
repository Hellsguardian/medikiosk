import React from 'react';

interface AIHelpCardProps {
  onClick: () => void;
}

/**
 * Friendly Vector AI Health Assistant Robot
 * Styled in the soft blue / lavender / periwinkle palette matching the reference specification:
 * Colors: #5656D8, #7373E8, #A5A5FF, soft lavender glows and cheerful curved visor.
 */
export const AIHelpAssistantRobot: React.FC<{ className?: string }> = ({
  className = 'w-11 h-11',
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Ambient shadow underneath floating bot */}
        <radialGradient id="mkRefBotShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5656D8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#5656D8" stopOpacity="0" />
        </radialGradient>

        {/* Head gradient: crisp white to soft highlight lavender */}
        <linearGradient id="mkRefBotHeadGrad" x1="12" y1="8" x2="42" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F3F3FF" />
          <stop offset="100%" stopColor="#E5E6FC" />
        </linearGradient>

        {/* Visor gradient: deep indigo */}
        <linearGradient id="mkRefBotVisorGrad" x1="16" y1="18" x2="38" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#222258" />
          <stop offset="100%" stopColor="#32327A" />
        </linearGradient>

        {/* Ear pod & accent gradient: #7373E8 to #5656D8 */}
        <linearGradient id="mkRefBotEarGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7373E8" />
          <stop offset="100%" stopColor="#5656D8" />
        </linearGradient>
      </defs>

      {/* Floating ground shadow */}
      <ellipse cx="27" cy="49" rx="14" ry="3" fill="url(#mkRefBotShadow)" />

      {/* Antenna stem & glowing bulb */}
      <path d="M27 12V6.5" stroke="#7373E8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="27" cy="5" r="3" fill="#7373E8" />
      <circle cx="27" cy="5" r="1.2" fill="#FFFFFF" />

      {/* Ear pods */}
      <rect x="7" y="20" width="4" height="9" rx="2" fill="url(#mkRefBotEarGrad)" />
      <rect x="43" y="20" width="4" height="9" rx="2" fill="url(#mkRefBotEarGrad)" />

      {/* Main Head / Face capsule */}
      <rect
        x="10"
        y="12"
        width="34"
        height="26"
        rx="12"
        fill="url(#mkRefBotHeadGrad)"
        stroke="#FFFFFF"
        strokeWidth="1.5"
      />

      {/* Visor */}
      <rect
        x="14.5"
        y="17"
        width="25"
        height="15"
        rx="7"
        fill="url(#mkRefBotVisorGrad)"
      />

      {/* Visor specular sheen highlight */}
      <path
        d="M17 18.5C19 17.5 24 17.5 27 18C23 18.5 19 19.5 17 20V18.5Z"
        fill="#FFFFFF"
        fillOpacity="0.35"
      />

      {/* Cheerful curved glowing eyes (Arcs) */}
      <path
        d="M19.5 24.5C19.5 23 20.8 21.8 22.5 21.8C24.2 21.8 25.5 23 25.5 24.5"
        stroke="#59E2EF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M28.5 24.5C28.5 23 29.8 21.8 31.5 21.8C33.2 21.8 34.5 23 34.5 24.5"
        stroke="#59E2EF"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Rosy blush dots */}
      <circle cx="18" cy="27.5" r="1.2" fill="#A5A5FF" fillOpacity="0.9" />
      <circle cx="36" cy="27.5" r="1.2" fill="#A5A5FF" fillOpacity="0.9" />

      {/* Floating torso / collar with medical mark */}
      <path
        d="M19 39C19 39 21 44 27 44C33 44 35 39 35 39"
        stroke="#A5A5FF"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M27 40.5V42.5M26 41.5H28"
        stroke="#5656D8"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const AIHelpCard: React.FC<AIHelpCardProps> = ({ onClick }) => {
  return (
    <button
      id="medikiosk-ai-help-btn"
      onClick={onClick}
      type="button"
      className="group relative flex items-center justify-between gap-3 sm:gap-3.5 w-full sm:w-[325px] lg:w-[335px] max-w-[350px] h-[78px] sm:h-[84px] px-4 sm:px-4.5 py-3 sm:py-3.5 rounded-[22px] cursor-pointer text-left select-none flex-shrink-0 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5656D8]/40 hover:-translate-y-[1.5px] active:translate-y-0"
      style={{
        background: 'linear-gradient(135deg, #E9E9FF 0%, #E3E3FC 50%, #DDDDF9 100%)',
        border: '1px solid rgba(90, 90, 190, 0.08)',
        boxShadow:
          '0 8px 24px rgba(75, 75, 170, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
      }}
      title="Ask questions about your health records"
      aria-label="Your personal health assistant for a healthier tomorrow. Click to talk to MediKiosk"
    >
      {/* LEFT: Friendly AI Robot Illustration in soft glowing container */}
      <div className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-2xl bg-white/75 border border-white/90 shadow-[0_2px_8px_rgba(86,86,216,0.09)] group-hover:scale-[1.03] transition-transform duration-200">
        <AIHelpAssistantRobot className="w-10 h-10" />
      </div>

      {/* CENTER: Large decorative quotation mark */}
      <div className="flex-shrink-0 flex items-center justify-center select-none" aria-hidden="true">
        <span className="text-[26px] sm:text-[28px] font-serif font-black text-[#8585E8] leading-none opacity-90 -mt-1">
          “
        </span>
      </div>

      {/* RIGHT: Two-line message */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <p className="text-[13px] sm:text-[13.5px] font-semibold text-[#3030B8] leading-[1.35] tracking-tight group-hover:text-[#2525A0] transition-colors">
          Your personal health assistant
        </p>
        <p className="text-[12px] sm:text-[12.5px] font-medium text-[#4545C7] leading-[1.35] tracking-tight">
          for a healthier tomorrow.
        </p>
      </div>
    </button>
  );
};
