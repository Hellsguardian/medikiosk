import React, { useState } from 'react';
import { EditablePatientInfo } from '../../../types/consultation';
import { ArrowRight, User, Hash, ShieldCheck, Sparkles } from 'lucide-react';

interface Stage1PersonalDetailsProps {
  patientInfo: EditablePatientInfo;
  onUpdate: (updated: EditablePatientInfo) => void;
  onContinue: () => void;
}

export const Stage1PersonalDetails: React.FC<Stage1PersonalDetailsProps> = ({
  patientInfo,
  onUpdate,
  onContinue,
}) => {
  const [name, setName] = useState(patientInfo.name || 'Ramesh Kumar');
  const [age, setAge] = useState<string>(String(patientInfo.age || 46));
  const [gender, setGender] = useState(patientInfo.gender || 'Male');
  const [patientId, setPatientId] = useState(patientInfo.patientId || '•••• 4821');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 125) {
      setError('Please enter a valid age.');
      return;
    }
    setError(null);

    onUpdate({
      ...patientInfo,
      name: name.trim(),
      age: ageNum,
      gender,
      patientId: patientId.trim() || '•••• 4821',
      isConfirmed: true,
    });
    onContinue();
  };

  return (
    <div
      id="stage-1-personal-details"
      className="w-full consultation-responsive-container animate-in fade-in slide-in-from-bottom-2 duration-300"
    >
      <div className="bg-white rounded-3xl border border-[#DFDCF5] p-6 sm:p-10 shadow-[0_8px_30px_rgba(76,73,158,0.06)] relative overflow-hidden">
        {/* Soft background tint accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#F2EFFC] to-transparent rounded-bl-full pointer-events-none -z-0 opacity-70" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center sm:text-left space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EDEAFB] text-[#4C499E] text-xs font-bold uppercase tracking-wider mb-1">
              <User className="w-3.5 h-3.5" />
              <span>Stage 1 of 4 • Personal Details</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#232142] tracking-tight">
              Let&apos;s start with you
            </h2>
            <p className="text-sm text-[#6C6891] leading-relaxed">
              These details are pre-filled from your profile. You can edit them if needed.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-[#FDF2F4] border border-[#F9C3CD] text-[#C01B39] rounded-2xl text-xs font-semibold animate-in fade-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="patient-full-name"
                className="block text-xs font-bold uppercase tracking-wider text-[#4E4A7D] mb-1.5"
              >
                Full Name
              </label>
              <div className="relative">
                <input
                  id="patient-full-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full text-base font-semibold px-4 py-3.5 rounded-2xl bg-[#FAF9FD] border border-[#DDD9F2] text-[#232142] placeholder-[#A09CBF] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4C499E] focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            {/* Age & Gender Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="patient-age"
                  className="block text-xs font-bold uppercase tracking-wider text-[#4E4A7D] mb-1.5"
                >
                  Age
                </label>
                <input
                  id="patient-age"
                  type="number"
                  min="1"
                  max="125"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="46"
                  className="w-full text-base font-semibold px-4 py-3.5 rounded-2xl bg-[#FAF9FD] border border-[#DDD9F2] text-[#232142] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4C499E] focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="patient-gender"
                  className="block text-xs font-bold uppercase tracking-wider text-[#4E4A7D] mb-1.5"
                >
                  Gender
                </label>
                <div className="relative">
                  <select
                    id="patient-gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full text-base font-semibold px-4 py-3.5 rounded-2xl bg-[#FAF9FD] border border-[#DDD9F2] text-[#232142] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4C499E] focus:border-transparent transition-all cursor-pointer appearance-none pr-10"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other / Prefer not to say</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#6C6891]">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient ID / ABHA */}
            <div>
              <label
                htmlFor="patient-abha-id"
                className="block text-xs font-bold uppercase tracking-wider text-[#4E4A7D] mb-1.5"
              >
                Patient ID / ABHA
              </label>
              <div className="relative">
                <input
                  id="patient-abha-id"
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="•••• 4821"
                  className="w-full text-base font-mono font-semibold px-4 py-3.5 rounded-2xl bg-[#FAF9FD] border border-[#DDD9F2] text-[#232142] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4C499E] focus:border-transparent transition-all"
                />
              </div>
              <p className="text-[11px] text-[#8682A7] mt-1 pl-1">
                Your Ayushman Bharat Health Account (ABHA) or hospital registration number.
              </p>
            </div>

            {/* Bottom CTA */}
            <div className="pt-4 flex items-center justify-end">
              <button
                type="submit"
                id="btn-stage-1-continue"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#4C499E] to-[#635FB8] hover:from-[#3D3A8A] hover:to-[#534EA6] text-white font-bold text-sm sm:text-base shadow-md shadow-[#4C499E]/25 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
