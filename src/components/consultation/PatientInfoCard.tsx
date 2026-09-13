import React, { useState } from 'react';
import { EditablePatientInfo } from '../../types/consultation';
import { Edit2, Check, UserCheck, ShieldCheck, X, Plus, User, Stethoscope } from 'lucide-react';

interface PatientInfoCardProps {
  patientInfo: EditablePatientInfo;
  onUpdatePatientInfo: (updated: EditablePatientInfo) => void;
  isConfirmed?: boolean;
  onToggleConfirm?: () => void;
}

export const PatientInfoCard: React.FC<PatientInfoCardProps> = ({
  patientInfo,
  onUpdatePatientInfo,
  isConfirmed = true,
  onToggleConfirm,
}) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const startEdit = (field: string, initialVal: string) => {
    setEditingField(field);
    setTempValue(initialVal);
  };

  const saveEdit = (field: keyof EditablePatientInfo) => {
    const updated = { ...patientInfo };

    if (field === 'age') {
      const num = parseInt(tempValue, 10);
      updated.age = isNaN(num) ? patientInfo.age : num;
    } else if (
      field === 'ongoingConditions' ||
      field === 'currentMedications' ||
      field === 'allergies' ||
      field === 'previousConditions'
    ) {
      const items = tempValue
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.toLowerCase() !== 'none' && s.toLowerCase() !== 'no known allergies');
      (updated as any)[field] = items;
    } else if (
      field === 'name' ||
      field === 'gender' ||
      field === 'dob' ||
      field === 'patientId' ||
      field === 'otherHealthInfo'
    ) {
      (updated as any)[field] = tempValue.trim() || (patientInfo as any)[field];
    }

    onUpdatePatientInfo(updated);
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  return (
    <div className="w-full space-y-6">
      {/* Intro message */}
      <div className="text-center max-w-xl mx-auto space-y-2 mb-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232142] tracking-tight">
          Let's start with a few details.
        </h2>
        <p className="text-sm sm:text-base text-[#65618A] leading-relaxed">
          Some of your information is already available. Please check that everything looks correct, or edit any details below.
        </p>
      </div>

      {/* Grouped Card 1: 👤 PERSONAL DETAILS */}
      <div
        id="card-personal-details"
        className="w-full bg-white rounded-3xl border border-[#E3E0F3] p-6 sm:p-7 shadow-[0_4px_24px_rgba(76,73,158,0.05)] transition-all"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EDFA] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F0EEFA] text-[#4C499E] flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#232142]">
                Personal Details
              </h3>
              <p className="text-xs text-[#7B779E] font-medium">
                Auto-populated from your MediKiosk profile
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-[#4C499E] bg-[#EDEAFB] px-3 py-1 rounded-full border border-[#DCD7F5]">
            Profile Verified
          </span>
        </div>

        <div className="divide-y divide-[#F5F3FC] text-sm">
          {/* Full Name */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="w-1/3 sm:w-1/4">
              <span className="text-xs font-semibold text-[#7C789C]">Full Name</span>
            </div>
            <div className="flex-1 min-w-0">
              {editingField === 'name' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full text-sm font-bold text-[#232142] bg-[#FAF8FE] border border-[#4C499E] rounded-xl px-3 py-1.5 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => saveEdit('name')}
                    className="p-2 bg-[#4C499E] text-white rounded-xl hover:bg-[#3B3885] cursor-pointer"
                    title="Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-2 bg-gray-100 text-[#6B688E] rounded-xl hover:bg-gray-200 cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-sm font-bold text-[#232142] block truncate">
                  {patientInfo.name}
                </span>
              )}
            </div>
            {editingField !== 'name' && (
              <button
                type="button"
                onClick={() => startEdit('name', patientInfo.name)}
                className="text-xs font-semibold text-[#4C499E] hover:text-[#37347A] hover:bg-[#F2EFFB] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* Age */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="w-1/3 sm:w-1/4">
              <span className="text-xs font-semibold text-[#7C789C]">Age</span>
            </div>
            <div className="flex-1 min-w-0">
              {editingField === 'age' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-28 text-sm font-bold text-[#232142] bg-[#FAF8FE] border border-[#4C499E] rounded-xl px-3 py-1.5 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => saveEdit('age')}
                    className="p-2 bg-[#4C499E] text-white rounded-xl hover:bg-[#3B3885] cursor-pointer"
                    title="Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-2 bg-gray-100 text-[#6B688E] rounded-xl hover:bg-gray-200 cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-sm font-bold text-[#232142]">
                  {patientInfo.age} years
                </span>
              )}
            </div>
            {editingField !== 'age' && (
              <button
                type="button"
                onClick={() => startEdit('age', String(patientInfo.age))}
                className="text-xs font-semibold text-[#4C499E] hover:text-[#37347A] hover:bg-[#F2EFFB] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* Patient ID / ABHA ID */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="w-1/3 sm:w-1/4">
              <span className="text-xs font-semibold text-[#7C789C]">Patient ID / ABHA</span>
            </div>
            <div className="flex-1 min-w-0">
              {editingField === 'patientId' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full text-sm font-bold text-[#232142] bg-[#FAF8FE] border border-[#4C499E] rounded-xl px-3 py-1.5 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => saveEdit('patientId')}
                    className="p-2 bg-[#4C499E] text-white rounded-xl hover:bg-[#3B3885] cursor-pointer"
                    title="Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-2 bg-gray-100 text-[#6B688E] rounded-xl hover:bg-gray-200 cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-sm font-mono font-semibold text-[#4C499E]">
                  {patientInfo.patientId || '•••• 4821'}
                </span>
              )}
            </div>
            {editingField !== 'patientId' && (
              <button
                type="button"
                onClick={() => startEdit('patientId', patientInfo.patientId || '•••• 4821')}
                className="text-xs font-semibold text-[#4C499E] hover:text-[#37347A] hover:bg-[#F2EFFB] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* Gender */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="w-1/3 sm:w-1/4">
              <span className="text-xs font-semibold text-[#7C789C]">Gender</span>
            </div>
            <div className="flex-1 min-w-0">
              {editingField === 'gender' ? (
                <div className="flex items-center gap-2">
                  <select
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="text-sm font-bold text-[#232142] bg-[#FAF8FE] border border-[#4C499E] rounded-xl px-3 py-1.5 focus:outline-none"
                    autoFocus
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => saveEdit('gender')}
                    className="p-2 bg-[#4C499E] text-white rounded-xl hover:bg-[#3B3885] cursor-pointer"
                    title="Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-2 bg-gray-100 text-[#6B688E] rounded-xl hover:bg-gray-200 cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-sm font-bold text-[#232142]">
                  {patientInfo.gender}
                </span>
              )}
            </div>
            {editingField !== 'gender' && (
              <button
                type="button"
                onClick={() => startEdit('gender', patientInfo.gender)}
                className="text-xs font-semibold text-[#4C499E] hover:text-[#37347A] hover:bg-[#F2EFFB] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* Date of Birth */}
          <div className="py-3.5 flex items-center justify-between gap-4">
            <div className="w-1/3 sm:w-1/4">
              <span className="text-xs font-semibold text-[#7C789C]">Date of Birth</span>
            </div>
            <div className="flex-1 min-w-0">
              {editingField === 'dob' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    className="w-full text-sm font-bold text-[#232142] bg-[#FAF8FE] border border-[#4C499E] rounded-xl px-3 py-1.5 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => saveEdit('dob')}
                    className="p-2 bg-[#4C499E] text-white rounded-xl hover:bg-[#3B3885] cursor-pointer"
                    title="Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="p-2 bg-gray-100 text-[#6B688E] rounded-xl hover:bg-gray-200 cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <span className="text-sm font-semibold text-[#232142]">
                  {patientInfo.dob || '14 Aug 2002'}
                </span>
              )}
            </div>
            {editingField !== 'dob' && (
              <button
                type="button"
                onClick={() => startEdit('dob', patientInfo.dob || '14 Aug 2002')}
                className="text-xs font-semibold text-[#4C499E] hover:text-[#37347A] hover:bg-[#F2EFFB] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grouped Card 2: 🩺 HEALTH DETAILS */}
      <div
        id="card-health-details"
        className="w-full bg-white rounded-3xl border border-[#E3E0F3] p-6 sm:p-7 shadow-[0_4px_24px_rgba(76,73,158,0.05)] transition-all"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EDFA] mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F0EEFA] text-[#4C499E] flex items-center justify-center font-bold">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#232142]">
                Health Details & Background
              </h3>
              <p className="text-xs text-[#7B779E] font-medium">
                Medical background available to the reviewing clinician
              </p>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-[#2BA055] bg-[#EBF7EE] px-3 py-1 rounded-full border border-[#CCE8D4]">
            Records Synchronized
          </span>
        </div>

        <div className="divide-y divide-[#F5F3FC] text-sm">
          {/* Known Allergies */}
          <div className="py-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#44406B] uppercase tracking-wider">
                Known Allergies
              </span>
              {editingField !== 'allergies' && (
                <button
                  type="button"
                  onClick={() =>
                    startEdit(
                      'allergies',
                      patientInfo.allergies && patientInfo.allergies.length > 0
                        ? patientInfo.allergies.join(', ')
                        : ''
                    )
                  }
                  className="text-xs font-semibold text-[#4C499E] hover:text-[#37347A] hover:bg-[#F2EFFB] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{patientInfo.allergies && patientInfo.allergies.length > 0 ? 'Edit' : '+ Add'}</span>
                </button>
              )}
            </div>

            {editingField === 'allergies' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempValue}
                  placeholder="e.g. Penicillin, Peanuts, Sulfa (separate with comma)"
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full text-sm text-[#232142] bg-[#FAF8FE] border border-[#4C499E] rounded-xl px-3 py-2 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => saveEdit('allergies')}
                  className="p-2 bg-[#4C499E] text-white rounded-xl hover:bg-[#3B3885] cursor-pointer"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="p-2 bg-gray-100 text-[#6B688E] rounded-xl hover:bg-gray-200 cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : patientInfo.allergies && patientInfo.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {patientInfo.allergies.map((allergy, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold text-[#C91A39] bg-[#FEECEF] border border-[#F8CCD3] px-2.5 py-1 rounded-lg"
                  >
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8A86AA] italic">No known allergies added</p>
            )}
          </div>

          {/* Current / Ongoing Health Problems */}
          <div className="py-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#44406B] uppercase tracking-wider">
                Current / Ongoing Health Problems
              </span>
              {editingField !== 'ongoingConditions' && (
                <button
                  type="button"
                  onClick={() =>
                    startEdit(
                      'ongoingConditions',
                      patientInfo.ongoingConditions && patientInfo.ongoingConditions.length > 0
                        ? patientInfo.ongoingConditions.join(', ')
                        : ''
                    )
                  }
                  className="text-xs font-semibold text-[#4C499E] hover:text-[#37347A] hover:bg-[#F2EFFB] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>
                    {patientInfo.ongoingConditions && patientInfo.ongoingConditions.length > 0
                      ? 'Edit'
                      : '+ Add'}
                  </span>
                </button>
              )}
            </div>

            {editingField === 'ongoingConditions' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempValue}
                  placeholder="e.g. Hypertension, Jaundice, Type 2 Diabetes"
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full text-sm text-[#232142] bg-[#FAF8FE] border border-[#4C499E] rounded-xl px-3 py-2 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => saveEdit('ongoingConditions')}
                  className="p-2 bg-[#4C499E] text-white rounded-xl hover:bg-[#3B3885] cursor-pointer"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="p-2 bg-gray-100 text-[#6B688E] rounded-xl hover:bg-gray-200 cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : patientInfo.ongoingConditions && patientInfo.ongoingConditions.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {patientInfo.ongoingConditions.map((cond, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold text-[#4C499E] bg-[#EDEAFB] border border-[#DCD7F5] px-2.5 py-1 rounded-lg"
                  >
                    {cond}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8A86AA] italic">No ongoing conditions added</p>
            )}
          </div>

          {/* Current Medications */}
          <div className="py-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#44406B] uppercase tracking-wider">
                Current Medications
              </span>
              {editingField !== 'currentMedications' && (
                <button
                  type="button"
                  onClick={() =>
                    startEdit(
                      'currentMedications',
                      patientInfo.currentMedications && patientInfo.currentMedications.length > 0
                        ? patientInfo.currentMedications.join(', ')
                        : ''
                    )
                  }
                  className="text-xs font-semibold text-[#4C499E] hover:text-[#37347A] hover:bg-[#F2EFFB] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>
                    {patientInfo.currentMedications && patientInfo.currentMedications.length > 0
                      ? 'Edit'
                      : '+ Add'}
                  </span>
                </button>
              )}
            </div>

            {editingField === 'currentMedications' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempValue}
                  placeholder="e.g. Silymarin 140mg, Paracetamol 500mg"
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full text-sm text-[#232142] bg-[#FAF8FE] border border-[#4C499E] rounded-xl px-3 py-2 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => saveEdit('currentMedications')}
                  className="p-2 bg-[#4C499E] text-white rounded-xl hover:bg-[#3B3885] cursor-pointer"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="p-2 bg-gray-100 text-[#6B688E] rounded-xl hover:bg-gray-200 cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : patientInfo.currentMedications && patientInfo.currentMedications.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {patientInfo.currentMedications.map((med, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold text-[#2D2A57] bg-[#F2EFFB] border border-[#DDD9F2] px-2.5 py-1 rounded-lg"
                  >
                    {med}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8A86AA] italic">No active medications added</p>
            )}
          </div>

          {/* Previous Important Medical Conditions */}
          <div className="py-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#44406B] uppercase tracking-wider">
                Previous Important Medical Conditions
              </span>
              {editingField !== 'previousConditions' && (
                <button
                  type="button"
                  onClick={() =>
                    startEdit(
                      'previousConditions',
                      patientInfo.previousConditions && patientInfo.previousConditions.length > 0
                        ? patientInfo.previousConditions.join(', ')
                        : ''
                    )
                  }
                  className="text-xs font-semibold text-[#4C499E] hover:text-[#37347A] hover:bg-[#F2EFFB] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>
                    {patientInfo.previousConditions && patientInfo.previousConditions.length > 0
                      ? 'Edit'
                      : '+ Add'}
                  </span>
                </button>
              )}
            </div>

            {editingField === 'previousConditions' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempValue}
                  placeholder="e.g. Viral Hepatitis (June 2026), Appendectomy (2021)"
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full text-sm text-[#232142] bg-[#FAF8FE] border border-[#4C499E] rounded-xl px-3 py-2 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => saveEdit('previousConditions')}
                  className="p-2 bg-[#4C499E] text-white rounded-xl hover:bg-[#3B3885] cursor-pointer"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="p-2 bg-gray-100 text-[#6B688E] rounded-xl hover:bg-gray-200 cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : patientInfo.previousConditions && patientInfo.previousConditions.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {patientInfo.previousConditions.map((cond, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold text-[#544F7D] bg-[#F5F4FD] border border-[#DFDCF5] px-2.5 py-1 rounded-lg"
                  >
                    {cond}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#8A86AA] italic">No previous conditions recorded</p>
            )}
          </div>

          {/* Other relevant health information */}
          <div className="py-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#44406B] uppercase tracking-wider">
                Other Relevant Health Information
              </span>
              {editingField !== 'otherHealthInfo' && (
                <button
                  type="button"
                  onClick={() =>
                    startEdit('otherHealthInfo', patientInfo.otherHealthInfo || '')
                  }
                  className="text-xs font-semibold text-[#4C499E] hover:text-[#37347A] hover:bg-[#F2EFFB] px-3 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>{patientInfo.otherHealthInfo ? 'Edit' : '+ Add'}</span>
                </button>
              )}
            </div>

            {editingField === 'otherHealthInfo' ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempValue}
                  placeholder="e.g. Non-smoker, vegetarian diet, regular exercise"
                  onChange={(e) => setTempValue(e.target.value)}
                  className="w-full text-sm text-[#232142] bg-[#FAF8FE] border border-[#4C499E] rounded-xl px-3 py-2 focus:outline-none"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => saveEdit('otherHealthInfo')}
                  className="p-2 bg-[#4C499E] text-white rounded-xl hover:bg-[#3B3885] cursor-pointer"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="p-2 bg-gray-100 text-[#6B688E] rounded-xl hover:bg-gray-200 cursor-pointer"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : patientInfo.otherHealthInfo ? (
              <p className="text-xs font-medium text-[#2E2B52]">
                {patientInfo.otherHealthInfo}
              </p>
            ) : (
              <p className="text-xs text-[#8A86AA] italic">Non-smoker, vegetarian diet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
