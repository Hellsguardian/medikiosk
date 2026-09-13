import React from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import { AIHelpAssistantRobot } from '../AIHelpCard';

interface AIMessageProps {
  message: string;
  timestamp?: string;
  isStreaming?: boolean;
}

export const AIMessage: React.FC<AIMessageProps> = ({
  message,
  timestamp,
  isStreaming = false,
}) => {
  return (
    <div className="flex items-start gap-3 sm:gap-3.5 max-w-2xl animate-in fade-in slide-in-from-left-2 duration-200">
      {/* Health Assistant Avatar */}
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#EDEBF9] to-[#DFDCF6] border border-[#D0CBF0] flex items-center justify-center flex-shrink-0 shadow-xs">
        <AIHelpAssistantRobot className="w-8 h-8" />
      </div>

      {/* Bubble Container */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#444093] tracking-tight">
            Health Assistant
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#7E7A9F] bg-[#F2F0FA] px-2 py-0.5 rounded-full border border-[#E3E0F4]">
            <Sparkles className="w-2.5 h-2.5 text-[#4C499E]" />
            Guided Questions
          </span>
          {timestamp && (
            <span className="text-[10px] text-[#9E9BB5]">{timestamp}</span>
          )}
        </div>

        <div className="bg-white border border-[#E3E0F3] rounded-2xl rounded-tl-sm px-4 sm:px-5 py-3.5 text-sm text-[#24213F] leading-relaxed shadow-[0_2px_8px_rgba(76,73,158,0.04)] font-normal">
          {message}
          {isStreaming && (
            <span className="inline-block w-1.5 h-4 ml-1 bg-[#4C499E] animate-pulse align-middle" />
          )}
        </div>
      </div>
    </div>
  );
};
