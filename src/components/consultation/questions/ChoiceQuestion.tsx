import React from 'react';
import { QuestionOption } from '../../../types/consultation';
import { Check } from 'lucide-react';

interface ChoiceQuestionProps {
  options: QuestionOption[];
  onSelect: (option: QuestionOption) => void;
  allowNotSure?: boolean;
}

export const ChoiceQuestion: React.FC<ChoiceQuestionProps> = ({
  options,
  onSelect,
  allowNotSure = true,
}) => {
  // Check if this is a compact segmented choice like [ Mild ] [ Moderate ] [ Severe ]
  const isSegmented =
    options.length <= 4 &&
    options.every((o) => !o.emoji && (!o.description || o.description.length < 30));

  if (isSegmented) {
    return (
      <div className="w-full max-w-2xl pl-12 sm:pl-14 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="flex flex-wrap sm:flex-nowrap gap-2.5">
          {options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt)}
              className="flex-1 min-w-[100px] text-center px-4 py-3.5 rounded-2xl bg-white hover:bg-[#FAF9FE] border-2 border-[#DFDCF2] hover:border-[#4C499E] shadow-xs hover:shadow-md hover:shadow-[#4C499E]/10 transition-all duration-150 group active:scale-[0.98] cursor-pointer"
            >
              <span className="text-sm font-bold text-[#252243] group-hover:text-[#4C499E] transition-colors block">
                {opt.label}
              </span>
              {opt.description && (
                <span className="text-[11px] text-[#7A7796] block mt-0.5">
                  {opt.description}
                </span>
              )}
            </button>
          ))}
        </div>

        {allowNotSure && (
          <button
            type="button"
            onClick={() => onSelect({ id: 'not-sure', label: 'Not sure / Unsure' })}
            className="text-xs font-semibold text-[#767396] hover:text-[#4C499E] underline-offset-2 hover:underline px-2 py-1 transition-colors"
          >
            Not sure / Unsure
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl pl-12 sm:pl-14 space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt)}
            className="group text-left p-3.5 sm:p-4 rounded-2xl bg-white hover:bg-[#F9F8FD] border border-[#DFDCF2] hover:border-[#4C499E] shadow-xs hover:shadow-md hover:shadow-[#4C499E]/10 transition-all duration-150 flex items-center justify-between gap-3 active:scale-[0.99] cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {opt.emoji && (
                <span className="text-xl flex-shrink-0" role="img" aria-hidden="true">
                  {opt.emoji}
                </span>
              )}
              <div className="min-w-0">
                <span className="text-sm font-semibold text-[#252243] group-hover:text-[#4C499E] transition-colors block truncate">
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="text-xs text-[#7A7796] block truncate">
                    {opt.description}
                  </span>
                )}
              </div>
            </div>

            <div className="w-6 h-6 rounded-full border border-[#D5D2ED] group-hover:border-[#4C499E] group-hover:bg-[#EAE6F9] flex items-center justify-center text-transparent group-hover:text-[#4C499E] transition-all flex-shrink-0">
              <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
            </div>
          </button>
        ))}
      </div>

      {allowNotSure && (
        <button
          type="button"
          onClick={() => onSelect({ id: 'not-sure', label: 'Not sure / Hard to describe' })}
          className="text-xs font-semibold text-[#767396] hover:text-[#4C499E] underline-offset-2 hover:underline px-2 py-1 transition-colors"
        >
          Not sure / Hard to describe
        </button>
      )}
    </div>
  );
};
