import React, { useState } from 'react';
import { QuestionOption } from '../../../types/consultation';
import { Check, ArrowRight } from 'lucide-react';

interface MultiSelectQuestionProps {
  options: QuestionOption[];
  onConfirm: (selected: QuestionOption[]) => void;
  allowNotSure?: boolean;
}

export const MultiSelectQuestion: React.FC<MultiSelectQuestionProps> = ({
  options,
  onConfirm,
  allowNotSure = true,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleOption = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selected = options.filter((o) => selectedIds.includes(o.id));
    if (selected.length === 0) {
      onConfirm([{ id: 'none', label: 'None of these' }]);
    } else {
      onConfirm(selected);
    }
  };

  return (
    <div className="w-full max-w-2xl pl-12 sm:pl-14 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const isSelected = selectedIds.includes(opt.id);

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggleOption(opt.id)}
              className={`text-left p-3 rounded-2xl border transition-all duration-150 flex items-center justify-between gap-3 select-none ${
                isSelected
                  ? 'bg-[#EDEAFB] border-[#4C499E] text-[#242142] shadow-xs'
                  : 'bg-white hover:bg-[#FAF9FE] border-[#DFDCF2] text-[#252243]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {opt.emoji && (
                  <span className="text-lg flex-shrink-0" role="img" aria-hidden="true">
                    {opt.emoji}
                  </span>
                )}
                <span className="text-xs sm:text-sm font-semibold truncate">
                  {opt.label}
                </span>
              </div>

              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#4C499E] border-[#4C499E] text-white'
                    : 'border-[#CCC8E5] bg-white text-transparent'
                }`}
              >
                <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
              </div>
            </button>
          );
        })}
      </div>

      {/* Confirmation & Skip Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div>
          {allowNotSure && (
            <button
              type="button"
              onClick={() => onConfirm([{ id: 'none', label: 'None of these apply' }])}
              className="text-xs font-semibold text-[#767396] hover:text-[#4C499E] underline-offset-2 hover:underline"
            >
              None of these apply
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="px-5 py-2.5 rounded-xl bg-[#4C499E] hover:bg-[#3B3885] text-white font-bold text-xs shadow-md shadow-[#4C499E]/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <span>
            {selectedIds.length > 0
              ? `Continue with (${selectedIds.length}) selected`
              : 'None / Continue'}
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
