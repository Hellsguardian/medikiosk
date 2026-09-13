import React from 'react';
import { Check, X, HelpCircle } from 'lucide-react';

interface YesNoQuestionProps {
  onSelect: (answer: boolean | null, label: string) => void;
  allowNotSure?: boolean;
}

export const YesNoQuestion: React.FC<YesNoQuestionProps> = ({
  onSelect,
  allowNotSure = true,
}) => {
  return (
    <div className="w-full max-w-2xl pl-12 sm:pl-14 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Yes Button */}
        <button
          type="button"
          onClick={() => onSelect(true, 'Yes')}
          className="group p-4 rounded-2xl bg-white hover:bg-[#F2FBF5] border-2 border-[#DFDCF2] hover:border-[#2BA055] text-left shadow-xs hover:shadow-md transition-all duration-150 flex items-center justify-between active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#EAF7EE] text-[#2BA055] flex items-center justify-center font-bold">
              <Check className="w-4 h-4" strokeWidth={3} />
            </div>
            <div>
              <span className="text-base font-bold text-[#232142] group-hover:text-[#2BA055] block">
                Yes
              </span>
              <span className="text-xs text-[#7B7797]">I have experienced this</span>
            </div>
          </div>
        </button>

        {/* No Button */}
        <button
          type="button"
          onClick={() => onSelect(false, 'No')}
          className="group p-4 rounded-2xl bg-white hover:bg-[#FAF9FE] border-2 border-[#DFDCF2] hover:border-[#4C499E] text-left shadow-xs hover:shadow-md transition-all duration-150 flex items-center justify-between active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F0EEFA] text-[#4C499E] flex items-center justify-center font-bold">
              <X className="w-4 h-4" strokeWidth={3} />
            </div>
            <div>
              <span className="text-base font-bold text-[#232142] group-hover:text-[#4C499E] block">
                No
              </span>
              <span className="text-xs text-[#7B7797]">First time experiencing</span>
            </div>
          </div>
        </button>
      </div>

      {allowNotSure && (
        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => onSelect(null, 'Not sure / Can’t recall')}
            className="text-xs font-semibold text-[#767396] hover:text-[#4C499E] flex items-center gap-1.5 px-2 py-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Not sure / Can’t recall</span>
          </button>
        </div>
      )}
    </div>
  );
};
