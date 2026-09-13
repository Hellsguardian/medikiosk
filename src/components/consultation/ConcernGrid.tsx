import React from 'react';
import { ConcernCategory, BodyRegionId } from '../../types/consultation';
import { Check } from 'lucide-react';

export const CONCERN_CATEGORIES: ConcernCategory[] = [
  {
    id: 'head',
    label: 'Head / Headache',
    emoji: '🧠',
    bodyRegions: ['head'],
    description: 'Migraines, throbbing pain, tension, dizziness, or lightheadedness',
    popular: true,
  },
  {
    id: 'chest',
    label: 'Chest / Breathing',
    emoji: '🫁',
    bodyRegions: ['chest'],
    description: 'Cough, shortness of breath, tightness, wheezing, or chest congestion',
    popular: true,
  },
  {
    id: 'heart',
    label: 'Heart / Circulation',
    emoji: '❤️',
    bodyRegions: ['chest'],
    description: 'Palpitations, racing heartbeat, flutter, or swelling in ankles',
  },
  {
    id: 'stomach',
    label: 'Stomach / Digestion',
    emoji: '🩺',
    bodyRegions: ['abdomen'],
    description: 'Abdominal pain, acidity, bloating, indigestion, nausea, or diarrhea',
    popular: true,
  },
  {
    id: 'bones',
    label: 'Bones / Joints',
    emoji: '🦴',
    bodyRegions: ['arm-left', 'arm-right', 'leg-left', 'leg-right', 'hand-left', 'hand-right'],
    description: 'Joint pain, stiffness, clicking, back pain, or arthritis',
  },
  {
    id: 'skin',
    label: 'Skin / Dermatological',
    emoji: '🧴',
    bodyRegions: ['arm-left', 'arm-right', 'leg-left', 'leg-right', 'chest', 'abdomen'],
    description: 'Rashes, itching, hives, acne, fungal patches, or strange moles',
  },
  {
    id: 'eyes',
    label: 'Eyes / Vision',
    emoji: '👁️',
    bodyRegions: ['head'],
    description: 'Blurry vision, redness, watery eyes, dryness, or eye strain',
  },
  {
    id: 'ent',
    label: 'Ear / Nose / Throat',
    emoji: '👂',
    bodyRegions: ['head', 'neck'],
    description: 'Sore throat, earache, blocked nose, sinus headache, or ringing in ear',
    popular: true,
  },
  {
    id: 'teeth',
    label: 'Teeth / Mouth',
    emoji: '🦷',
    bodyRegions: ['head'],
    description: 'Toothache, gum bleeding, mouth ulcers, or jaw pain',
  },
  {
    id: 'legs',
    label: 'Legs / Feet',
    emoji: '🦵',
    bodyRegions: ['leg-left', 'leg-right', 'foot-left', 'foot-right'],
    description: 'Swelling, sprains, heel pain, calf cramps, or walking trouble',
  },
  {
    id: 'muscles',
    label: 'Muscles / Soft Tissue',
    emoji: '💪',
    bodyRegions: ['arm-left', 'arm-right', 'leg-left', 'leg-right', 'neck'],
    description: 'Body ache, muscle spasms, strain after exercise, or weakness',
  },
  {
    id: 'urinary',
    label: 'Urinary / Reproductive',
    emoji: '🚻',
    bodyRegions: ['pelvis'],
    description: 'Burning urination, frequent trips, pelvic discomfort, or cramps',
  },
  {
    id: 'fever',
    label: 'Fever / General Illness',
    emoji: '🌡️',
    bodyRegions: ['head', 'chest', 'abdomen'],
    description: 'High temperature, chills, extreme fatigue, body aches, or malaise',
    popular: true,
  },
  {
    id: 'other',
    label: 'Something Else / Other',
    emoji: '✨',
    bodyRegions: [],
    description: 'Any other clinical concern not listed above or multiple issues',
  },
];

interface ConcernGridProps {
  selectedConcernId?: string;
  onSelectConcern: (concern: ConcernCategory) => void;
  selectedBodyRegion?: BodyRegionId;
}

export const ConcernGrid: React.FC<ConcernGridProps> = ({
  selectedConcernId,
  onSelectConcern,
  selectedBodyRegion,
}) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[#7A789A]">
          Choose by Clinical Concern Category
        </span>
        {selectedBodyRegion && (
          <span className="text-xs font-semibold text-[#4C499E] bg-[#EAE8F8] px-2.5 py-0.5 rounded-full">
            Filtered by Body Region
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3">
        {CONCERN_CATEGORIES.map((concern) => {
          const isSelected = selectedConcernId === concern.id;
          const isBodyMatch =
            selectedBodyRegion && concern.bodyRegions.includes(selectedBodyRegion);

          return (
            <button
              key={concern.id}
              type="button"
              onClick={() => onSelectConcern(concern)}
              className={`group relative text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between select-none ${
                isSelected
                  ? 'bg-gradient-to-br from-[#4C499E] to-[#3B3885] text-white border-[#3B3885] shadow-lg shadow-[#4C499E]/20 scale-[1.01]'
                  : isBodyMatch
                  ? 'bg-[#F2EFFC] hover:bg-[#EAE6F9] text-[#2C2945] border-[#A8A3E0] shadow-xs'
                  : 'bg-white hover:bg-[#FAF9FD] text-[#2C2945] border-[#E3E1F2] hover:border-[#BFBAE8] shadow-xs'
              }`}
            >
              <div className="flex items-start justify-between gap-2 w-full mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl select-none" role="img" aria-label={concern.label}>
                    {concern.emoji}
                  </span>
                  <div>
                    <h4
                      className={`text-sm font-bold tracking-tight ${
                        isSelected ? 'text-white' : 'text-[#252243]'
                      }`}
                    >
                      {concern.label}
                    </h4>
                    {isBodyMatch && !isSelected && (
                      <span className="text-[10px] font-semibold text-[#E85A9F] uppercase tracking-wider">
                        ★ Matches tapped region
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? 'bg-white text-[#4C499E]'
                      : 'border border-[#D0CCE8] text-transparent group-hover:border-[#9C97DC]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2.8} />
                </div>
              </div>

              <p
                className={`text-xs line-clamp-2 leading-relaxed ${
                  isSelected ? 'text-white/80' : 'text-[#726F8E]'
                }`}
              >
                {concern.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
