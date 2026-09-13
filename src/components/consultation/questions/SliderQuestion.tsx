import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';

interface SliderQuestionProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  minLabel?: string;
  maxLabel?: string;
  unit?: string;
  onConfirm: (val: number, displayLabel: string) => void;
  isPainScale?: boolean;
}

export const SliderQuestion: React.FC<SliderQuestionProps> = ({
  min = 1,
  max = 10,
  step = 1,
  defaultValue = 5,
  minLabel = 'Mild',
  maxLabel = 'Severe',
  unit = '',
  onConfirm,
  isPainScale = false,
}) => {
  const [value, setValue] = useState<number>(defaultValue);

  const getQualitativeLabel = (val: number): { text: string; colorClass: string } => {
    if (isPainScale) {
      if (val === 0) return { text: 'No Pain (0/10)', colorClass: 'bg-[#EBF7EE] text-[#1B8039]' };
      if (val <= 3) return { text: `Mild (${val}/10) - Noticeable but tolerable`, colorClass: 'bg-[#EBF7EE] text-[#1B8039]' };
      if (val <= 6) return { text: `Moderate (${val}/10) - Interferes with tasks`, colorClass: 'bg-[#FFF6E6] text-[#B87000]' };
      if (val <= 8) return { text: `Severe (${val}/10) - Very difficult to function`, colorClass: 'bg-[#FDF0E9] text-[#CF4618]' };
      return { text: `Very Severe (${val}/10) - Debilitating / Critical`, colorClass: 'bg-[#FEECEF] text-[#C91A39]' };
    }

    // Duration scale (days)
    if (unit === 'days') {
      if (val === 1) return { text: 'Just started today (1 day)', colorClass: 'bg-[#EEECFA] text-[#4C499E]' };
      if (val <= 3) return { text: `${val} days (Recent onset)`, colorClass: 'bg-[#EEECFA] text-[#4C499E]' };
      if (val <= 7) return { text: `${val} days (About a week)`, colorClass: 'bg-[#EEECFA] text-[#4C499E]' };
      if (val <= 14) return { text: `${val} days (1 - 2 weeks)`, colorClass: 'bg-[#EEECFA] text-[#4C499E]' };
      return { text: '14+ days (Sub-acute / Persistent)', colorClass: 'bg-[#EEECFA] text-[#4C499E]' };
    }

    return { text: `${val} ${unit}`, colorClass: 'bg-[#EEECFA] text-[#4C499E]' };
  };

  const qualitative = getQualitativeLabel(value);

  const handleConfirm = () => {
    onConfirm(value, qualitative.text);
  };

  return (
    <div className="w-full max-w-2xl pl-12 sm:pl-14 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DFDCF2] shadow-xs space-y-4">
        {/* Dynamic qualitative pill */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#7E7B9E]">
            Selected Level:
          </span>
          <span
            className={`text-xs sm:text-sm font-bold px-3 py-1 rounded-full transition-all duration-150 ${qualitative.colorClass}`}
          >
            {qualitative.text}
          </span>
        </div>

        {/* Custom Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="w-full h-2.5 bg-[#E7E4F7] rounded-lg appearance-none cursor-pointer accent-[#4C499E] transition-all"
          />

          <div className="flex justify-between items-center text-[11px] font-semibold text-[#8C88A8] px-1">
            <span>
              {min} {minLabel && `(${minLabel})`}
            </span>
            <span>
              {max}
              {max === 10 && unit === 'days' ? '+' : ''} {maxLabel && `(${maxLabel})`}
            </span>
          </div>
        </div>

        {/* Quick selection chips for rapid thumb interaction */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#F0EDF9]">
          {(isPainScale
            ? [
                { v: 2, label: 'Mild (2)' },
                { v: 5, label: 'Moderate (5)' },
                { v: 7, label: 'Severe (7)' },
                { v: 9, label: 'Intense (9)' },
              ]
            : [
                { v: 1, label: '1 Day' },
                { v: 3, label: '3 Days' },
                { v: 7, label: '1 Week' },
                { v: 10, label: '10+ Days' },
              ]
          ).map((preset) => (
            <button
              key={preset.v}
              type="button"
              onClick={() => setValue(preset.v)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                value === preset.v
                  ? 'bg-[#4C499E] text-white border-[#4C499E]'
                  : 'bg-[#F9F8FD] hover:bg-[#EFEBF9] text-[#565384] border-[#E1DEFB]'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleConfirm}
          className="px-6 py-2.5 rounded-xl bg-[#4C499E] hover:bg-[#3B3885] text-white font-bold text-xs shadow-md shadow-[#4C499E]/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <span>Confirm & Continue</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
