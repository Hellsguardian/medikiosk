import React from 'react';
import { User, Check } from 'lucide-react';

interface UserResponseProps {
  displayText: string;
  subDetail?: string;
  timestamp?: string;
  onEdit?: () => void;
}

export const UserResponse: React.FC<UserResponseProps> = ({
  displayText,
  subDetail,
  timestamp,
  onEdit,
}) => {
  return (
    <div className="flex items-start justify-end gap-2.5 sm:gap-3 max-w-xl ml-auto animate-in fade-in slide-in-from-right-2 duration-200">
      <div className="flex flex-col items-end space-y-1 text-right">
        <div className="flex items-center gap-2">
          {timestamp && (
            <span className="text-[10px] text-[#9E9BB5]">{timestamp}</span>
          )}
          <span className="text-xs font-semibold text-[#66628A]">You</span>
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="text-[10px] font-semibold text-[#4C499E] hover:underline"
            >
              Change
            </button>
          )}
        </div>

        <div className="bg-gradient-to-r from-[#4C499E] to-[#5955B0] text-white rounded-2xl rounded-tr-sm px-4 sm:px-5 py-3 text-sm font-medium leading-relaxed shadow-sm flex flex-col items-end">
          <div className="flex items-center gap-1.5">
            <span>{displayText}</span>
            <Check className="w-3.5 h-3.5 text-[#FFC4E1] flex-shrink-0" />
          </div>
          {subDetail && (
            <span className="text-[11px] text-[#E0DCF8] font-normal mt-0.5">
              {subDetail}
            </span>
          )}
        </div>
      </div>

      <div className="w-8 h-8 rounded-full bg-[#E5E2F7] text-[#4C499E] flex items-center justify-center font-bold text-xs flex-shrink-0 border border-[#D0CCE8]">
        <User className="w-4 h-4" />
      </div>
    </div>
  );
};
