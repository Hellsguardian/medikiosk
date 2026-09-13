import React, { useState } from 'react';
import { Calendar, Check } from 'lucide-react';

interface DateQuestionProps {
  onConfirm: (dateStr: string, displayLabel: string) => void;
  minDate?: string;
  maxDate?: string;
}

export const DateQuestion: React.FC<DateQuestionProps> = ({
  onConfirm,
  minDate,
  maxDate,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDate) {
      const d = new Date(selectedDate);
      const formatted = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      onConfirm(selectedDate, formatted);
    }
  };

  return (
    <div className="w-full max-w-md pl-12 sm:pl-14 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <form
        onSubmit={handleSubmit}
        className="p-4 bg-white rounded-2xl border border-[#DFDCF5] shadow-xs space-y-3"
      >
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#696594]">
          <Calendar className="w-4 h-4 text-[#4C499E]" />
          <span>Select Approximate Date</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            max={maxDate || today}
            min={minDate}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="flex-1 text-sm font-semibold px-3 py-2 bg-[#FAF8FE] border border-[#DDD9F2] rounded-xl text-[#232142] focus:outline-none focus:border-[#4C499E]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#4C499E] hover:bg-[#3A3785] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1"
          >
            <span>Confirm</span>
            <Check className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
};
