import React from 'react';
import { ConsultationQuestion, QuestionOption } from '../../types/consultation';
import { ChoiceQuestion } from './questions/ChoiceQuestion';
import { MultiSelectQuestion } from './questions/MultiSelectQuestion';
import { SliderQuestion } from './questions/SliderQuestion';
import { YesNoQuestion } from './questions/YesNoQuestion';
import { TextQuestion } from './questions/TextQuestion';
import { DurationQuestion } from './questions/DurationQuestion';
import { SubRegionQuestion } from './questions/SubRegionQuestion';
import { DateQuestion } from './questions/DateQuestion';

interface QuestionRendererProps {
  question: ConsultationQuestion;
  onAnswer: (val: any, displayLabel: string) => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  onAnswer,
}) => {
  switch (question.type) {
    case 'choice':
      return (
        <ChoiceQuestion
          options={question.options || []}
          onSelect={(opt: QuestionOption) => onAnswer(opt, opt.label)}
          allowNotSure={question.allowNotSure !== false}
        />
      );

    case 'multiselect':
      return (
        <MultiSelectQuestion
          options={question.options || []}
          onConfirm={(selected: QuestionOption[]) =>
            onAnswer(
              selected,
              selected.map((s) => s.label).join(', ') || 'None selected'
            )
          }
          allowNotSure={question.allowNotSure !== false}
        />
      );

    case 'slider':
      return (
        <SliderQuestion
          min={question.min}
          max={question.max}
          step={question.step}
          defaultValue={
            typeof question.defaultValue === 'number'
              ? question.defaultValue
              : 5
          }
          minLabel={question.minLabel}
          maxLabel={question.maxLabel}
          unit={question.unit}
          isPainScale={question.id === 'severity_slider' || question.isPainScale}
          onConfirm={(val: number, displayLabel: string) =>
            onAnswer(val, displayLabel)
          }
        />
      );

    case 'duration':
      return (
        <DurationQuestion
          onSelect={(val: string, displayLabel: string) =>
            onAnswer(val, displayLabel)
          }
        />
      );

    case 'body-part':
      return (
        <SubRegionQuestion
          options={question.options || []}
          onSelect={(opt: QuestionOption) => onAnswer(opt, opt.label)}
          allowNotSure={question.allowNotSure !== false}
        />
      );

    case 'yesno':
      return (
        <YesNoQuestion
          onSelect={(val: boolean | null, label: string) =>
            onAnswer(val, label)
          }
          allowNotSure={question.allowNotSure !== false}
        />
      );

    case 'date':
      return (
        <DateQuestion
          onConfirm={(dateStr: string, displayLabel: string) =>
            onAnswer(dateStr, displayLabel)
          }
        />
      );

    case 'text':
      return (
        <TextQuestion
          placeholder={question.placeholder}
          suggestions={question.suggestions}
          onSubmit={(text: string) => onAnswer(text, text)}
          allowSkip={question.optional !== false}
        />
      );

    default:
      return null;
  }
};
