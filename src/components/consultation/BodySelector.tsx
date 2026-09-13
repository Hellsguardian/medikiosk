import React, { useState } from 'react';
import { BodyRegionId } from '../../types/consultation';
import { RotateCw, Check, X, HelpCircle, Columns } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  InteractiveBodyFigure,
  FRONT_REGIONS,
  BACK_REGIONS,
} from './InteractiveBodyFigure';

interface BodySelectorProps {
  selectedRegions: BodyRegionId[];
  onToggleRegion: (region: BodyRegionId, label?: string) => void;
  onClearSelection: () => void;
  isOtherSelected?: boolean;
  onToggleOther?: () => void;
  className?: string;
}

// Master region label lookup map
const REGION_LABELS: Record<string, string> = {
  head: 'Head',
  face: 'Face',
  neck: 'Neck',
  'shoulder-left': 'Left shoulder',
  'shoulder-right': 'Right shoulder',
  chest: 'Chest',
  abdomen: 'Abdomen',
  'upper-back': 'Upper back',
  'lower-back': 'Lower back',
  buttocks: 'Buttocks',
  pelvis: 'Pelvis',
  'arm-left': 'Left arm',
  'arm-right': 'Right arm',
  'hand-left': 'Left hand',
  'hand-right': 'Right hand',
  'thigh-left': 'Left thigh',
  'thigh-right': 'Right thigh',
  'knee-left': 'Left knee',
  'knee-right': 'Right knee',
  'leg-left': 'Left calf',
  'leg-right': 'Right calf',
  'foot-left': 'Left foot',
  'foot-right': 'Right foot',
  back: 'Back',
  other: 'Other / Systemic',
};

export const BodySelector: React.FC<BodySelectorProps> = ({
  selectedRegions,
  onToggleRegion,
  onClearSelection,
  isOtherSelected = false,
  onToggleOther,
  className = '',
}) => {
  // View mode: 'front' | 'back' | 'both'
  const [viewSide, setViewSide] = useState<'front' | 'back' | 'both'>('front');
  const [hoveredRegionId, setHoveredRegionId] = useState<BodyRegionId | null>(null);

  const getRegionLabel = (id: BodyRegionId): string => {
    return REGION_LABELS[id] || id;
  };

  const hasAnySelection = selectedRegions.length > 0 || isOtherSelected;

  // Primary active region label for display
  const primarySelectedId = selectedRegions[0];
  const primaryLabel = primarySelectedId ? getRegionLabel(primarySelectedId) : null;

  // Quick select pills list
  const allQuickRegions: { id: BodyRegionId; label: string }[] = [
    { id: 'head', label: 'Head' },
    { id: 'neck', label: 'Neck' },
    { id: 'chest', label: 'Chest' },
    { id: 'abdomen', label: 'Abdomen' },
    { id: 'shoulder-right', label: 'Right shoulder' },
    { id: 'shoulder-left', label: 'Left shoulder' },
    { id: 'arm-right', label: 'Right arm' },
    { id: 'arm-left', label: 'Left arm' },
    { id: 'hand-right', label: 'Right hand' },
    { id: 'hand-left', label: 'Left hand' },
    { id: 'upper-back', label: 'Upper back' },
    { id: 'lower-back', label: 'Lower back' },
    { id: 'buttocks', label: 'Buttocks' },
    { id: 'thigh-right', label: 'Right thigh' },
    { id: 'thigh-left', label: 'Left thigh' },
    { id: 'knee-right', label: 'Right knee' },
    { id: 'knee-left', label: 'Left knee' },
    { id: 'leg-right', label: 'Right calf' },
    { id: 'leg-left', label: 'Left calf' },
    { id: 'foot-right', label: 'Right foot' },
    { id: 'foot-left', label: 'Left foot' },
  ];

  return (
    <div
      id="body-selector-root"
      className={`relative flex flex-col items-center bg-gradient-to-b from-[#FFFFFF] via-[#FAF9FD] to-[#F5F2FC] border border-[#E2DFED] rounded-3xl p-4 sm:p-6 shadow-[0_4px_24px_rgba(76,73,158,0.06)] ${className}`}
    >
      {/* Top Header Controls Bar */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-[#EAE7F6]">
        <div className="flex items-center gap-2">
          <span className="text-[11px] md:text-xs font-bold uppercase tracking-wider text-[#4C499E] bg-[#EAE6FB] px-3.5 py-1 rounded-full border border-[#D5D0F4]">
            Interactive Human Body
          </span>
          <span className="text-xs text-[#7B7898] font-medium hidden sm:inline">
            {viewSide === 'front'
              ? 'Front (Anterior)'
              : viewSide === 'back'
              ? 'Back (Posterior)'
              : 'Both (Anterior & Posterior)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {hasAnySelection && (
            <button
              type="button"
              onClick={onClearSelection}
              className="text-xs font-semibold text-[#8B87A8] hover:text-[#C92240] hover:bg-[#FDF0F3] px-3 py-1.5 rounded-full border border-[#DFDCF2] transition-colors flex items-center gap-1 cursor-pointer min-h-[34px]"
              title="Clear all selections"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}

          {/* Desktop Dual (Side-by-side) Mode Toggle */}
          <button
            type="button"
            onClick={() => setViewSide((prev) => (prev === 'both' ? 'front' : 'both'))}
            className={`hidden lg:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer min-h-[34px] ${
              viewSide === 'both'
                ? 'bg-[#4C499E] text-white border-[#4C499E] shadow-2xs'
                : 'bg-white hover:bg-[#F2EFFB] text-[#555280] border-[#DFDCF5]'
            }`}
            title="Toggle side-by-side front and back view"
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{viewSide === 'both' ? 'Single View' : 'Both Views'}</span>
          </button>

          {/* Flip View (Front <-> Back) Switcher */}
          {viewSide !== 'both' && (
            <button
              type="button"
              onClick={() => setViewSide((prev) => (prev === 'front' ? 'back' : 'front'))}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#4C499E] hover:text-[#38357B] bg-white hover:bg-[#F2EFFB] px-3.5 py-1.5 rounded-full border border-[#DFDCF5] shadow-2xs transition-all active:scale-95 cursor-pointer min-h-[34px]"
              title="Flip view between front and back"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{viewSide === 'front' ? 'Show Back View' : 'Show Front View'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Instruction Heading (matching reference image) */}
      <div className="w-full flex flex-col items-center justify-center gap-2 mb-3">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#232142] text-center tracking-tight">
          Select the area that&apos;s bothering you.
        </h3>

        {/* Selected Pill Badge (matching Image 1 & 3: "✓ Head selected ×") */}
        {hasAnySelection && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-1"
          >
            {selectedRegions.map((regId) => (
              <button
                key={regId}
                type="button"
                onClick={() => onToggleRegion(regId, getRegionLabel(regId))}
                className="group flex items-center gap-2 bg-[#4C499E] hover:bg-[#3D3A88] text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm shadow-[#4C499E]/20 transition-all cursor-pointer min-h-[34px]"
                title="Click to deselect"
              >
                <Check className="w-3.5 h-3.5 text-[#E6E2FB]" />
                <span>{getRegionLabel(regId)} selected</span>
                <X className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity ml-0.5" />
              </button>
            ))}

            {isOtherSelected && (
              <button
                type="button"
                onClick={onToggleOther}
                className="group flex items-center gap-2 bg-[#645FA8] hover:bg-[#524E8F] text-white text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm transition-all cursor-pointer min-h-[34px]"
                title="Click to deselect"
              >
                <Check className="w-3.5 h-3.5 text-[#E6E2FB]" />
                <span>Other / General problem selected</span>
                <X className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity ml-0.5" />
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Anatomical Stage Canvas Area */}
      <div className="w-full flex items-center justify-center my-2 relative min-h-[460px] sm:min-h-[520px]">
        {/* SIDE-BY-SIDE DUAL VIEW (matching Image 1 & Image 3) */}
        {viewSide === 'both' ? (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10 items-center justify-items-center max-w-4xl mx-auto animate-in fade-in duration-300">
            {/* Front Figure */}
            <div className="w-full flex flex-col items-center">
              <InteractiveBodyFigure
                viewSide="front"
                selectedRegions={selectedRegions}
                hoveredRegionId={hoveredRegionId}
                onSelectRegion={(id, label) => onToggleRegion(id, label)}
                onHoverRegion={setHoveredRegionId}
                idPrefix="front-dual"
                className="max-w-[290px] sm:max-w-[310px]"
              />
              <span className="mt-2 text-xs font-semibold text-[#57538A] bg-[#EDE9FB] px-3.5 py-1 rounded-full border border-[#DDD7F5]">
                Front (Anterior)
              </span>
            </div>

            {/* Back Figure */}
            <div className="w-full flex flex-col items-center">
              <InteractiveBodyFigure
                viewSide="back"
                selectedRegions={selectedRegions}
                hoveredRegionId={hoveredRegionId}
                onSelectRegion={(id, label) => onToggleRegion(id, label)}
                onHoverRegion={setHoveredRegionId}
                idPrefix="back-dual"
                className="max-w-[290px] sm:max-w-[310px]"
              />
              <span className="mt-2 text-xs font-semibold text-[#57538A] bg-[#EDE9FB] px-3.5 py-1 rounded-full border border-[#DDD7F5]">
                Back (Posterior)
              </span>
            </div>
          </div>
        ) : (
          /* SINGLE FIGURE VIEW with Smooth Motion Flip Transition */
          <AnimatePresence mode="wait">
            <motion.div
              key={viewSide}
              initial={{ opacity: 0, scale: 0.97, y: 4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -4 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              className="w-full flex flex-col items-center justify-center"
            >
              <InteractiveBodyFigure
                viewSide={viewSide}
                selectedRegions={selectedRegions}
                hoveredRegionId={hoveredRegionId}
                onSelectRegion={(id, label) => onToggleRegion(id, label)}
                onHoverRegion={setHoveredRegionId}
                idPrefix={viewSide}
                className="max-w-[300px] sm:max-w-[330px]"
              />
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* Bottom Front / Back View Switcher Toggle (matching Image 1 & 2) */}
      <div className="flex items-center justify-center gap-3 my-3">
        <button
          type="button"
          onClick={() => setViewSide('front')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[36px] ${
            viewSide === 'front'
              ? 'bg-[#EDE9FB] text-[#4C499E] border border-[#D3CEF6] shadow-xs font-bold'
              : 'bg-white hover:bg-[#FAF9FE] text-[#7B779A] border border-[#E2DFED]'
          }`}
        >
          {/* Front silhouette icon */}
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
            <circle cx="8" cy="3.5" r="2.2" />
            <path d="M4.5 7.5 C4.5 6.5 5.5 6 8 6 C10.5 6 11.5 6.5 11.5 7.5 L11 11.5 L9.5 11.5 L9.5 15 L6.5 15 L6.5 11.5 L5 11.5 Z" />
          </svg>
          <span>Front (Anterior)</span>
        </button>

        <button
          type="button"
          onClick={() => setViewSide('back')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer min-h-[36px] ${
            viewSide === 'back'
              ? 'bg-[#EDE9FB] text-[#4C499E] border border-[#D3CEF6] shadow-xs font-bold'
              : 'bg-white hover:bg-[#FAF9FE] text-[#7B779A] border border-[#E2DFED]'
          }`}
        >
          {/* Back silhouette icon */}
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
            <circle cx="8" cy="3.5" r="2.2" />
            <path d="M5 7 C5 6.2 6 6 8 6 C10 6 11 6.2 11 7 L10.8 11.5 L9.5 11.5 L9.5 15 L6.5 15 L6.5 11.5 L5.2 11.5 Z" />
          </svg>
          <span>Back (Posterior)</span>
        </button>
      </div>


      {/* Quick Select & Other Option Toolbar (Accessible tap pills) */}
      <div className="w-full mt-4 pt-4 border-t border-[#E8E5F6] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#6D6993]">
            All areas (tap to select):
          </span>
          {onToggleOther && (
            <button
              type="button"
              id="body-other-option"
              onClick={onToggleOther}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                isOtherSelected
                  ? 'bg-[#4C499E] text-white border-[#4C499E] shadow-xs'
                  : 'bg-[#F6F5FD] hover:bg-[#ECE8FA] text-[#4C499E] border-[#DCD7F5]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Other (Fever, Skin, Fatigue, etc.)</span>
            </button>
          )}
        </div>

        {/* Rapid region pills for touch accessibility */}
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {allQuickRegions.map((reg) => {
            const isSelected = selectedRegions.includes(reg.id);
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => onToggleRegion(reg.id, reg.label)}
                className={`text-xs md:text-sm px-3 md:px-3.5 py-1.5 rounded-xl font-medium transition-all cursor-pointer min-h-[32px] md:min-h-[36px] flex items-center justify-center ${
                  isSelected
                    ? 'bg-[#4C499E] text-white font-bold shadow-2xs'
                    : 'bg-white hover:bg-[#F2EFFB] text-[#555280] border border-[#DDD9F2]'
                }`}
              >
                {isSelected ? `✓ ${reg.label}` : reg.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
