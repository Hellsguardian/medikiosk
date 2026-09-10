import React, { useState, useEffect } from 'react';
import {
  X,
  Mic,
  MicOff,
  Keyboard,
  Hand,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  AlertCircle,
  FileCheck,
  Activity,
  Heart,
  ShieldAlert,
} from 'lucide-react';
import { ConsultationIntake } from '../types';

interface NewConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIntake: (intake: ConsultationIntake) => void;
}

export const NewConsultationModal: React.FC<NewConsultationModalProps> = ({
  isOpen,
  onClose,
  onSubmitIntake,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [inputMode, setInputMode] = useState<'speak' | 'type' | 'touch'>('type');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);

  // Form State
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [painLocation, setPainLocation] = useState('Upper Abdomen');
  const [onsetDate, setOnsetDate] = useState('4 days ago');
  const [painSeverity, setPainSeverity] = useState(6);
  const [painCharacter, setPainCharacter] = useState('Dull continuous ache with occasional cramps');
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([
    'Loss of appetite',
    'Mild nausea',
  ]);
  const [feverPresent, setFeverPresent] = useState(false);

  // Quick suggestion prompts
  const suggestedComplaints = [
    'I have abdominal pain since 4 days.',
    'Recurring headache and throbbing temple pain.',
    'Fever with chills and body ache.',
    'Persistent dry cough and throat irritation.',
    'Chest discomfort after walking or exertion.',
  ];

  // Touch locations
  const bodyRegions = [
    { id: 'abdomen', name: 'Abdomen / Stomach', desc: 'Belly, navel, or lower ribs' },
    { id: 'head', name: 'Head & Neck', desc: 'Forehead, temples, or cervical' },
    { id: 'chest', name: 'Chest & Breathing', desc: 'Sternum, ribcage, or heart area' },
    { id: 'back', name: 'Back & Spine', desc: 'Lower lumbar, mid-back, or shoulders' },
    { id: 'limbs', name: 'Joints & Limbs', desc: 'Knees, ankles, arms, or legs' },
  ];

  const symptomOptions = [
    'Loss of appetite',
    'Mild nausea',
    'Vomiting',
    'High fever',
    'Dizziness / Weakness',
    'Yellowish eyes or urine',
    'Sleep disruption',
  ];

  // Voice recording simulation
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTimer((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTimer(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      // Try Web Speech API if supported in browser
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        try {
          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-IN';
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setChiefComplaint(transcript);
            setIsRecording(false);
          };
          recognition.onerror = () => {
            // fallback simulated speech
            setTimeout(() => {
              setChiefComplaint("I've had abdominal pain for 4 days with nausea.");
              setIsRecording(false);
            }, 3000);
          };
          recognition.start();
        } catch {
          // fallback
          setTimeout(() => {
            setChiefComplaint("I've had abdominal pain for 4 days with nausea.");
            setIsRecording(false);
          }, 2500);
        }
      } else {
        setTimeout(() => {
          setChiefComplaint("I've had abdominal pain for 4 days with nausea.");
          setIsRecording(false);
        }, 2500);
      }
    } else {
      setIsRecording(false);
    }
  };

  const toggleSymptom = (symp: string) => {
    setAssociatedSymptoms((prev) =>
      prev.includes(symp) ? prev.filter((s) => s !== symp) : [...prev, symp]
    );
  };

  const handleFinish = () => {
    const intake: ConsultationIntake = {
      id: `intake-${Date.now()}`,
      chiefComplaint: chiefComplaint || "Abdominal pain for 4 days",
      onsetDate,
      painLocation,
      painSeverity,
      associatedSymptoms,
      intakeMethod: inputMode,
      status: 'Submitted to Doctor',
      aiStructuredSummary: `Patient reports ${painLocation} discomfort lasting ${onsetDate}. Severity graded ${painSeverity}/10 with character described as "${painCharacter}". Co-occurring symptoms include ${associatedSymptoms.join(', ')}. Clinical intake structured for gastroenterology consultation triage.`,
      submittedAt: 'Just now (09 Sep 2026, 14:45)',
    };
    onSubmitIntake(intake);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-mk-text-primary/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="new-consultation-modal"
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-[28px] shadow-2xl border border-mk-border overflow-hidden"
      >
        {/* Top Header */}
        <div className="p-6 pb-4 bg-mk-surface-tint border-b border-mk-border-light flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-mk-primary text-xs font-bold uppercase tracking-wider">
              <span>Guided Medical Interview</span>
              <span className="text-[11px] text-mk-text-muted">• Step {step} of 3</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-mk-text-primary mt-0.5">
              {step === 1 && 'What brings you here today?'}
              {step === 2 && 'Understanding your symptoms'}
              {step === 3 && 'Review your Consultation Intake'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-mk-text-muted hover:text-mk-text-primary hover:bg-mk-surface-secondary flex items-center justify-center border border-mk-border transition"
          >
            <X className="w-5 h-5" strokeWidth={1.8} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-mk-surface-secondary h-1.5">
          <div
            className="h-full bg-mk-primary transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: INITIAL CHIEF COMPLAINT */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Input Mode Selector: Speak, Type, Touch */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setInputMode('speak')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold border transition ${
                    inputMode === 'speak'
                      ? 'bg-mk-lavender-pale text-mk-primary-dark border-mk-primary shadow-2xs'
                      : 'bg-white text-mk-text-secondary border-mk-border hover:bg-mk-surface-secondary'
                  }`}
                >
                  <Mic className="w-4 h-4" strokeWidth={1.8} />
                  <span>Speak</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('type')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold border transition ${
                    inputMode === 'type'
                      ? 'bg-mk-lavender-pale text-mk-primary-dark border-mk-primary shadow-2xs'
                      : 'bg-white text-mk-text-secondary border-mk-border hover:bg-mk-surface-secondary'
                  }`}
                >
                  <Keyboard className="w-4 h-4" strokeWidth={1.8} />
                  <span>Type</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputMode('touch')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold border transition ${
                    inputMode === 'touch'
                      ? 'bg-mk-lavender-pale text-mk-primary-dark border-mk-primary shadow-2xs'
                      : 'bg-white text-mk-text-secondary border-mk-border hover:bg-mk-surface-secondary'
                  }`}
                >
                  <Hand className="w-4 h-4" strokeWidth={1.8} />
                  <span>Touch Body Area</span>
                </button>
              </div>

              {/* SPEAK INTERACTION */}
              {inputMode === 'speak' && (
                <div className="text-center py-6 px-4 bg-mk-surface-secondary rounded-2xl border border-mk-border-light">
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={toggleRecording}
                      className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all ${
                        isRecording
                          ? 'bg-mk-primary text-white ring-8 ring-mk-primary/20 animate-pulse'
                          : 'bg-mk-lavender-pale text-mk-primary-dark hover:bg-mk-lavender-light'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-8 h-8" strokeWidth={1.8} /> : <Mic className="w-8 h-8" strokeWidth={1.8} />}
                    </button>
                  </div>
                  <div className="text-sm font-semibold text-mk-text-primary">
                    {isRecording ? `Listening... (${recordingTimer}s)` : 'Tap the microphone & speak your concern'}
                  </div>
                  <p className="text-xs text-mk-text-muted mt-1 max-w-sm mx-auto">
                    Speak in English, Hindi, or your preferred language. MediKiosk will transcribe and organize your words.
                  </p>
                </div>
              )}

              {/* TOUCH BODY AREA INTERACTION */}
              {inputMode === 'touch' && (
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-mk-text-secondary uppercase tracking-wider">
                    Select the affected body region
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {bodyRegions.map((region) => (
                      <button
                        key={region.id}
                        type="button"
                        onClick={() => {
                          setPainLocation(region.name);
                          if (!chiefComplaint) {
                            setChiefComplaint(`Discomfort located in ${region.name}.`);
                          }
                        }}
                        className={`p-3 rounded-2xl border text-left transition flex items-start justify-between ${
                          painLocation === region.name
                            ? 'bg-mk-surface-secondary border-mk-primary ring-1 ring-mk-primary'
                            : 'bg-white border-mk-border hover:bg-mk-surface-secondary'
                        }`}
                      >
                        <div>
                          <div className="font-bold text-xs text-mk-text-primary">{region.name}</div>
                          <div className="text-[11px] text-mk-text-muted">{region.desc}</div>
                        </div>
                        {painLocation === region.name && <Check className="w-4 h-4 text-mk-primary" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Input Text Area */}
              <div>
                <label className="block text-xs font-bold uppercase text-mk-text-secondary tracking-wider mb-2">
                  Describe what you are feeling:
                </label>
                <textarea
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  placeholder="Example: I've had abdominal pain for 4 days, especially after meals..."
                  rows={3}
                  className="w-full p-4 rounded-2xl border border-mk-border focus:border-mk-primary focus:ring-2 focus:ring-mk-primary/15 text-sm text-mk-text-primary placeholder-mk-text-muted outline-none transition"
                />
              </div>

              {/* Quick suggestion chips */}
              <div>
                <div className="text-[11px] font-semibold text-mk-text-muted uppercase tracking-wider mb-2">
                  Common descriptions (Tap to apply):
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedComplaints.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setChiefComplaint(item)}
                      className="text-xs px-3 py-1.5 rounded-full bg-mk-surface-secondary hover:bg-mk-lavender-pale text-mk-primary-dark border border-mk-border-light text-left transition"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: ADAPTIVE MEDICAL HISTORY TAKING */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Question 1: Duration */}
              <div>
                <label className="block text-xs font-bold uppercase text-mk-text-secondary tracking-wider mb-2">
                  1. When did this begin / symptom duration?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Today / Just started', '2 to 3 days', '4 to 7 days', 'More than 2 weeks'].map(
                    (dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setOnsetDate(dur)}
                        className={`p-2.5 rounded-xl text-xs font-semibold border transition text-center ${
                          onsetDate === dur
                            ? 'bg-mk-primary text-white border-mk-primary shadow-xs'
                            : 'bg-white text-mk-text-primary border-mk-border hover:bg-mk-surface-secondary'
                        }`}
                      >
                        {dur}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Question 2: Pain Severity Scale (1 - 10) */}
              <div className="p-4 rounded-2xl bg-mk-surface-secondary border border-mk-border-light">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase text-mk-text-secondary tracking-wider">
                    2. Pain Severity (1 to 10)
                  </label>
                  <span className="text-sm font-bold text-mk-primary bg-mk-lavender-pale px-3 py-0.5 rounded-full">
                    {painSeverity} / 10 -{' '}
                    {painSeverity <= 3
                      ? 'Mild Discomfort'
                      : painSeverity <= 6
                      ? 'Moderate Pain'
                      : painSeverity <= 8
                      ? 'Severe Pain'
                      : 'Very Severe'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painSeverity}
                  onChange={(e) => setPainSeverity(Number(e.target.value))}
                  className="w-full accent-mk-primary cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-mk-text-muted mt-1.5">
                  <span>1 (Barely noticeable)</span>
                  <span>5 (Noticeable, interferes with work)</span>
                  <span>10 (Unbearable)</span>
                </div>
              </div>

              {/* Question 3: Character of Discomfort */}
              <div>
                <label className="block text-xs font-bold uppercase text-mk-text-secondary tracking-wider mb-2">
                  3. What does the discomfort feel like?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Dull continuous ache',
                    'Sharp stabbing / piercing',
                    'Burning or acidic sensation',
                    'Cramping / Spasmodic waves',
                  ].map((char) => (
                    <button
                      key={char}
                      type="button"
                      onClick={() => setPainCharacter(char)}
                      className={`p-2.5 rounded-xl text-xs font-medium border text-left transition flex items-center justify-between ${
                        painCharacter === char
                          ? 'bg-mk-lavender-very-pale text-mk-primary-dark border-mk-primary font-semibold'
                          : 'bg-white text-mk-text-primary border-mk-border hover:bg-mk-surface-secondary'
                      }`}
                    >
                      <span>{char}</span>
                      {painCharacter === char && <Check className="w-4 h-4 text-mk-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Associated Symptoms */}
              <div>
                <label className="block text-xs font-bold uppercase text-mk-text-secondary tracking-wider mb-2">
                  4. Any associated symptoms? (Tap all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {symptomOptions.map((symp) => {
                    const isSelected = associatedSymptoms.includes(symp);
                    return (
                      <button
                        key={symp}
                        type="button"
                        onClick={() => toggleSymptom(symp)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                          isSelected
                            ? 'bg-mk-primary text-white border-mk-primary'
                            : 'bg-white text-mk-text-primary border-mk-border hover:bg-mk-surface-secondary'
                        }`}
                      >
                        {symp}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: STRUCTURED CLINICAL INTAKE DRAFT REVIEW */}
          {step === 3 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-mk-surface-secondary border border-mk-border-light">
                <div className="flex items-center gap-2 text-mk-primary text-xs font-bold uppercase tracking-wider mb-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Structured Clinical Intake Summary</span>
                </div>
                <p className="text-xs text-mk-text-secondary">
                  This draft will be sent directly to your doctor&apos;s terminal ahead of your OPD visit.
                </p>
              </div>

              {/* Structured Summary Box */}
              <div className="p-5 rounded-2xl bg-white border border-mk-border space-y-3.5 text-xs text-mk-text-primary shadow-xs">
                <div className="flex items-start justify-between pb-2.5 border-b border-mk-border-light">
                  <span className="text-mk-text-muted font-medium">Chief Complaint:</span>
                  <span className="font-bold text-right max-w-xs">{chiefComplaint || 'Abdominal pain'}</span>
                </div>

                <div className="flex items-start justify-between pb-2.5 border-b border-mk-border-light">
                  <span className="text-mk-text-muted font-medium">Onset & Duration:</span>
                  <span className="font-bold">{onsetDate}</span>
                </div>

                <div className="flex items-start justify-between pb-2.5 border-b border-mk-border-light">
                  <span className="text-mk-text-muted font-medium">Location:</span>
                  <span className="font-bold">{painLocation}</span>
                </div>

                <div className="flex items-start justify-between pb-2.5 border-b border-mk-border-light">
                  <span className="text-mk-text-muted font-medium">Severity & Nature:</span>
                  <span className="font-bold">
                    {painSeverity}/10 ({painCharacter})
                  </span>
                </div>

                <div className="flex items-start justify-between">
                  <span className="text-mk-text-muted font-medium">Associated Symptoms:</span>
                  <div className="flex flex-wrap justify-end gap-1 max-w-xs">
                    {associatedSymptoms.length > 0 ? (
                      associatedSymptoms.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-mk-surface-secondary text-[11px] font-semibold text-mk-primary-dark">
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="font-bold">None reported</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Doctor Review Note */}
              <div className="p-3.5 rounded-xl bg-[#FFFDF5] border border-[#F6E9C8] flex items-start gap-2.5 text-xs text-[#52411C]">
                <AlertCircle className="w-4 h-4 text-[#A87212] flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Clinical Notice:</strong> This preliminary intake is an AI-assisted intake draft designed to save clinic waiting time. It will be verified by the consulting doctor before diagnosis or treatment orders.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 px-6 bg-mk-surface-secondary border-t border-mk-border flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-mk-text-secondary hover:text-mk-text-primary hover:bg-mk-lavender-pale transition"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.8} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev + 1) as any)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-mk-primary hover:bg-mk-primary-hover text-white text-xs font-semibold shadow-xs transition"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.8} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center gap-2 px-7 py-2.5 rounded-full bg-mk-primary hover:bg-mk-primary-hover text-white text-xs font-bold shadow-xs transition"
            >
              <Check className="w-4 h-4" strokeWidth={2} />
              <span>Submit to Doctor&apos;s Queue</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
