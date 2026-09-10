import React from 'react';

export const MediKioskLogo: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Soft glowing healthcare cross & leaf hybrid */}
    <path
      d="M24 4C14.0589 4 6 12.0589 6 22C6 31.9411 14.0589 40 24 40C33.9411 40 42 31.9411 42 22C42 12.0589 33.9411 4 24 4Z"
      fill="white"
      fillOpacity="0.12"
    />
    {/* Leaf dynamic organic path */}
    <path
      d="M38 12C38 12 28 10 18 20C10.5 27.5 12 36 12 36C12 36 20 38 28 30C36 22 38 12 38 12Z"
      fill="white"
    />
    <path
      d="M17 29C23 23 29 19 36 14"
      stroke="#4C499E"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const GlowingLiverIllustration: React.FC<{ className?: string }> = ({ className = 'w-72 h-56' }) => (
  <svg className={className} viewBox="0 0 340 260" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Primary ambient glowing backdrop matching muted indigo palette */}
      <radialGradient id="mkOrganAura" cx="48%" cy="46%" r="52%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.25" />
        <stop offset="40%" stopColor="#C7CBF3" stopOpacity="0.22" />
        <stop offset="75%" stopColor="#6D6AC6" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#4C499E" stopOpacity="0.0" />
      </radialGradient>

      {/* Main organ volumetric 3D shading */}
      <linearGradient id="mkLiverLobeMain" x1="40" y1="40" x2="300" y2="220" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
        <stop offset="35%" stopColor="#F0F1FA" stopOpacity="0.28" />
        <stop offset="70%" stopColor="#C7CBF3" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#5A57B3" stopOpacity="0.1" />
      </linearGradient>

      {/* Deep inner contour gradient */}
      <linearGradient id="mkLiverDepth" x1="160" y1="80" x2="260" y2="210" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#4C499E" stopOpacity="0.18" />
      </linearGradient>

      {/* Vascular tree glowing branch gradient */}
      <linearGradient id="mkVascularBranch" x1="150" y1="50" x2="220" y2="190" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
        <stop offset="50%" stopColor="#F0F1FA" stopOpacity="0.65" />
        <stop offset="100%" stopColor="#C7CBF3" stopOpacity="0.35" />
      </linearGradient>

      <filter id="mkGlowBlur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="12" />
      </filter>
    </defs>

    {/* Ambient diffuse glow */}
    <ellipse cx="170" cy="130" rx="125" ry="90" fill="url(#mkOrganAura)" filter="url(#mkGlowBlur)" />

    {/* Medical scan biometric decorative rings & grid */}
    <circle cx="170" cy="130" r="105" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="3 4" />
    <circle cx="170" cy="130" r="70" stroke="#FFFFFF" strokeOpacity="0.06" strokeWidth="1" />
    <line x1="60" y1="130" x2="280" y2="130" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="0.75" strokeDasharray="2 3" />
    <line x1="170" y1="25" x2="170" y2="235" stroke="#FFFFFF" strokeOpacity="0.05" strokeWidth="0.75" strokeDasharray="2 3" />

    {/* Anatomical Liver - Right & Left Lobes silhouette */}
    {/* Clean anatomical boundary: large curved right lobe, superior convex dome, tapering left lobe */}
    <path
      d="M78 104C62 120 54 148 64 176C76 208 118 214 168 206C218 198 284 178 296 142C306 112 284 86 244 80C210 75 190 84 162 76C134 68 96 86 78 104Z"
      fill="url(#mkLiverLobeMain)"
      stroke="#FFFFFF"
      strokeWidth="1.75"
      strokeOpacity="0.5"
    />

    {/* Under-surface lobe contour / Falciform division */}
    <path
      d="M102 118C124 130 148 140 162 165C172 182 170 205 170 205"
      stroke="url(#mkVascularBranch)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.6"
    />

    {/* Superior Vena Cava / Hepatic Vein entering top */}
    <path
      d="M166 48C166 48 165 72 164 96C163 124 168 152 172 178"
      stroke="#FFFFFF"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeOpacity="0.75"
    />
    <circle cx="166" cy="48" r="3.5" fill="#FFFFFF" fillOpacity="0.9" />

    {/* Portal vein branch branching right */}
    <path
      d="M164 102C188 95 220 102 248 94"
      stroke="url(#mkVascularBranch)"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    {/* Micro vascular sub-branches */}
    <path
      d="M214 98C228 88 244 86 256 84"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeOpacity="0.55"
      strokeLinecap="round"
    />
    <path
      d="M228 100C240 112 254 118 266 120"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeOpacity="0.5"
      strokeLinecap="round"
    />

    {/* Left hepatic vein branch */}
    <path
      d="M164 116C138 126 112 134 88 146"
      stroke="url(#mkVascularBranch)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M122 130C108 142 96 158 92 170"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeOpacity="0.45"
      strokeLinecap="round"
    />

    {/* Subtle Gallbladder contour hint on inferior visceral surface */}
    <path
      d="M192 198C194 212 206 216 214 210C220 204 216 192 210 190"
      fill="#FFFFFF"
      fillOpacity="0.12"
      stroke="#FFFFFF"
      strokeWidth="1.2"
      strokeOpacity="0.4"
      strokeLinecap="round"
    />

    {/* Translucent high-light curvature on dome */}
    <path
      d="M100 95C130 82 170 80 215 84C248 87 270 98 280 110"
      stroke="#FFFFFF"
      strokeWidth="1.5"
      strokeOpacity="0.4"
      strokeLinecap="round"
    />

    {/* Biometric pulse indicator points on liver vascular nodes */}
    <circle cx="214" cy="98" r="2.5" fill="#FFFFFF" fillOpacity="0.9" />
    <circle cx="214" cy="98" r="6" stroke="#FFFFFF" strokeOpacity="0.3" strokeWidth="0.8" />
    <circle cx="122" cy="130" r="2.5" fill="#FFFFFF" fillOpacity="0.85" />
    <circle cx="164" cy="102" r="3" fill="#FFFFFF" fillOpacity="0.95" />
    <circle cx="248" cy="94" r="2" fill="#E0DDE8" fillOpacity="0.9" />
    <circle cx="88" cy="146" r="2" fill="#E0DDE8" fillOpacity="0.9" />
  </svg>
);

export const SidebarWatermarkLeaves: React.FC<{ className?: string }> = ({ className = 'w-36 h-36' }) => (
  <svg className={className} viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10 140C10 140 30 70 90 60C140 50 150 10 150 10C150 10 145 75 95 110C50 140 10 140 10 140Z"
      fill="white"
      fillOpacity="0.08"
    />
    <path
      d="M20 145C45 105 85 85 140 45"
      stroke="white"
      strokeWidth="1.5"
      strokeOpacity="0.12"
      strokeLinecap="round"
    />
    <path
      d="M60 140C60 140 75 95 115 90C150 85 155 60 155 60C155 60 150 100 120 120C90 140 60 140 60 140Z"
      fill="white"
      fillOpacity="0.05"
    />
  </svg>
);

export const LiverIconSmall: React.FC<{ className?: string; id?: string }> = ({
  className = 'w-5 h-5',
  id,
}) => (
  <svg
    id={id}
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Superior Vena Cava / hepatic vessel entering superior groove */}
    <path
      d="M11 2.8V6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Anatomical liver body: high right convex dome, inferior gallbladder contour, tapering left lobe */}
    <path
      d="M11 6.2C7.5 6.2 4.2 7.8 2.8 10.5C1.8 12.5 2 15 3.5 16.8C5 18.5 8 18.8 11.2 18.2C11.8 19.8 13 20.8 14.5 20.2C15.5 19.8 15.6 18.5 15.2 17.5C18.2 16.2 21.2 13.8 21.8 11.8C22.2 10.2 20.8 8.2 17.8 7.2C15.2 6.4 12.8 6.2 11 6.2Z"
      fill="currentColor"
      fillOpacity="0.22"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Falciform ligament dividing right and left lobes */}
    <path
      d="M11 6.5C11.2 9.5 11 13.5 10.5 17.8"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeOpacity="0.8"
    />
    {/* Hepatic vascular branch into lobe */}
    <path
      d="M11 10.5C13.2 9.8 15.8 10.4 18 9.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeOpacity="0.75"
    />
    {/* Gallbladder subtle inner contour notch */}
    <path
      d="M11.6 18.3C12.2 19.4 13.2 19.8 14.2 19.4"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeOpacity="0.7"
    />
  </svg>
);
