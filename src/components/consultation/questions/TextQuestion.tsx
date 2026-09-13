import React, { useState } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

interface TextQuestionProps {
  placeholder?: string;
  suggestions?: string[];
  onSubmit: (text: string) => void;
  allowSkip?: boolean;
}

export const TextQuestion: React.FC<TextQuestionProps> = ({
  placeholder = 'Type your symptoms or any notes for the doctor here...',
  suggestions = [
    'No other symptoms to mention',
    'Took paracetamol with only mild temporary relief',
    'Started after high stress and lack of sleep',
    'Getting worse towards the evening',
  ],
  onSubmit,
  allowSkip = true,
}) => {
  const [text, setText] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) {
      if (allowSkip) onSubmit('None reported');
      return;
    }
    onSubmit(text.trim());
  };

  return (
    <div className="w-full max-w-2xl pl-12 sm:pl-14 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <form onSubmit={handleSubmit} className="space-y-2.5">
        <div className="relative rounded-2xl bg-white border border-[#DFDCF2] focus-within:border-[#4C499E] shadow-xs focus-within:shadow-md transition-all p-3">
          <textarea
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="w-full text-sm text-[#252243] placeholder-[#9490B2] resize-none focus:outline-none bg-transparent"
          />

          <div className="flex items-center justify-between pt-2 border-t border-[#F0EDFA]">
            <span className="text-[11px] text-[#9A97B8]">
              Press Enter or click Submit
            </span>

            <div className="flex items-center gap-2">
              {allowSkip && !text.trim() && (
                <button
                  type="button"
                  onClick={() => onSubmit('Nothing specific to add')}
                  className="text-xs font-semibold text-[#767396] hover:text-[#4C499E] px-2.5 py-1 rounded-lg"
                >
                  Skip this
                </button>
              )}
              <button
                type="submit"
                disabled={!text.trim() && !allowSkip}
                className="px-4 py-2 rounded-xl bg-[#4C499E] hover:bg-[#3B3885] disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-[#4C499E]/20 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>Submit</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Suggestion Chips */}
        {suggestions && suggestions.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-[#8B87A8] block">
              Quick suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setText(chip)}
                  className="text-xs text-[#524E82] bg-[#F1EFFB] hover:bg-[#E7E4F9] border border-[#DDD9F4] px-2.5 py-1 rounded-full transition-all text-left"
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
