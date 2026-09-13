import React from 'react';
import { BodyRegionId } from '../../types/consultation';
import { motion, AnimatePresence } from 'motion/react';

export interface AnatomicalRegion {
  id: BodyRegionId;
  label: string;
  shortLabel?: string;
  cx: number;
  cy: number;
  // Label indicator anchor position (where the floating tag appears)
  labelX: number;
  labelY: number;
  labelSide: 'left' | 'right';
  path: string;
  // Optional secondary detail lines (e.g. muscle contour grooves)
  detailPaths?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// FRONT (ANTERIOR) REGION DEFINITIONS (320 x 600 ViewBox)
// ─────────────────────────────────────────────────────────────────────────────
export const FRONT_REGIONS: AnatomicalRegion[] = [
  {
    id: 'head',
    label: 'Head',
    shortLabel: 'Head',
    cx: 160,
    cy: 76,
    labelX: 206,
    labelY: 76,
    labelSide: 'right',
    // Cranium, temple, cheeks and chin contour
    path: 'M 160 40 C 178 40 188 52 188 74 C 188 94 178 108 160 114 C 142 108 132 94 132 74 C 132 52 142 40 160 40 Z',
    detailPaths: [
      'M 148 70 Q 160 74 172 70', // brow line
      'M 154 96 Q 160 100 166 96', // mouth/chin curve
    ],
  },
  {
    id: 'neck',
    label: 'Neck',
    shortLabel: 'Neck',
    cx: 160,
    cy: 126,
    labelX: 206,
    labelY: 126,
    labelSide: 'right',
    path: 'M 148 114 L 172 114 L 176 138 L 144 138 Z',
    detailPaths: ['M 154 122 L 154 136', 'M 166 122 L 166 136'],
  },
  {
    id: 'shoulder-right',
    label: 'Right shoulder',
    shortLabel: 'R. Shoulder',
    cx: 114,
    cy: 156,
    labelX: 68,
    labelY: 156,
    labelSide: 'left',
    path: 'M 144 138 L 126 142 L 96 154 C 92 166 94 180 102 192 L 122 178 L 136 156 Z',
    detailPaths: ['M 108 162 C 114 170 120 174 128 172'],
  },
  {
    id: 'shoulder-left',
    label: 'Left shoulder',
    shortLabel: 'L. Shoulder',
    cx: 206,
    cy: 156,
    labelX: 252,
    labelY: 156,
    labelSide: 'right',
    path: 'M 176 138 L 194 142 L 224 154 C 228 166 226 180 218 192 L 198 178 L 184 156 Z',
    detailPaths: ['M 212 162 C 206 170 200 174 192 172'],
  },
  {
    id: 'chest',
    label: 'Chest',
    shortLabel: 'Chest',
    cx: 160,
    cy: 174,
    labelX: 206,
    labelY: 174,
    labelSide: 'right',
    path: 'M 144 138 L 176 138 L 184 156 L 198 178 C 196 196 186 210 160 212 C 134 210 124 196 122 178 L 136 156 Z',
    detailPaths: [
      'M 160 144 L 160 210', // sternum center line
      'M 136 180 C 146 190 156 188 160 188', // right pectoral bottom curve
      'M 184 180 C 174 190 164 188 160 188', // left pectoral bottom curve
    ],
  },
  {
    id: 'abdomen',
    label: 'Abdomen',
    shortLabel: 'Abdomen',
    cx: 160,
    cy: 242,
    labelX: 206,
    labelY: 242,
    labelSide: 'right',
    path: 'M 124 212 C 144 210 176 210 196 212 C 196 238 194 258 190 274 L 130 274 C 126 258 124 238 124 212 Z',
    detailPaths: [
      'M 160 212 L 160 274', // linea alba
      'M 142 238 Q 160 242 178 238', // abdominal mid division
      'M 158 252 A 2 2 0 1 1 162 252', // navel
    ],
  },
  {
    id: 'pelvis',
    label: 'Pelvis',
    shortLabel: 'Pelvis',
    cx: 160,
    cy: 298,
    labelX: 206,
    labelY: 298,
    labelSide: 'right',
    path: 'M 130 274 L 190 274 C 192 292 186 312 174 324 L 160 326 L 146 324 C 134 312 128 292 130 274 Z',
    detailPaths: [
      'M 142 278 C 152 296 158 316 160 326',
      'M 178 278 C 168 296 162 316 160 326',
    ],
  },
  {
    id: 'arm-right',
    label: 'Right arm',
    shortLabel: 'R. Arm',
    cx: 94,
    cy: 254,
    labelX: 52,
    labelY: 254,
    labelSide: 'left',
    path: 'M 102 192 L 122 178 L 124 212 L 118 258 L 110 328 L 96 328 L 90 262 L 94 220 Z',
    detailPaths: ['M 98 258 Q 106 260 114 258'],
  },
  {
    id: 'arm-left',
    label: 'Left arm',
    shortLabel: 'L. Arm',
    cx: 226,
    cy: 254,
    labelX: 268,
    labelY: 254,
    labelSide: 'right',
    path: 'M 218 192 L 198 178 L 196 212 L 202 258 L 210 328 L 224 328 L 230 262 L 226 220 Z',
    detailPaths: ['M 206 258 Q 214 260 222 258'],
  },
  {
    id: 'hand-right',
    label: 'Right hand',
    shortLabel: 'R. Hand',
    cx: 82,
    cy: 358,
    labelX: 42,
    labelY: 358,
    labelSide: 'left',
    path: 'M 96 328 L 110 328 L 114 362 C 114 378 106 392 98 392 C 92 392 84 380 84 366 L 82 344 Z',
    detailPaths: ['M 92 360 L 92 384', 'M 98 358 L 98 386', 'M 104 360 L 104 382'],
  },
  {
    id: 'hand-left',
    label: 'Left hand',
    shortLabel: 'L. Hand',
    cx: 238,
    cy: 358,
    labelX: 278,
    labelY: 358,
    labelSide: 'right',
    path: 'M 210 328 L 224 328 L 238 344 L 236 366 C 236 380 228 392 222 392 C 214 392 206 378 206 362 Z',
    detailPaths: ['M 216 360 L 216 382', 'M 222 358 L 222 386', 'M 228 360 L 228 384'],
  },
  {
    id: 'thigh-right',
    label: 'Right thigh',
    shortLabel: 'R. Thigh',
    cx: 140,
    cy: 366,
    labelX: 92,
    labelY: 366,
    labelSide: 'left',
    path: 'M 130 274 L 146 324 L 152 358 L 150 412 L 126 412 L 120 354 C 118 318 124 290 130 274 Z',
    detailPaths: ['M 136 324 C 142 352 144 382 142 410'],
  },
  {
    id: 'thigh-left',
    label: 'Left thigh',
    shortLabel: 'L. Thigh',
    cx: 180,
    cy: 366,
    labelX: 228,
    labelY: 366,
    labelSide: 'right',
    path: 'M 190 274 L 174 324 L 168 358 L 170 412 L 194 412 L 200 354 C 202 318 196 290 190 274 Z',
    detailPaths: ['M 184 324 C 178 352 176 382 178 410'],
  },
  {
    id: 'knee-right',
    label: 'Right knee',
    shortLabel: 'R. Knee',
    cx: 138,
    cy: 430,
    labelX: 92,
    labelY: 430,
    labelSide: 'left',
    path: 'M 126 412 L 150 412 L 148 448 L 126 448 Z',
    detailPaths: ['M 132 430 A 6 7 0 1 1 144 430 A 6 7 0 1 1 132 430'],
  },
  {
    id: 'knee-left',
    label: 'Left knee',
    shortLabel: 'L. Knee',
    cx: 182,
    cy: 430,
    labelX: 228,
    labelY: 430,
    labelSide: 'right',
    path: 'M 170 412 L 194 412 L 194 448 L 172 448 Z',
    detailPaths: ['M 176 430 A 6 7 0 1 1 188 430 A 6 7 0 1 1 176 430'],
  },
  {
    id: 'leg-right',
    label: 'Right calf',
    shortLabel: 'R. Calf',
    cx: 136,
    cy: 490,
    labelX: 90,
    labelY: 490,
    labelSide: 'left',
    path: 'M 126 448 L 148 448 L 144 520 L 140 540 L 128 540 L 120 488 Z',
    detailPaths: ['M 136 454 L 134 526'],
  },
  {
    id: 'leg-left',
    label: 'Left calf',
    shortLabel: 'L. Calf',
    cx: 184,
    cy: 490,
    labelX: 230,
    labelY: 490,
    labelSide: 'right',
    path: 'M 172 448 L 194 448 L 200 488 L 192 540 L 180 540 L 176 520 Z',
    detailPaths: ['M 184 454 L 186 526'],
  },
  {
    id: 'foot-right',
    label: 'Right foot',
    shortLabel: 'R. Foot',
    cx: 132,
    cy: 556,
    labelX: 86,
    labelY: 556,
    labelSide: 'left',
    path: 'M 128 540 L 140 540 L 144 564 C 144 570 134 572 122 572 C 114 572 114 562 122 552 Z',
    detailPaths: ['M 126 564 L 140 564'],
  },
  {
    id: 'foot-left',
    label: 'Left foot',
    shortLabel: 'L. Foot',
    cx: 188,
    cy: 556,
    labelX: 234,
    labelY: 556,
    labelSide: 'right',
    path: 'M 180 540 L 192 540 L 198 552 C 206 562 206 572 198 572 C 186 572 176 570 176 564 Z',
    detailPaths: ['M 180 564 L 194 564'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// BACK (POSTERIOR) REGION DEFINITIONS (320 x 600 ViewBox)
// ─────────────────────────────────────────────────────────────────────────────
export const BACK_REGIONS: AnatomicalRegion[] = [
  {
    id: 'head',
    label: 'Head',
    shortLabel: 'Head',
    cx: 160,
    cy: 76,
    labelX: 206,
    labelY: 76,
    labelSide: 'right',
    path: 'M 160 40 C 178 40 188 52 188 74 C 188 94 178 108 160 114 C 142 108 132 94 132 74 C 132 52 142 40 160 40 Z',
    detailPaths: ['M 160 56 L 160 110', 'M 148 94 Q 160 98 172 94'],
  },
  {
    id: 'neck',
    label: 'Neck',
    shortLabel: 'Neck',
    cx: 160,
    cy: 126,
    labelX: 206,
    labelY: 126,
    labelSide: 'right',
    path: 'M 148 114 L 172 114 L 176 138 L 144 138 Z',
    detailPaths: ['M 160 114 L 160 138'],
  },
  {
    id: 'shoulder-left',
    label: 'Left shoulder',
    shortLabel: 'L. Shoulder',
    cx: 114,
    cy: 156,
    labelX: 68,
    labelY: 156,
    labelSide: 'left',
    path: 'M 144 138 L 126 142 L 96 154 C 92 166 94 180 102 192 L 122 178 L 136 156 Z',
    detailPaths: ['M 108 162 C 114 170 120 174 128 172'],
  },
  {
    id: 'shoulder-right',
    label: 'Right shoulder',
    shortLabel: 'R. Shoulder',
    cx: 206,
    cy: 156,
    labelX: 252,
    labelY: 156,
    labelSide: 'right',
    path: 'M 176 138 L 194 142 L 224 154 C 228 166 226 180 218 192 L 198 178 L 184 156 Z',
    detailPaths: ['M 212 162 C 206 170 200 174 192 172'],
  },
  {
    id: 'upper-back',
    label: 'Upper back',
    shortLabel: 'Upper Back',
    cx: 160,
    cy: 182,
    labelX: 206,
    labelY: 182,
    labelSide: 'right',
    path: 'M 144 138 L 176 138 L 184 156 L 198 178 C 196 198 192 220 188 234 L 132 234 C 128 220 124 198 122 178 L 136 156 Z',
    detailPaths: [
      'M 160 138 L 160 234', // spinal column
      'M 136 160 C 146 176 150 196 148 214', // left scapula curve
      'M 184 160 C 174 176 170 196 172 214', // right scapula curve
    ],
  },
  {
    id: 'lower-back',
    label: 'Lower back',
    shortLabel: 'Lower Back',
    cx: 160,
    cy: 254,
    labelX: 206,
    labelY: 254,
    labelSide: 'right',
    path: 'M 132 234 L 188 234 C 190 248 190 262 188 274 L 132 274 C 130 262 130 248 132 234 Z',
    detailPaths: [
      'M 160 234 L 160 274', // lumbar spine
      'M 142 248 L 142 270',
      'M 178 248 L 178 270',
    ],
  },
  {
    id: 'buttocks',
    label: 'Buttocks',
    shortLabel: 'Buttocks',
    cx: 160,
    cy: 300,
    labelX: 206,
    labelY: 300,
    labelSide: 'right',
    path: 'M 132 274 L 188 274 C 194 290 194 310 182 328 L 160 332 L 138 328 C 126 310 126 290 132 274 Z',
    detailPaths: [
      'M 160 274 L 160 332', // gluteal cleft
      'M 136 322 C 146 328 154 328 160 330', // left gluteal fold
      'M 184 322 C 174 328 166 328 160 330', // right gluteal fold
    ],
  },
  {
    id: 'arm-left',
    label: 'Left arm',
    shortLabel: 'L. Arm',
    cx: 94,
    cy: 254,
    labelX: 52,
    labelY: 254,
    labelSide: 'left',
    path: 'M 102 192 L 122 178 L 124 212 L 118 258 L 110 328 L 96 328 L 90 262 L 94 220 Z',
    detailPaths: ['M 98 258 Q 106 260 114 258'],
  },
  {
    id: 'arm-right',
    label: 'Right arm',
    shortLabel: 'R. Arm',
    cx: 226,
    cy: 254,
    labelX: 268,
    labelY: 254,
    labelSide: 'right',
    path: 'M 218 192 L 198 178 L 196 212 L 202 258 L 210 328 L 224 328 L 230 262 L 226 220 Z',
    detailPaths: ['M 206 258 Q 214 260 222 258'],
  },
  {
    id: 'hand-left',
    label: 'Left hand',
    shortLabel: 'L. Hand',
    cx: 82,
    cy: 358,
    labelX: 42,
    labelY: 358,
    labelSide: 'left',
    path: 'M 96 328 L 110 328 L 114 362 C 114 378 106 392 98 392 C 92 392 84 380 84 366 L 82 344 Z',
    detailPaths: ['M 92 360 L 92 384', 'M 98 358 L 98 386', 'M 104 360 L 104 382'],
  },
  {
    id: 'hand-right',
    label: 'Right hand',
    shortLabel: 'R. Hand',
    cx: 238,
    cy: 358,
    labelX: 278,
    labelY: 358,
    labelSide: 'right',
    path: 'M 210 328 L 224 328 L 238 344 L 236 366 C 236 380 228 392 222 392 C 214 392 206 378 206 362 Z',
    detailPaths: ['M 216 360 L 216 382', 'M 222 358 L 222 386', 'M 228 360 L 228 384'],
  },
  {
    id: 'thigh-left',
    label: 'Left thigh',
    shortLabel: 'L. Thigh',
    cx: 140,
    cy: 366,
    labelX: 92,
    labelY: 366,
    labelSide: 'left',
    path: 'M 132 274 L 138 328 L 152 358 L 150 412 L 126 412 L 120 354 C 118 318 124 290 132 274 Z',
    detailPaths: ['M 136 324 C 142 352 144 382 142 410'],
  },
  {
    id: 'thigh-right',
    label: 'Right thigh',
    shortLabel: 'R. Thigh',
    cx: 180,
    cy: 366,
    labelX: 228,
    labelY: 366,
    labelSide: 'right',
    path: 'M 188 274 L 182 328 L 168 358 L 170 412 L 194 412 L 200 354 C 202 318 196 290 188 274 Z',
    detailPaths: ['M 184 324 C 178 352 176 382 178 410'],
  },
  {
    id: 'knee-left',
    label: 'Left knee',
    shortLabel: 'L. Knee',
    cx: 138,
    cy: 430,
    labelX: 92,
    labelY: 430,
    labelSide: 'left',
    path: 'M 126 412 L 150 412 L 148 448 L 126 448 Z',
    detailPaths: ['M 132 430 Q 138 436 144 430'], // popliteal crease
  },
  {
    id: 'knee-right',
    label: 'Right knee',
    shortLabel: 'R. Knee',
    cx: 182,
    cy: 430,
    labelX: 228,
    labelY: 430,
    labelSide: 'right',
    path: 'M 170 412 L 194 412 L 194 448 L 172 448 Z',
    detailPaths: ['M 176 430 Q 182 436 188 430'], // popliteal crease
  },
  {
    id: 'leg-left',
    label: 'Left calf',
    shortLabel: 'L. Calf',
    cx: 136,
    cy: 490,
    labelX: 90,
    labelY: 490,
    labelSide: 'left',
    path: 'M 126 448 L 148 448 L 144 520 L 140 540 L 128 540 L 120 488 Z',
    detailPaths: [
      'M 128 474 C 134 492 136 512 134 532',
      'M 144 474 C 138 492 136 512 134 532',
    ],
  },
  {
    id: 'leg-right',
    label: 'Right calf',
    shortLabel: 'R. Calf',
    cx: 184,
    cy: 490,
    labelX: 230,
    labelY: 490,
    labelSide: 'right',
    path: 'M 172 448 L 194 448 L 200 488 L 192 540 L 180 540 L 176 520 Z',
    detailPaths: [
      'M 192 474 C 186 492 184 512 186 532',
      'M 176 474 C 182 492 184 512 186 532',
    ],
  },
  {
    id: 'foot-left',
    label: 'Left foot',
    shortLabel: 'L. Foot',
    cx: 132,
    cy: 556,
    labelX: 86,
    labelY: 556,
    labelSide: 'left',
    path: 'M 128 540 L 140 540 L 142 566 C 142 572 134 572 124 572 C 118 572 118 564 124 554 Z',
    detailPaths: ['M 134 540 L 134 564'], // Achilles tendon
  },
  {
    id: 'foot-right',
    label: 'Right foot',
    shortLabel: 'R. Foot',
    cx: 188,
    cy: 556,
    labelX: 234,
    labelY: 556,
    labelSide: 'right',
    path: 'M 180 540 L 192 540 L 196 554 C 202 564 202 572 196 572 C 186 572 178 572 178 566 Z',
    detailPaths: ['M 186 540 L 186 564'], // Achilles tendon
  },
];

interface InteractiveBodyFigureProps {
  viewSide: 'front' | 'back';
  selectedRegions: BodyRegionId[];
  hoveredRegionId: BodyRegionId | null;
  onSelectRegion: (id: BodyRegionId, label: string) => void;
  onHoverRegion: (id: BodyRegionId | null) => void;
  className?: string;
  idPrefix?: string;
}

export const InteractiveBodyFigure: React.FC<InteractiveBodyFigureProps> = ({
  viewSide,
  selectedRegions,
  hoveredRegionId,
  onSelectRegion,
  onHoverRegion,
  className = '',
  idPrefix = 'figure',
}) => {
  const regions = viewSide === 'front' ? FRONT_REGIONS : BACK_REGIONS;

  // Selected regions in this view
  const activeSelected = regions.filter((r) => selectedRegions.includes(r.id));

  return (
    <div className={`relative flex items-center justify-center select-none w-full max-w-[320px] mx-auto ${className}`}>
      <svg
        viewBox="0 0 320 600"
        className="w-full h-auto drop-shadow-sm overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Base Anatomical Porcelain/Lavender Body Gradient */}
          <linearGradient id={`${idPrefix}-baseGrad`} x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F7F5FE" />
            <stop offset="100%" stopColor="#EDE9F9" />
          </linearGradient>

          {/* Hover State: Delicate Luminous Lavender */}
          <linearGradient id={`${idPrefix}-hoverGrad`} x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#F5F2FE" />
            <stop offset="50%" stopColor="#EAE5FB" />
            <stop offset="100%" stopColor="#DDD6F8" />
          </linearGradient>

          {/* Active Selected State: Vivid MediKiosk Royal Violet */}
          <linearGradient id={`${idPrefix}-selectedGrad`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#786CF6" />
            <stop offset="50%" stopColor="#5B4BF2" />
            <stop offset="100%" stopColor="#4535DB" />
          </linearGradient>

          {/* Active Glow Filter with MediKiosk Purple Aura (matching reference image) */}
          <filter id={`${idPrefix}-activeGlow`} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#5B4BF2" floodOpacity="0.55" />
            <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#8B7EFA" floodOpacity="0.3" />
          </filter>

          {/* Subtle Hover Glow Filter */}
          <filter id={`${idPrefix}-hoverGlow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="3.5" floodColor="#8B7EFA" floodOpacity="0.38" />
          </filter>

          {/* Soft Ground Contact Shadow */}
          <radialGradient id={`${idPrefix}-groundShadow`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4CDEE" stopOpacity="0.75" />
            <stop offset="60%" stopColor="#E4DFF6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FAF9FE" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Ground Shadow Under Feet */}
        <ellipse
          cx="160"
          cy="578"
          rx="82"
          ry="11"
          fill={`url(#${idPrefix}-groundShadow)`}
          pointerEvents="none"
        />

        {/* Anatomical Regions */}
        <g id={`${idPrefix}-regions-layer`}>
          {regions.map((region) => {
            const isSelected = selectedRegions.includes(region.id);
            const isHovered = hoveredRegionId === region.id;

            return (
              <g
                key={region.id}
                id={`${idPrefix}-region-${region.id}`}
                tabIndex={0}
                role="button"
                aria-label={`${region.label}${isSelected ? ', selected' : ''}`}
                aria-pressed={isSelected}
                onClick={() => onSelectRegion(region.id, region.label)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectRegion(region.id, region.label);
                  }
                }}
                onMouseEnter={() => onHoverRegion(region.id)}
                onMouseLeave={() => onHoverRegion(null)}
                className="cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#5B4BF2] transition-transform duration-150"
                style={{
                  transformOrigin: `${region.cx}px ${region.cy}px`,
                  transform: isHovered && !isSelected ? 'scale(1.025)' : 'scale(1)',
                }}
              >
                {/* Main Region Body Path */}
                <path
                  d={region.path}
                  fill={
                    isSelected
                      ? `url(#${idPrefix}-selectedGrad)`
                      : isHovered
                      ? `url(#${idPrefix}-hoverGrad)`
                      : `url(#${idPrefix}-baseGrad)`
                  }
                  stroke={
                    isSelected
                      ? '#FFFFFF'
                      : isHovered
                      ? '#6B5DF0'
                      : '#C4BDE8'
                  }
                  strokeWidth={isSelected ? 1.8 : isHovered ? 1.6 : 1.1}
                  strokeLinejoin="round"
                  filter={
                    isSelected
                      ? `url(#${idPrefix}-activeGlow)`
                      : isHovered
                      ? `url(#${idPrefix}-hoverGlow)`
                      : undefined
                  }
                  className="transition-colors duration-150"
                />

                {/* Internal Muscle / Joint Contour Highlights */}
                {region.detailPaths &&
                  region.detailPaths.map((dStr, idx) => (
                    <path
                      key={idx}
                      d={dStr}
                      fill="none"
                      stroke={
                        isSelected
                          ? '#DCD7FB'
                          : isHovered
                          ? '#8E82F4'
                          : '#C8C1EC'
                      }
                      strokeWidth={isSelected ? 1.1 : 0.85}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      opacity={isSelected ? 0.8 : 0.65}
                      pointerEvents="none"
                    />
                  ))}

                {/* Animated Anatomical Node on Selected Region */}
                {isSelected && (
                  <g pointerEvents="none">
                    <circle
                      cx={region.cx}
                      cy={region.cy}
                      r="7"
                      fill="#8B7EFA"
                      opacity="0.3"
                      className="animate-ping"
                    />
                    <circle
                      cx={region.cx}
                      cy={region.cy}
                      r="4.5"
                      fill="#FFFFFF"
                      stroke="#4535DB"
                      strokeWidth="2"
                    />
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Contextual Floating Labels for Selected Regions */}
        {/* Rendered only after selection, exactly as requested by user and reference image */}
        <g id={`${idPrefix}-floating-labels`} pointerEvents="none">
          {activeSelected.map((region) => {
            const isRight = region.labelSide === 'right';
            const startX = region.cx;
            const startY = region.cy;
            const targetX = region.labelX;
            const targetY = region.labelY;

            // Anchor pill box dimensions
            const pillWidth = Math.max(68, region.shortLabel ? region.shortLabel.length * 8 + 26 : 72);
            const pillHeight = 26;
            const pillX = isRight ? targetX + 12 : targetX - pillWidth - 12;
            const pillY = targetY - pillHeight / 2;

            return (
              <g key={`label-${region.id}`} className="animate-in fade-in zoom-in-95 duration-200">
                {/* Delicate Pointer Line from Region to Floating Tag */}
                <path
                  d={`M ${startX} ${startY} Q ${(startX + targetX) / 2} ${startY} ${targetX} ${targetY} L ${
                    isRight ? pillX : pillX + pillWidth
                  } ${targetY}`}
                  fill="none"
                  stroke="#5B4BF2"
                  strokeWidth="1.2"
                  strokeDasharray="2.5 1.5"
                  opacity="0.8"
                />

                {/* Small indicator dot at anchor */}
                <circle cx={targetX} cy={targetY} r="2.5" fill="#5B4BF2" />

                {/* Floating Label Pill Badge (matching Image 1 & 3) */}
                <g filter={`url(#${idPrefix}-hoverGlow)`}>
                  <rect
                    x={pillX}
                    y={pillY}
                    width={pillWidth}
                    height={pillHeight}
                    rx="13"
                    fill="#4C499E"
                    stroke="#FFFFFF"
                    strokeWidth="1.2"
                  />
                  <text
                    x={pillX + pillWidth / 2}
                    y={pillY + 16.5}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11.5"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    letterSpacing="-0.01em"
                  >
                    {region.shortLabel || region.label}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
