import React, { useState } from 'react';
import { Clock, Check } from 'lucide-react';

interface DurationOption {
  id: string;
  label: string;
  subtext?: string;
}

const DEFAULT_DURATION_OPTIONS: DurationOption[] = [
  { id: '1_day', label: '1 day', subtext: 'Started recently' },
  { id: '2_3_days', label: '2–3 days', subtext: 'Few days ago' },
  { id: '4_7_days', label: '4–7 days', subtext: 'About a week' },
  { id: 'more_than_a_week', label: 'More than a week', subtext: 'Persistent symptoms' },
];

interface DurationQuestionProps {
  options?: DurationOption[];
  onSelect: (val: string, displayLabel: string) => void;
  allowCustom?: boolean;
}

export const DurationQuestion: React.FC<DurationQuestionProps> = ({
  options = DEFAULT_DURATION_OPTIONS,
  onSelect,
  allowCustom = true,
}) => {
  const [customDays, setCustomDays] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const days = parseInt(customDays, 10);
    if (!isNaN(days) && days > 0) {
      onSelect(`${days}_days`, `${days} ${days === 1 ? 'day' : 'days'}`);
    }
  };

  return (
    <div className="w-full max-w-2xl pl-12 sm:pl-14 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id, opt.label)}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-white hover:bg-[#F3EFFC] border border-[#DFDCF5] hover:border-[#4C499E] shadow-2xs hover:shadow-sm text-center transition-all active:scale-95 cursor-pointer group"
          >
            <Clock className="w-4 h-4 text-[#7975A0] group-hover:text-[#4C499E] mb-1.5 transition-colors" />
            <span className="text-sm font-bold text-[#232142] group-hover:text-[#4C499E]">
              {opt.label}
            </span>
            {opt.subtext && (
              <span className="text-[10px] text-[#8683A3] mt-0.5">
                {opt.subtext}
              </span>
            )}
          </button>
        ))}
      </div>

      {allowCustom && (
        <div className="pt-1">
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="text-xs font-semibold text-[#686493] hover:text-[#4C499E] underline underline-offset-2 transition-colors cursor-pointer"
            >
              Specify exact number of days or weeks
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 pt-1">
              <input
                type="number"
                min="1"
                max="365"
                placeholder="Number of days..."
                value={customDays}
                onChange={(e) => setCustomDays(e.target.value)}
                className="w-44 text-xs font-semibold px-3 py-2 rounded-xl bg-white border border-[#4C499E] text-[#232142] focus:outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={!customDays}
                className="px-3.5 py-2 bg-[#4C499E] text-white text-xs font-bold rounded-xl hover:bg-[#3B3885] disabled:opacity-50 transition-all cursor-pointer"
              >
                Confirm
              </button>
              <button
                type="button"
                onClick={() => setShowCustomInput(false)}
                className="text-xs text-[#7B779A] hover:text-[#232142] px-2 py-1"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
