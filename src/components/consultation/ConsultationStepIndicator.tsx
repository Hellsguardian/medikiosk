import React from 'react';
import { StageKey } from '../../types/consultation';
import { Check } from 'lucide-react';

interface ConsultationStepIndicatorProps {
  currentStage: StageKey;
  onSelectStage?: (stage: StageKey) => void;
}

export const ConsultationStepIndicator: React.FC<ConsultationStepIndicatorProps> = ({
  currentStage,
  onSelectStage,
}) => {
  if (currentStage === 'submitted') return null;

  const steps = [
    {
      key: 'stage1_personal' as StageKey,
      index: 1,
      title: 'Personal Details',
      shortTitle: 'Personal',
    },
    {
      key: 'stage2_health' as StageKey,
      index: 2,
      title: 'Health Details',
      shortTitle: 'Health',
    },
    {
      key: 'stage3_problem' as StageKey,
      index: 3,
      title: 'Problem & Questions',
      shortTitle: 'Questions',
    },
    {
      key: 'stage4_review' as StageKey,
      index: 4,
      title: 'Review',
      shortTitle: 'Review',
    },
  ];

  const getStageIndex = (k: StageKey) => {
    switch (k) {
      case 'stage1_personal':
        return 1;
      case 'stage2_health':
        return 2;
      case 'stage3_problem':
        return 3;
      case 'stage4_review':
        return 4;
      case 'submitted':
        return 5;
    }
  };

  const currentIndex = getStageIndex(currentStage);

  return (
    <nav
      id="consultation-stage-stepper"
      aria-label="Consultation Progress"
      className="w-full consultation-responsive-container mb-2 sm:mb-2.5 select-none"
    >
      {/* Slim floating progress rail: 38-44px tall, matches exact width of the main card */}
      <div className="w-full relative rounded-2xl bg-white/90 backdrop-blur-md border border-[#EAE6F8] shadow-[0_2px_8px_rgba(76,73,158,0.03)] px-4 sm:px-6 md:px-8 py-1.5 transition-all">
        {/* Horizontal journey nodes with connecting line segments strictly between each stage */}
        <div className="flex items-start justify-between w-full">
          {steps.map((step, idx) => {
            const isCurrent = step.index === currentIndex;
            const isCompleted = step.index < currentIndex;
            const canJump = isCompleted && Boolean(onSelectStage);
            const hasNextSegment = idx < steps.length - 1;
            const isSegmentCompleted = step.index < currentIndex;

            return (
              <React.Fragment key={step.key}>
                {/* Stage Node: Circular marker + compact label immediately underneath */}
                <div className="flex flex-col items-center flex-shrink-0 z-10">
                  <button
                    type="button"
                    disabled={!canJump && !isCurrent}
                    onClick={() => canJump && onSelectStage?.(step.key)}
                    className={`relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4C499E] focus-visible:ring-offset-1 ${
                      canJump
                        ? 'cursor-pointer hover:scale-105 active:scale-95 group'
                        : isCurrent
                        ? 'cursor-default'
                        : 'cursor-default'
                    }`}
                    aria-current={isCurrent ? 'step' : undefined}
                    aria-label={`${step.title}, ${
                      isCompleted
                        ? 'Completed'
                        : isCurrent
                        ? 'Current step'
                        : 'Upcoming step'
                    }`}
                  >
                    {/* Active Node: Ambient breathing halo / gentle pulse ring */}
                    {isCurrent && (
                      <span
                        className="absolute -inset-1 rounded-full bg-[#4C499E]/15 animate-pulse pointer-events-none"
                        aria-hidden="true"
                      />
                    )}

                    {/* Completed Node: Subtle hover highlight */}
                    {isCompleted && (
                      <span
                        className="absolute -inset-0.5 rounded-full bg-[#1E7D3F]/10 group-hover:bg-[#1E7D3F]/20 transition-all duration-300 pointer-events-none"
                        aria-hidden="true"
                      />
                    )}

                    {/* Uniform 22px Stage Marker */}
                    <div
                      className={`w-[22px] h-[22px] rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? 'bg-[#1E7D3F] text-white shadow-[0_2px_6px_rgba(30,125,63,0.25)] ring-2 ring-white'
                          : isCurrent
                          ? 'bg-gradient-to-br from-[#4C499E] via-[#544FA5] to-[#635FB8] text-white shadow-[0_2px_8px_rgba(76,73,158,0.35)] ring-2 ring-[#4C499E]/25'
                          : 'bg-[#FAF8FE] text-[#9A96B6] border border-[#DDD8EC] ring-2 ring-white'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-3 h-3 stroke-[3] animate-in zoom-in-75 fade-in duration-300" />
                      ) : (
                        <span
                          className={`leading-none ${
                            isCurrent
                              ? 'text-[11px] font-black tracking-tight'
                              : 'text-[10.5px] font-semibold opacity-75'
                          }`}
                        >
                          {step.index}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Stage Label: 11-12px compact typography placed directly below */}
                  <div className="mt-0.5 text-center">
                    <span
                      className={`block text-[11px] sm:text-[11.5px] tracking-tight transition-all duration-300 whitespace-nowrap leading-tight ${
                        isCurrent
                          ? 'font-bold text-[#232142]'
                          : isCompleted
                          ? 'font-semibold text-[#1E7D3F]'
                          : 'font-medium text-[#9894B3]'
                      }`}
                    >
                      <span className="hidden sm:inline">{step.title}</span>
                      <span className="sm:hidden">{step.shortTitle}</span>
                    </span>
                  </div>
                </div>

                {/* Connecting Line: Strictly between step i and step i+1. No connector before step 1 or after step 4 */}
                {hasNextSegment && (
                  <div
                    className="flex-1 mx-1.5 sm:mx-2.5 h-[2px] rounded-full bg-[#EFEBF9] self-start mt-[11px] -translate-y-1/2 overflow-hidden z-0"
                    aria-hidden="true"
                  >
                    <div
                      className={`h-full rounded-full transition-all duration-400 ease-out origin-left ${
                        isSegmentCompleted
                          ? 'w-full bg-gradient-to-r from-[#1E7D3F] via-[#228A47] to-[#2BA055]'
                          : 'w-0 bg-[#EFEBF9]'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
