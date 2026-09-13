import React, { useState } from 'react';
import { EditablePatientInfo } from '../../../types/consultation';
import {
  ArrowLeft,
  ArrowRight,
  HeartPulse,
  Plus,
  X,
  Check,
} from 'lucide-react';

interface Stage2HealthDetailsProps {
  patientInfo: EditablePatientInfo;
  onUpdate: (updated: EditablePatientInfo) => void;
  onBack: () => void;
  onContinue: () => void;
}

// Top-level allergy categories
type AllergyCategory = 'None' | 'Food' | 'Medicines' | 'Environmental' | 'Other';

const ALLERGY_CATEGORIES: { id: AllergyCategory; label: string }[] = [
  { id: 'None', label: 'None' },
  { id: 'Food', label: 'Food' },
  { id: 'Medicines', label: 'Medicines' },
  { id: 'Environmental', label: 'Environmental' },
  { id: 'Other', label: 'Other' },
];

const FOOD_ALLERGENS = [
  'Milk / Dairy',
  'Eggs',
  'Peanuts',
  'Tree nuts',
  'Almonds',
  'Cashews',
  'Wheat',
  'Soy',
  'Fish',
  'Shellfish',
  'Sesame',
  'Other',
];

const MEDICINE_ALLERGENS = [
  'Penicillin',
  'Sulfa drugs',
  'Aspirin',
  'Ibuprofen / NSAIDs',
  'Other',
];

const ENVIRONMENTAL_ALLERGENS = [
  'Dust',
  'Pollen',
  'Mold',
  'Pet dander',
  'Latex',
  'Insect bites/stings',
  'Other',
];

const PREDEFINED_CONDITIONS = [
  'Hypertension',
  'Diabetes',
  'Thyroid',
  'Asthma',
  'Jaundice',
  'Migraine',
  'None',
];

export const Stage2HealthDetails: React.FC<Stage2HealthDetailsProps> = ({
  patientInfo,
  onUpdate,
  onBack,
  onContinue,
}) => {
  // ---------------------------------------------------------------------------
  // 1. ALLERGIES STATE (Progressive Selection)
  // ---------------------------------------------------------------------------
  const initialAllergies = patientInfo.allergies || [];

  const [selectedCategories, setSelectedCategories] = useState<AllergyCategory[]>(() => {
    if (initialAllergies.length === 0 || initialAllergies.includes('None')) {
      return ['None'];
    }
    const cats: AllergyCategory[] = [];
    const lowerAllergies = initialAllergies.map((a) => a.toLowerCase());

    const hasFood = FOOD_ALLERGENS.some(
      (f) => f !== 'Other' && lowerAllergies.some((a) => a.includes(f.toLowerCase()))
    );
    const hasMed = MEDICINE_ALLERGENS.some(
      (m) => m !== 'Other' && lowerAllergies.some((a) => a.includes(m.toLowerCase()) || a.includes('penicillin') || a.includes('sulfa'))
    );
    const hasEnv = ENVIRONMENTAL_ALLERGENS.some(
      (e) => e !== 'Other' && lowerAllergies.some((a) => a.includes(e.toLowerCase()) || a.includes('dust') || a.includes('pollen'))
    );

    if (hasFood) cats.push('Food');
    if (hasMed) cats.push('Medicines');
    if (hasEnv) cats.push('Environmental');

    if (cats.length === 0 && initialAllergies.length > 0) {
      cats.push('Other');
    }
    return cats.length > 0 ? cats : ['None'];
  });

  // Specific selections per category
  const [selectedFoodAllergens, setSelectedFoodAllergens] = useState<string[]>(() => {
    return initialAllergies.filter((a) =>
      FOOD_ALLERGENS.some((f) => f.toLowerCase() === a.toLowerCase())
    );
  });
  const [customFoodText, setCustomFoodText] = useState<string>('');

  const [selectedMedicineAllergens, setSelectedMedicineAllergens] = useState<string[]>(() => {
    return initialAllergies.filter((a) =>
      MEDICINE_ALLERGENS.some((m) => m.toLowerCase() === a.toLowerCase())
    );
  });
  const [customMedicineText, setCustomMedicineText] = useState<string>('');

  const [selectedEnvAllergens, setSelectedEnvAllergens] = useState<string[]>(() => {
    return initialAllergies.filter((a) =>
      ENVIRONMENTAL_ALLERGENS.some((e) => e.toLowerCase() === a.toLowerCase())
    );
  });
  const [customEnvText, setCustomEnvText] = useState<string>('');

  // Top-level "Other" allergy free text
  const [otherCategoryText, setOtherCategoryText] = useState<string>(() => {
    const known = new Set([
      ...FOOD_ALLERGENS.map((s) => s.toLowerCase()),
      ...MEDICINE_ALLERGENS.map((s) => s.toLowerCase()),
      ...ENVIRONMENTAL_ALLERGENS.map((s) => s.toLowerCase()),
      'none',
    ]);
    const others = initialAllergies.filter((a) => !known.has(a.toLowerCase()));
    return others.join(', ');
  });

  // ---------------------------------------------------------------------------
  // 2. ONGOING HEALTH CONDITIONS STATE
  // ---------------------------------------------------------------------------
  const initialConditions = patientInfo.ongoingConditions || [];

  // Custom conditions added by user (persisted during session)
  const [customConditions, setCustomConditions] = useState<string[]>(() => {
    const predefinedLower = PREDEFINED_CONDITIONS.map((c) => c.toLowerCase());
    return initialConditions.filter((c) => !predefinedLower.includes(c.toLowerCase()));
  });

  // Selected conditions (both predefined and custom)
  const [selectedConditions, setSelectedConditions] = useState<string[]>(() => {
    if (initialConditions.length === 0) return [];
    return initialConditions;
  });

  // Inline input state for "+ Add condition"
  const [showAddConditionInput, setShowAddConditionInput] = useState<boolean>(false);
  const [newConditionInput, setNewConditionInput] = useState<string>('');

  // ---------------------------------------------------------------------------
  // 3. "ANYTHING ELSE WE SHOULD KNOW?" STATE
  // ---------------------------------------------------------------------------
  const [hasAdditionalInfo, setHasAdditionalInfo] = useState<boolean>(() => {
    return Boolean(patientInfo.otherHealthInfo && patientInfo.otherHealthInfo.trim().length > 0);
  });
  const [additionalInfo, setAdditionalInfo] = useState<string>(
    patientInfo.otherHealthInfo || ''
  );

  // ---------------------------------------------------------------------------
  // Synchronization Helper to update patientInfo
  // ---------------------------------------------------------------------------
  const syncChanges = (
    cats: AllergyCategory[],
    food: string[],
    foodCustom: string,
    meds: string[],
    medsCustom: string,
    env: string[],
    envCustom: string,
    otherText: string,
    conditions: string[],
    otherNotes: string
  ) => {
    let finalAllergies: string[] = [];

    if (cats.includes('None') || cats.length === 0) {
      finalAllergies = ['None'];
    } else {
      const set = new Set<string>();

      if (cats.includes('Food')) {
        const specificFood = food.filter((f) => f !== 'Other');
        if (specificFood.length > 0) {
          specificFood.forEach((f) => set.add(f));
        } else if (!foodCustom.trim()) {
          set.add('Food (Unspecified)');
        }
        if (foodCustom.trim()) {
          foodCustom.split(',').forEach((s) => s.trim() && set.add(s.trim()));
        }
      }

      if (cats.includes('Medicines')) {
        const specificMeds = meds.filter((m) => m !== 'Other');
        if (specificMeds.length > 0) {
          specificMeds.forEach((m) => set.add(m));
        } else if (!medsCustom.trim()) {
          set.add('Medicines (Unspecified)');
        }
        if (medsCustom.trim()) {
          medsCustom.split(',').forEach((s) => s.trim() && set.add(s.trim()));
        }
      }

      if (cats.includes('Environmental')) {
        const specificEnv = env.filter((e) => e !== 'Other');
        if (specificEnv.length > 0) {
          specificEnv.forEach((e) => set.add(e));
        } else if (!envCustom.trim()) {
          set.add('Environmental (Unspecified)');
        }
        if (envCustom.trim()) {
          envCustom.split(',').forEach((s) => s.trim() && set.add(s.trim()));
        }
      }

      if (cats.includes('Other')) {
        if (otherText.trim()) {
          otherText.split(',').forEach((s) => s.trim() && set.add(s.trim()));
        } else {
          set.add('Other Allergy');
        }
      }

      finalAllergies = Array.from(set);
      if (finalAllergies.length === 0) {
        finalAllergies = ['None'];
      }
    }

    onUpdate({
      ...patientInfo,
      allergies: finalAllergies,
      ongoingConditions: conditions.filter((c) => c !== 'None'),
      otherHealthInfo: otherNotes.trim(),
    });
  };

  // ---------------------------------------------------------------------------
  // Category Toggling
  // ---------------------------------------------------------------------------
  const toggleAllergyCategory = (cat: AllergyCategory) => {
    let next: AllergyCategory[];
    if (cat === 'None') {
      next = ['None'];
      // Clear sub-selections when "None" is chosen
      setSelectedFoodAllergens([]);
      setCustomFoodText('');
      setSelectedMedicineAllergens([]);
      setCustomMedicineText('');
      setSelectedEnvAllergens([]);
      setCustomEnvText('');
      setOtherCategoryText('');
    } else {
      next = selectedCategories.filter((c) => c !== 'None');
      if (next.includes(cat)) {
        next = next.filter((c) => c !== cat);
        if (next.length === 0) {
          next = ['None'];
        }
      } else {
        next = [...next, cat];
      }
    }

    setSelectedCategories(next);
    syncChanges(
      next,
      selectedFoodAllergens,
      customFoodText,
      selectedMedicineAllergens,
      customMedicineText,
      selectedEnvAllergens,
      customEnvText,
      otherCategoryText,
      selectedConditions,
      additionalInfo
    );
  };

  // Sub-option toggles
  const toggleSubAllergen = (
    item: string,
    currentList: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    type: 'food' | 'med' | 'env'
  ) => {
    const next = currentList.includes(item)
      ? currentList.filter((i) => i !== item)
      : [...currentList, item];
    setter(next);

    syncChanges(
      selectedCategories,
      type === 'food' ? next : selectedFoodAllergens,
      customFoodText,
      type === 'med' ? next : selectedMedicineAllergens,
      customMedicineText,
      type === 'env' ? next : selectedEnvAllergens,
      customEnvText,
      otherCategoryText,
      selectedConditions,
      additionalInfo
    );
  };

  // ---------------------------------------------------------------------------
  // Ongoing Conditions Toggling
  // ---------------------------------------------------------------------------
  const toggleCondition = (cond: string) => {
    let next: string[];
    if (cond === 'None') {
      next = [];
    } else {
      if (selectedConditions.includes(cond)) {
        next = selectedConditions.filter((c) => c !== cond);
      } else {
        next = [...selectedConditions.filter((c) => c !== 'None'), cond];
      }
    }
    setSelectedConditions(next);
    syncChanges(
      selectedCategories,
      selectedFoodAllergens,
      customFoodText,
      selectedMedicineAllergens,
      customMedicineText,
      selectedEnvAllergens,
      customEnvText,
      otherCategoryText,
      next,
      additionalInfo
    );
  };

  // Add custom condition
  const handleAddCustomCondition = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newConditionInput.trim();
    if (!trimmed) {
      setShowAddConditionInput(false);
      return;
    }

    // Check if already in predefined or custom
    const existing = [...PREDEFINED_CONDITIONS, ...customConditions].find(
      (c) => c.toLowerCase() === trimmed.toLowerCase()
    );

    let nextCustom = customConditions;
    let nextSelected = selectedConditions.filter((c) => c !== 'None');

    if (existing) {
      if (!nextSelected.includes(existing)) {
        nextSelected = [...nextSelected, existing];
      }
    } else {
      nextCustom = [...customConditions, trimmed];
      nextSelected = [...nextSelected, trimmed];
      setCustomConditions(nextCustom);
    }

    setSelectedConditions(nextSelected);
    setNewConditionInput('');
    setShowAddConditionInput(false);

    syncChanges(
      selectedCategories,
      selectedFoodAllergens,
      customFoodText,
      selectedMedicineAllergens,
      customMedicineText,
      selectedEnvAllergens,
      customEnvText,
      otherCategoryText,
      nextSelected,
      additionalInfo
    );
  };

  // Remove custom condition
  const handleRemoveCustomCondition = (e: React.MouseEvent, cond: string) => {
    e.stopPropagation();
    const nextCustom = customConditions.filter((c) => c !== cond);
    const nextSelected = selectedConditions.filter((c) => c !== cond);
    setCustomConditions(nextCustom);
    setSelectedConditions(nextSelected);

    syncChanges(
      selectedCategories,
      selectedFoodAllergens,
      customFoodText,
      selectedMedicineAllergens,
      customMedicineText,
      selectedEnvAllergens,
      customEnvText,
      otherCategoryText,
      nextSelected,
      additionalInfo
    );
  };

  // ---------------------------------------------------------------------------
  // Submit Handler
  // ---------------------------------------------------------------------------
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    syncChanges(
      selectedCategories,
      selectedFoodAllergens,
      customFoodText,
      selectedMedicineAllergens,
      customMedicineText,
      selectedEnvAllergens,
      customEnvText,
      otherCategoryText,
      selectedConditions,
      additionalInfo
    );
    onContinue();
  };

  return (
    <div
      id="stage-2-health-details"
      className="w-full consultation-responsive-container animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="bg-white rounded-3xl border border-[#DFDCF5] p-5 sm:p-7 sm:px-8 shadow-[0_4px_24px_rgba(76,73,158,0.06)] relative overflow-hidden space-y-5">
        {/* Soft background ambient accent */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-[#F4EFFF] to-transparent rounded-bl-full pointer-events-none -z-0 opacity-70" />

        {/* Section Header */}
        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#EDEAFB] text-[#4C499E] text-xs font-bold uppercase tracking-wider">
            <HeartPulse className="w-3.5 h-3.5 text-[#4C499E]" />
            <span>Stage 2 of 4 • Health Details</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232142] tracking-tight">
            Tell us about your health
          </h2>
          <p className="text-xs sm:text-sm text-[#6C6891] leading-normal">
            A few quick details to personalize your consultation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* =========================================================================
              1. DO YOU HAVE ANY ALLERGIES? (Progressive Selection)
             ========================================================================= */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#3D3A6B]">
                Do you have any allergies?
              </label>
              <span className="text-[11px] text-[#827E9F] font-medium hidden sm:inline">
                Select all that apply
              </span>
            </div>

            {/* Primary Category Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {ALLERGY_CATEGORIES.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleAllergyCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 active:scale-95 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#4C499E] text-white border-[#4C499E] shadow-sm shadow-[#4C499E]/20'
                        : 'bg-[#FAF9FD] text-[#433F6E] border-[#DDD9F2] hover:border-[#4C499E] hover:bg-[#F2EFFB]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-white text-[#4C499E] border-white'
                          : 'border-[#CBC7EA] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamically Revealed Sub-Options: Food Allergens */}
            {selectedCategories.includes('Food') && (
              <div className="mt-3 p-4 bg-[#FAF9FD] rounded-2xl border border-[#DFDCF5] space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4C499E] uppercase tracking-wider">
                    Which food allergies?
                  </span>
                  <span className="text-[11px] text-[#827E9F]">
                    {selectedFoodAllergens.length > 0 ? `${selectedFoodAllergens.length} selected` : 'Select all that apply'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {FOOD_ALLERGENS.map((item) => {
                    const isChecked = selectedFoodAllergens.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          toggleSubAllergen(item, selectedFoodAllergens, setSelectedFoodAllergens, 'food')
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border cursor-pointer ${
                          isChecked
                            ? 'bg-[#EDEAFB] text-[#4C499E] border-[#4C499E] shadow-2xs font-bold'
                            : 'bg-white text-[#56527D] border-[#DDD9F2] hover:border-[#4C499E] hover:bg-[#F6F4FC]'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Inline text input if "Other" inside Food is selected */}
                {selectedFoodAllergens.includes('Other') && (
                  <div className="pt-2 animate-in fade-in duration-150">
                    <input
                      type="text"
                      value={customFoodText}
                      onChange={(e) => {
                        setCustomFoodText(e.target.value);
                        syncChanges(
                          selectedCategories,
                          selectedFoodAllergens,
                          e.target.value,
                          selectedMedicineAllergens,
                          customMedicineText,
                          selectedEnvAllergens,
                          customEnvText,
                          otherCategoryText,
                          selectedConditions,
                          additionalInfo
                        );
                      }}
                      placeholder="Specify food allergy (e.g., Strawberries, Mustard, Gluten)..."
                      className="w-full text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl bg-white border border-[#4C499E] text-[#232142] placeholder-[#9D99BF] focus:outline-none focus:ring-2 focus:ring-[#4C499E]/20"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            )}

            {/* Dynamically Revealed Sub-Options: Medicine Allergens */}
            {selectedCategories.includes('Medicines') && (
              <div className="mt-3 p-4 bg-[#FAF9FD] rounded-2xl border border-[#DFDCF5] space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4C499E] uppercase tracking-wider">
                    Which medication allergies?
                  </span>
                  <span className="text-[11px] text-[#827E9F]">
                    {selectedMedicineAllergens.length > 0 ? `${selectedMedicineAllergens.length} selected` : 'Select all that apply'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {MEDICINE_ALLERGENS.map((item) => {
                    const isChecked = selectedMedicineAllergens.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          toggleSubAllergen(item, selectedMedicineAllergens, setSelectedMedicineAllergens, 'med')
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border cursor-pointer ${
                          isChecked
                            ? 'bg-[#EDEAFB] text-[#4C499E] border-[#4C499E] shadow-2xs font-bold'
                            : 'bg-white text-[#56527D] border-[#DDD9F2] hover:border-[#4C499E] hover:bg-[#F6F4FC]'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Inline text input if "Other" inside Medicines is selected */}
                {selectedMedicineAllergens.includes('Other') && (
                  <div className="pt-2 animate-in fade-in duration-150">
                    <input
                      type="text"
                      value={customMedicineText}
                      onChange={(e) => {
                        setCustomMedicineText(e.target.value);
                        syncChanges(
                          selectedCategories,
                          selectedFoodAllergens,
                          customFoodText,
                          selectedMedicineAllergens,
                          e.target.value,
                          selectedEnvAllergens,
                          customEnvText,
                          otherCategoryText,
                          selectedConditions,
                          additionalInfo
                        );
                      }}
                      placeholder="Specify medicine allergy (e.g., Codeine, Cephalosporins, Statin)..."
                      className="w-full text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl bg-white border border-[#4C499E] text-[#232142] placeholder-[#9D99BF] focus:outline-none focus:ring-2 focus:ring-[#4C499E]/20"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            )}

            {/* Dynamically Revealed Sub-Options: Environmental Allergens */}
            {selectedCategories.includes('Environmental') && (
              <div className="mt-3 p-4 bg-[#FAF9FD] rounded-2xl border border-[#DFDCF5] space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#4C499E] uppercase tracking-wider">
                    Which environmental allergies?
                  </span>
                  <span className="text-[11px] text-[#827E9F]">
                    {selectedEnvAllergens.length > 0 ? `${selectedEnvAllergens.length} selected` : 'Select all that apply'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {ENVIRONMENTAL_ALLERGENS.map((item) => {
                    const isChecked = selectedEnvAllergens.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          toggleSubAllergen(item, selectedEnvAllergens, setSelectedEnvAllergens, 'env')
                        }
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 border cursor-pointer ${
                          isChecked
                            ? 'bg-[#EDEAFB] text-[#4C499E] border-[#4C499E] shadow-2xs font-bold'
                            : 'bg-white text-[#56527D] border-[#DDD9F2] hover:border-[#4C499E] hover:bg-[#F6F4FC]'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[2.5]" />}
                        <span>{item}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Inline text input if "Other" inside Environmental is selected */}
                {selectedEnvAllergens.includes('Other') && (
                  <div className="pt-2 animate-in fade-in duration-150">
                    <input
                      type="text"
                      value={customEnvText}
                      onChange={(e) => {
                        setCustomEnvText(e.target.value);
                        syncChanges(
                          selectedCategories,
                          selectedFoodAllergens,
                          customFoodText,
                          selectedMedicineAllergens,
                          customMedicineText,
                          selectedEnvAllergens,
                          e.target.value,
                          otherCategoryText,
                          selectedConditions,
                          additionalInfo
                        );
                      }}
                      placeholder="Specify environmental allergy (e.g., Cockroaches, Perfumes, Grass)..."
                      className="w-full text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl bg-white border border-[#4C499E] text-[#232142] placeholder-[#9D99BF] focus:outline-none focus:ring-2 focus:ring-[#4C499E]/20"
                      autoFocus
                    />
                  </div>
                )}
              </div>
            )}

            {/* Dynamically Revealed: Top-level "Other" allergy input */}
            {selectedCategories.includes('Other') && (
              <div className="mt-3 p-4 bg-[#FAF9FD] rounded-2xl border border-[#DFDCF5] space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                <span className="text-xs font-bold text-[#4C499E] uppercase tracking-wider block">
                  Describe your allergy
                </span>
                <input
                  type="text"
                  id="other-allergy-input"
                  value={otherCategoryText}
                  onChange={(e) => {
                    setOtherCategoryText(e.target.value);
                    syncChanges(
                      selectedCategories,
                      selectedFoodAllergens,
                      customFoodText,
                      selectedMedicineAllergens,
                      customMedicineText,
                      selectedEnvAllergens,
                      customEnvText,
                      e.target.value,
                      selectedConditions,
                      additionalInfo
                    );
                  }}
                  placeholder="e.g. Nickel, Contrast dye, Specific detergents..."
                  className="w-full text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl bg-white border border-[#4C499E] text-[#232142] placeholder-[#9D99BF] focus:outline-none focus:ring-2 focus:ring-[#4C499E]/20"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* =========================================================================
              2. ONGOING HEALTH CONDITIONS (With Working "+ Add condition")
             ========================================================================= */}
          <div className="space-y-2.5 pt-3 border-t border-[#F0EEF8]">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#3D3A6B]">
                Ongoing health conditions
              </label>
              <span className="text-[11px] text-[#827E9F] font-medium hidden sm:inline">
                Tap to toggle
              </span>
            </div>

            {/* Predefined + Custom Chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {PREDEFINED_CONDITIONS.map((cond) => {
                const isSelected =
                  cond === 'None'
                    ? selectedConditions.length === 0
                    : selectedConditions.includes(cond);

                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer border ${
                      isSelected
                        ? 'bg-[#EDEAFB] text-[#4C499E] border-[#4C499E] shadow-2xs ring-1 ring-[#4C499E]/20'
                        : 'bg-[#FAF9FD] text-[#55517E] border-[#DDD9F2] hover:border-[#4C499E] hover:bg-[#F2EFFB]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{cond}</span>
                  </button>
                );
              })}

              {/* Custom User-Added Conditions (selectable and removable) */}
              {customConditions.map((custom) => {
                const isSelected = selectedConditions.includes(custom);
                return (
                  <div
                    key={custom}
                    onClick={() => toggleCondition(custom)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#EDEAFB] text-[#4C499E] border-[#4C499E] shadow-2xs ring-1 ring-[#4C499E]/20'
                        : 'bg-[#FAF9FD] text-[#55517E] border-[#DDD9F2] hover:border-[#4C499E] hover:bg-[#F2EFFB]'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{custom}</span>
                    <button
                      type="button"
                      onClick={(e) => handleRemoveCustomCondition(e, custom)}
                      className="ml-0.5 p-0.5 rounded-full hover:bg-[#DDD9F2] text-[#837FA5] hover:text-[#C01B39] transition-colors"
                      title="Remove condition"
                    >
                      <X className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                );
              })}

              {/* "+ Add condition" button */}
              {!showAddConditionInput ? (
                <button
                  type="button"
                  id="btn-add-condition-plus"
                  onClick={() => setShowAddConditionInput(true)}
                  className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#FAF9FD] text-[#4C499E] border border-dashed border-[#B8B4E2] hover:border-[#4C499E] hover:bg-[#EDEAFB] transition-all cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-[#4C499E] stroke-[2.5]" />
                  <span>Add condition</span>
                </button>
              ) : null}
            </div>

            {/* Revealed Inline Input for "Add condition" */}
            {showAddConditionInput && (
              <div className="pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="flex items-center gap-2 max-w-md bg-[#FAF9FD] p-1.5 rounded-2xl border border-[#4C499E] focus-within:ring-2 focus-within:ring-[#4C499E]/25">
                  <input
                    type="text"
                    id="new-condition-text-input"
                    value={newConditionInput}
                    onChange={(e) => setNewConditionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomCondition();
                      } else if (e.key === 'Escape') {
                        setShowAddConditionInput(false);
                      }
                    }}
                    placeholder="Enter condition (e.g. Acid Reflux, Cholesterol)..."
                    className="flex-1 text-xs sm:text-sm font-semibold px-3 py-1 bg-transparent text-[#232142] placeholder-[#9692B8] focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleAddCustomCondition()}
                    disabled={!newConditionInput.trim()}
                    className="px-3.5 py-1 rounded-xl bg-[#4C499E] text-white text-xs font-bold hover:bg-[#3D3A8A] disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewConditionInput('');
                      setShowAddConditionInput(false);
                    }}
                    className="p-1 text-[#9692B8] hover:text-[#232142] transition-colors cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* =========================================================================
              3. "ANYTHING ELSE WE SHOULD KNOW?" (Compact Interactive Strip)
             ========================================================================= */}
          <div className="space-y-2 pt-3 border-t border-[#F0EEF8]">
            <div className="flex items-center justify-between">
              <label
                htmlFor={hasAdditionalInfo ? 'additional-health-info' : undefined}
                className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#3D3A6B]"
              >
                Anything else we should know?
              </label>
              {hasAdditionalInfo ? (
                <button
                  type="button"
                  id="btn-collapse-additional-info"
                  onClick={() => setHasAdditionalInfo(false)}
                  className="text-xs text-[#6B6699] hover:text-[#4C499E] font-bold transition-colors cursor-pointer hover:underline"
                >
                  Collapse
                </button>
              ) : (
                <span className="text-[11px] font-semibold text-[#8C88AB] uppercase tracking-wider">
                  Optional
                </span>
              )}
            </div>

            {/* 1. Default / Collapsed state: Compact interactive input strip (~58-62px height) */}
            {!hasAdditionalInfo ? (
              <button
                type="button"
                id="btn-expand-additional-info"
                onClick={() => setHasAdditionalInfo(true)}
                className="w-full h-[58px] sm:h-[62px] rounded-2xl border-2 border-dashed border-[#DDD9F2] hover:border-[#4C499E] bg-[#FAF9FD] hover:bg-[#F6F4FD] flex flex-col items-center justify-center py-1.5 px-4 transition-all duration-200 group cursor-pointer hover:shadow-2xs active:scale-[0.995] text-center"
                aria-label="Add anything else we should know"
              >
                <Plus className="w-4 h-4 text-[#4C499E] stroke-[2.5] transition-transform duration-200 group-hover:scale-125" />
                <span className="text-[11px] text-[#8A86AE] font-medium transition-colors group-hover:text-[#4C499E] mt-0.5">
                  Add anything else...
                </span>
              </button>
            ) : (
              /* 2. Expanded Textarea state */
              <div className="relative animate-in fade-in duration-200">
                <textarea
                  id="additional-health-info"
                  rows={3}
                  value={additionalInfo}
                  onChange={(e) => {
                    const val = e.target.value;
                    setAdditionalInfo(val);
                    syncChanges(
                      selectedCategories,
                      selectedFoodAllergens,
                      customFoodText,
                      selectedMedicineAllergens,
                      customMedicineText,
                      selectedEnvAllergens,
                      customEnvText,
                      otherCategoryText,
                      selectedConditions,
                      val
                    );
                  }}
                  placeholder="Type anything else you'd like your healthcare professional to know..."
                  className="w-full min-h-[90px] sm:min-h-[100px] text-xs sm:text-sm font-medium p-3.5 sm:p-4 rounded-2xl bg-[#FAF9FD] border border-[#4C499E] text-[#232142] placeholder-[#9D99BF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4C499E]/20 focus:border-[#4C499E] transition-all"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Bottom Actions: Back and Continue */}
          <div className="pt-3 sm:pt-3.5 flex items-center justify-between border-t border-[#F0EEF8]">
            <button
              type="button"
              id="btn-stage-2-back"
              onClick={onBack}
              className="px-4 sm:px-5 py-2.5 rounded-2xl bg-[#FAF9FD] hover:bg-[#F0EDFA] text-[#4E4A7D] font-bold text-xs sm:text-sm border border-[#DDD9F2] transition-all cursor-pointer flex items-center gap-1.5 active:scale-98"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              id="btn-stage-2-continue"
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-[#4C499E] to-[#635FB8] hover:from-[#3D3A8A] hover:to-[#534EA6] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#4C499E]/25 transition-all active:scale-98 cursor-pointer flex items-center gap-2"
            >
              <span>Continue to Problem & Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
