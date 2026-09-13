import React, { useState, useRef, useEffect } from 'react';
import {
  BodyRegionId,
  ConsultationQuestion,
  ConversationTurn,
  EditablePatientInfo,
} from '../../../types/consultation';
import {
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Send,
  RotateCcw,
} from 'lucide-react';
import { BodySelector } from '../BodySelector';
import { AIMessage } from '../AIMessage';
import { UserResponse } from '../UserResponse';
import { QuestionRenderer } from '../QuestionRenderer';
import { SafetyAlertCard } from '../SafetyAlertCard';
import { AIHelpAssistantRobot } from '../../AIHelpCard';
import {
  getNextQuestionForSession,
  getPrimaryRegionLabel,
} from '../questionEngine';

interface Stage3BodyAndQuestionsProps {
  patientInfo: EditablePatientInfo;
  selectedRegions: BodyRegionId[];
  isOtherSelected: boolean;
  initialDescription: string;
  turns: ConversationTurn[];
  answers: Record<string, any>;
  onToggleRegion: (region: BodyRegionId) => void;
  onClearRegions: () => void;
  onToggleOther: () => void;
  onUpdateDescription: (desc: string) => void;
  onUpdateTurns: (turns: ConversationTurn[]) => void;
  onUpdateAnswers: (answers: Record<string, any>) => void;
  onBackToHealthDetails: () => void;
  onCompleteStage3: (
    finalAnswers: Record<string, any>,
    finalTurns: ConversationTurn[]
  ) => void;
}

export const Stage3BodyAndQuestions: React.FC<Stage3BodyAndQuestionsProps> = ({
  patientInfo,
  selectedRegions,
  isOtherSelected,
  initialDescription,
  turns,
  answers,
  onToggleRegion,
  onClearRegions,
  onToggleOther,
  onUpdateDescription,
  onUpdateTurns,
  onUpdateAnswers,
  onBackToHealthDetails,
  onCompleteStage3,
}) => {
  // Sub-stage: 'body_selection' vs 'ai_questioning'
  const [subStage, setSubStage] = useState<'body_selection' | 'ai_questioning'>(() => {
    return turns.length > 0 ? 'ai_questioning' : 'body_selection';
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  // Active AI Questioning State
  const [currentQuestion, setCurrentQuestion] = useState<ConsultationQuestion | null>(null);
  const [currentAIMessage, setCurrentAIMessage] = useState<string>('');
  const [emergencyAlert, setEmergencyAlert] = useState<string | null>(null);

  // AI Thinking / Typing animation indicator for lifelike feel
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);
  const [lastSelectedOptionId, setLastSelectedOptionId] = useState<string | null>(null);

  // Persistent free-text fallback input: "Prefer to explain in your own words?"
  const [freeTextAnswer, setFreeTextAnswer] = useState<string>('');
  const [isSubmittingFreeText, setIsSubmittingFreeText] = useState<boolean>(false);

  const chatScrollRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollChatToBottom = () => {
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTo({
          top: chatScrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 80);
  };

  useEffect(() => {
    if (subStage === 'ai_questioning') {
      scrollChatToBottom();
    }
  }, [turns.length, currentQuestion?.id, isAiThinking, subStage]);

  const primaryAreaLabel = getPrimaryRegionLabel(selectedRegions, isOtherSelected);

  // Start questioning
  const startAIQuestioning = () => {
    if (selectedRegions.length === 0 && !isOtherSelected) {
      setValidationError('Please tap an area on the body illustration or choose "Other" below.');
      return;
    }
    setValidationError(null);
    setSubStage('ai_questioning');
    setIsAiThinking(true);

    setTimeout(() => {
      const engineResult = getNextQuestionForSession({
        selectedRegions,
        isOtherSelected,
        initialDescription: initialDescription.trim(),
        patientInfo,
        answers,
        turns,
      });

      setIsAiThinking(false);
      if (engineResult.isComplete) {
        onCompleteStage3(answers, turns);
        return;
      }

      setCurrentQuestion(engineResult.nextQuestion);
      setCurrentAIMessage(engineResult.aiTransitionMessage);
      scrollChatToBottom();
    }, 400);
  };

  // Synchronize on mount if in questioning mode
  useEffect(() => {
    if (subStage === 'ai_questioning' && !currentQuestion && turns.length === 0) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const engineResult = getNextQuestionForSession({
          selectedRegions,
          isOtherSelected,
          initialDescription: initialDescription.trim(),
          patientInfo,
          answers,
          turns,
        });
        setIsAiThinking(false);
        if (engineResult.isComplete) {
          onCompleteStage3(answers, turns);
        } else {
          setCurrentQuestion(engineResult.nextQuestion);
          setCurrentAIMessage(engineResult.aiTransitionMessage);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [subStage]);

  // Handle patient answering a question
  const handleAnswerQuestion = (val: any, displayLabel: string) => {
    if (!currentQuestion) return;

    // Check emergency condition
    if (currentQuestion.emergencyCheck) {
      const em = currentQuestion.emergencyCheck(val);
      if (em?.isEmergency) {
        setEmergencyAlert(em.reason);
      }
    }

    const newAnswers = {
      ...answers,
      [currentQuestion.id]: val,
    };
    onUpdateAnswers(newAnswers);

    const now = new Date();
    const timeStr = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${
      now.getHours() >= 12 ? 'PM' : 'AM'
    }`;

    const newTurn: ConversationTurn = {
      id: `turn-${Date.now()}-${turns.length}`,
      questionId: currentQuestion.id,
      aiMessage: currentAIMessage || currentQuestion.prompt,
      question: currentQuestion,
      userAnswer: val,
      userDisplayAnswer: displayLabel,
      timestamp: timeStr,
      isCurrent: false,
    };

    const nextTurns = [...turns, newTurn];
    onUpdateTurns(nextTurns);
    setFreeTextAnswer('');

    // Enter AI thinking state for lifelike conversational rhythm
    setIsAiThinking(true);
    setCurrentQuestion(null);
    scrollChatToBottom();

    setTimeout(() => {
      const engineResult = getNextQuestionForSession({
        selectedRegions,
        isOtherSelected,
        initialDescription: initialDescription.trim(),
        patientInfo,
        answers: newAnswers,
        turns: nextTurns,
      });

      setIsAiThinking(false);

      if (engineResult.emergencyNotice) {
        setEmergencyAlert(engineResult.emergencyNotice);
      }

      if (engineResult.isComplete) {
        setCurrentQuestion(null);
        onCompleteStage3(newAnswers, nextTurns);
      } else {
        setCurrentQuestion(engineResult.nextQuestion);
        setCurrentAIMessage(engineResult.aiTransitionMessage);
        scrollChatToBottom();
      }
    }, 450);
  };

  // Handle Free-text fallback submission
  const handleFreeTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freeTextAnswer.trim()) return;
    const textVal = freeTextAnswer.trim();
    handleAnswerQuestion(textVal, textVal);
  };

  // 1. SUB-VIEW A: Problem / Body Area Selection
  if (subStage === 'body_selection') {
    return (
      <div
        id="stage-3-body-selection"
        className="w-full consultation-responsive-container space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-6"
      >
        <div className="bg-white rounded-3xl border border-[#DFDCF5] p-5 sm:p-7 sm:px-8 shadow-[0_4px_24px_rgba(76,73,158,0.06)] relative overflow-hidden space-y-4 sm:space-y-5">
          {/* Soft background ambient accent matching Stage 1 & 2 */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-[#F4EFFF] to-transparent rounded-bl-full pointer-events-none -z-0 opacity-70" />

          {/* Left-Aligned Section Header */}
          <div className="relative z-10 space-y-1 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EDEAFB] text-[#4C499E] text-xs font-bold uppercase tracking-wider">
              <HeartPulse className="w-3.5 h-3.5 text-[#4C499E]" />
              <span>Stage 3 of 4 • Problem & Questions</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232142] tracking-tight">
              Where are you experiencing the problem?
            </h2>
          </div>

          {validationError && (
            <div className="relative z-10 p-3 bg-[#FDF2F4] border border-[#F9C3CD] text-[#C01B39] rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Interactive Human Body Illustration */}
          <div className="relative z-10">
            <BodySelector
              selectedRegions={selectedRegions}
              onToggleRegion={(region) => {
                setValidationError(null);
                onToggleRegion(region);
              }}
              onClearSelection={onClearRegions}
              isOtherSelected={isOtherSelected}
              onToggleOther={() => {
                setValidationError(null);
                onToggleOther();
              }}
            />
          </div>

          {/* Tell us what's bothering you */}
          <div className="relative z-10 space-y-2 pt-3 border-t border-[#F0EEF8]">
            <label
              htmlFor="problem-description-input"
              className="block text-xs font-bold uppercase tracking-wider text-[#3D3A6B]"
            >
              Tell us what&apos;s bothering you <span className="text-[10px] text-[#8682A7] font-normal lowercase">(optional overview)</span>
            </label>
            <textarea
              id="problem-description-input"
              rows={2}
              value={initialDescription}
              onChange={(e) => onUpdateDescription(e.target.value)}
              placeholder="Describe what you feel (e.g. sharp lower abdominal pain since yesterday, worse with movement or coughing)..."
              className="w-full text-xs sm:text-sm font-medium p-3.5 rounded-2xl bg-[#FAF9FD] border border-[#DDD9F2] text-[#232142] placeholder-[#A09CBF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4C499E]/20 focus:border-[#4C499E] transition-all"
            />
          </div>

          {/* Actions: Back and Continue */}
          <div className="relative z-10 pt-3 flex items-center justify-between border-t border-[#F0EEF8]">
            <button
              type="button"
              id="btn-stage-3-back"
              onClick={onBackToHealthDetails}
              className="px-4 sm:px-5 py-2.5 rounded-2xl bg-[#FAF9FD] hover:bg-[#F0EDFA] text-[#4E4A7D] font-bold text-xs sm:text-sm border border-[#DDD9F2] transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              id="btn-stage-3-continue"
              onClick={startAIQuestioning}
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#4C499E] to-[#635FB8] hover:from-[#3D3A8A] hover:to-[#534EA6] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#4C499E]/25 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <span>Continue to AI Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. SUB-VIEW B: Dynamic AI Questioning Interface (Conversational Chat Experience)
  return (
    <div
      id="stage-3-ai-questioning"
      className="w-full consultation-responsive-container space-y-4 animate-in fade-in duration-300 pb-6"
    >
      {/* Left-Aligned Section Header matching Stage 1 & 2 */}
      <div className="space-y-1 text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EDEAFB] text-[#4C499E] text-xs font-bold uppercase tracking-wider">
          <HeartPulse className="w-3.5 h-3.5 text-[#4C499E]" />
          <span>Stage 3 of 4 • Problem & Questions</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232142] tracking-tight">
          Where are you experiencing the problem?
        </h2>
      </div>

      {/* Dedicated Conversational Chat Container with Fixed Header and Fixed Composer */}
      <div className="bg-white rounded-3xl border border-[#DFDCF5] shadow-[0_8px_30px_rgba(76,73,158,0.06)] overflow-hidden flex flex-col h-[560px] sm:h-[620px] max-h-[78vh]">
        {/* A. Conversation Header - Fixed at Top */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 bg-[#FAF9FD] border-b border-[#EAE7F6] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-gradient-to-br from-[#EDEBF9] to-[#DFDCF6] border border-[#D0CBF0] flex items-center justify-center shrink-0 shadow-2xs">
              <AIHelpAssistantRobot className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-[#232142] truncate">
                  MediKiosk Health Assistant
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EAF7EE] text-[#1E7D3F] text-[10px] font-bold shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2BA055] animate-pulse" />
                  Active
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#736F95] truncate">
                Gathering a few details about your concern
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSubStage('body_selection')}
            className="text-xs font-semibold text-[#4C499E] hover:text-[#38357B] bg-white hover:bg-[#F2EFFB] px-3 sm:px-3.5 py-1.5 rounded-xl border border-[#DDD9F2] shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-98"
            title="Change the selected body area"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Change area</span>
            <span className="sm:hidden">Area</span>
          </button>
        </div>

        {/* B. Scrollable Conversation Area - Only scrolling region */}
        <div
          ref={chatScrollRef}
          className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-[#FFFFFF] via-[#FAF9FD]/50 to-[#F6F4FC]/30"
        >
          {/* Emergency Advisory if triggered */}
          {emergencyAlert && (
            <SafetyAlertCard
              reason={emergencyAlert}
              onDismiss={() => setEmergencyAlert(null)}
            />
          )}

          {/* Previous Conversation Turns */}
          {turns.map((turn) => (
            <div key={turn.id} className="space-y-3 animate-in fade-in duration-200">
              <AIMessage
                message={turn.aiMessage}
                timestamp={turn.timestamp}
                isStreaming={false}
              />
              {turn.userDisplayAnswer && (
                <UserResponse
                  displayText={turn.userDisplayAnswer || String(turn.userAnswer)}
                  timestamp={turn.timestamp}
                />
              )}
            </div>
          ))}

          {/* Active AI Question & Interactive Answer Controls */}
          {currentQuestion && !isAiThinking && (
            <div className="space-y-3 pt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <AIMessage
                message={currentAIMessage || currentQuestion.prompt}
                timestamp="Just now"
                isStreaming={false}
              />

              {/* Interactive Answer UI rendered directly underneath the active question */}
              <div className="animate-in fade-in duration-200">
                <QuestionRenderer
                  question={currentQuestion}
                  onAnswer={handleAnswerQuestion}
                />
              </div>
            </div>
          )}

          {/* AI Thinking / Typing Indicator */}
          {isAiThinking && (
            <div className="flex items-start gap-3 sm:gap-3.5 max-w-xl animate-in fade-in duration-200">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#EDEBF9] to-[#DFDCF6] border border-[#D0CBF0] flex items-center justify-center shrink-0 shadow-xs">
                <AIHelpAssistantRobot className="w-8 h-8" />
              </div>
              <div className="bg-white border border-[#E3E0F3] rounded-2xl rounded-tl-sm px-4 sm:px-5 py-3 text-xs sm:text-sm text-[#6C6891] flex items-center gap-2.5 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#4C499E] animate-spin" />
                <span>Health Assistant is analyzing your response...</span>
                <div className="flex gap-1 items-center ml-2">
                  <span className="w-1.5 h-1.5 bg-[#4C499E] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-[#4C499E] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-[#4C499E] rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          {/* Completed State inside chat stream if questions finished */}
          {!currentQuestion && !isAiThinking && turns.length > 0 && (
            <div className="p-4 sm:p-5 rounded-2xl bg-[#EAF7EE]/70 border border-[#BDE7C9] text-center space-y-2 animate-in fade-in my-2">
              <div className="w-10 h-10 rounded-full bg-[#EAF7EE] text-[#1E7D3F] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#1E7D3F]">
                Sufficient details collected
              </h4>
              <p className="text-xs text-[#52705D] max-w-md mx-auto">
                Our clinical assistant has gathered the needed details. You can review your consultation summary now.
              </p>
            </div>
          )}

          <div ref={chatEndRef} className="h-1" />
        </div>

        {/* C. Fixed Bottom Text Composer - Always available & anchored */}
        <div className="shrink-0 p-3 sm:p-4 bg-white border-t border-[#EAE7F6]">
          <form onSubmit={handleFreeTextSubmit} className="relative flex items-center">
            <input
              type="text"
              id="stage-3-chat-composer-input"
              value={freeTextAnswer}
              onChange={(e) => setFreeTextAnswer(e.target.value)}
              disabled={isAiThinking}
              placeholder={
                isAiThinking
                  ? "Health Assistant is analyzing..."
                  : "Type your answer or add details in your own words..."
              }
              className="w-full text-xs sm:text-sm font-medium pl-4 pr-12 py-3 rounded-2xl bg-[#FAF9FD] border border-[#DDD9F2] text-[#232142] placeholder-[#9E9ABF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4C499E]/20 focus:border-[#4C499E] transition-all disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!freeTextAnswer.trim() || isAiThinking}
              className="absolute right-2 p-2 rounded-xl bg-[#4C499E] hover:bg-[#3D3A8A] text-white disabled:bg-[#EAE7F6] disabled:text-[#A8A4C6] disabled:cursor-not-allowed transition-all cursor-pointer shadow-xs active:scale-95 flex items-center justify-center"
              title="Send response"
              aria-label="Send response"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Navigation Controls outside the chat container */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          id="btn-stage-3-back-to-body"
          onClick={() => setSubStage('body_selection')}
          className="px-4 sm:px-5 py-2.5 rounded-2xl bg-white hover:bg-[#FAF9FD] text-[#4E4A7D] font-bold text-xs sm:text-sm border border-[#DDD9F2] transition-all cursor-pointer flex items-center gap-1.5 active:scale-98 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Body Area</span>
        </button>

        <button
          type="button"
          id="btn-stage-3-review-consultation"
          onClick={() => onCompleteStage3(answers, turns)}
          disabled={turns.length === 0}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#4C499E] to-[#635FB8] hover:from-[#3D3A8A] hover:to-[#534EA6] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#4C499E]/25 transition-all active:scale-98 cursor-pointer flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Review Consultation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
