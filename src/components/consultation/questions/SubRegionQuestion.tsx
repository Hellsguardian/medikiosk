import React, { useState } from 'react';
import { MapPin, Check } from 'lucide-react';
import { QuestionOption } from '../../../types/consultation';

interface SubRegionQuestionProps {
  options: QuestionOption[];
  onSelect: (option: QuestionOption) => void;
  allowNotSure?: boolean;
}

export const SubRegionQuestion: React.FC<SubRegionQuestionProps> = ({
  options,
  onSelect,
  allowNotSure = true,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (opt: QuestionOption) => {
    setSelectedId(opt.id);
    onSelect(opt);
  };

  return (
    <div className="w-full max-w-2xl pl-12 sm:pl-14 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="p-3 bg-[#FAF8FE] border border-[#DFDCF5] rounded-2xl">
        <div className="flex items-center gap-1.5 mb-2.5 px-1">
          <MapPin className="w-3.5 h-3.5 text-[#4C499E]" />
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A5689]">
            Select Specific Location
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {options.map((opt) => {
            const isSelected = selectedId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-[#4C499E] text-white border-[#4C499E] shadow-xs'
                    : 'bg-white hover:bg-[#F2EFFB] text-[#242142] border-[#E1DEFA] hover:border-[#4C499E]'
                }`}
              >
                <div className="min-w-0 pr-1">
                  <span className="text-xs sm:text-sm font-bold block truncate">
                    {opt.label}
                  </span>
                  {opt.description && (
                    <span
                      className={`text-[10px] block truncate mt-0.5 ${
                        isSelected ? 'text-[#E1DEFA]' : 'text-[#7D79A2]'
                      }`}
                    >
                      {opt.description}
                    </span>
                  )}
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#FFD4E8] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {allowNotSure && (
        <button
          type="button"
          onClick={() =>
            handleSelect({
              id: 'not_sure',
              label: 'Not sure / Diffuse discomfort',
            })
          }
          className="text-xs font-semibold text-[#736F9B] hover:text-[#4C499E] px-2 py-1 transition-colors cursor-pointer"
        >
          I'm not sure of the exact location
        </button>
      )}
    </div>
  );
};
