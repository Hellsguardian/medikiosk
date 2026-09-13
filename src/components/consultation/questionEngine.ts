import {
  ConsultationQuestion,
  ConversationTurn,
  ConsultationSummaryData,
  BodyRegionId,
  EditablePatientInfo,
} from '../../types/consultation';

export interface EngineContext {
  selectedRegions: BodyRegionId[];
  isOtherSelected?: boolean;
  initialDescription?: string;
  patientInfo?: EditablePatientInfo;
  answers: Record<string, any>; // questionId -> answer
  turns: ConversationTurn[];
}

export interface EngineResult {
  nextQuestion: ConsultationQuestion | null;
  aiTransitionMessage: string;
  isComplete: boolean;
  emergencyNotice?: string;
  currentProgressStage: string;
  progressPercent: number;
}

// Helper to extract duration from patient initial description text
// e.g. "I've had a headache for 4 days" -> 4 days
export const parseDurationFromText = (text?: string): { days?: number; label?: string } | null => {
  if (!text) return null;
  const lower = text.toLowerCase();

  const daysMatch = lower.match(/(?:for|since|past|about|around)?\s*(\d+)\s*(?:days?|day)/);
  if (daysMatch && daysMatch[1]) {
    const d = parseInt(daysMatch[1], 10);
    return { days: d, label: `${d} ${d === 1 ? 'day' : 'days'}` };
  }

  const weeksMatch = lower.match(/(?:for|since|past|about|around)?\s*(\d+)\s*(?:weeks?|wk)/);
  if (weeksMatch && weeksMatch[1]) {
    const w = parseInt(weeksMatch[1], 10);
    return { days: w * 7, label: `${w} ${w === 1 ? 'week' : 'weeks'}` };
  }

  if (lower.includes('yesterday') || lower.includes('since yesterday') || lower.includes('started today')) {
    return { days: 1, label: '1 day (started recently)' };
  }

  return null;
};

// Helper to format primary region name
export const getPrimaryRegionLabel = (regions: BodyRegionId[], isOther?: boolean): string => {
  if (isOther && regions.length === 0) return 'General / Other concern';
  if (regions.length === 0) return 'Health concern';
  const nameMap: Record<string, string> = {
    head: 'Head',
    face: 'Face',
    neck: 'Neck',
    'shoulder-left': 'Left shoulder',
    'shoulder-right': 'Right shoulder',
    chest: 'Chest',
    abdomen: 'Abdomen',
    'upper-back': 'Upper back',
    'lower-back': 'Lower back',
    buttocks: 'Buttocks',
    pelvis: 'Pelvis',
    'arm-left': 'Left arm',
    'arm-right': 'Right arm',
    'hand-left': 'Left hand',
    'hand-right': 'Right hand',
    'thigh-left': 'Left thigh',
    'thigh-right': 'Right thigh',
    'knee-left': 'Left knee',
    'knee-right': 'Right knee',
    'leg-left': 'Left calf',
    'leg-right': 'Right calf',
    'foot-left': 'Left foot',
    'foot-right': 'Right foot',
    back: 'Back',
    other: 'Other concern',
  };
  const labels = regions.map((r) => nameMap[r] || r);
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels[0]}, ${labels[1]} +${labels.length - 2} more`;
};

// Main Engine Evaluator
export const getNextQuestionForSession = (ctx: EngineContext): EngineResult => {
  const { selectedRegions, isOtherSelected, initialDescription, answers } = ctx;

  // Auto-inject duration if found in initial description and not yet populated
  if (initialDescription && answers['duration_slider'] === undefined) {
    const parsed = parseDurationFromText(initialDescription);
    if (parsed && parsed.days) {
      answers['duration_slider'] = parsed.days;
      answers['duration_auto_extracted'] = parsed.label;
    }
  }

  // Safety red flags check
  const severityVal = answers['pain_severity'];
  const hasChestTightness =
    answers['chest_sensation']?.id === 'heaviness_pressure' ||
    (answers['associated_symptoms'] || []).some((s: string) =>
      s.toLowerCase().includes('radiating to jaw') || s.toLowerCase().includes('difficulty breathing')
    );

  if (hasChestTightness && !answers['emergency_acknowledged']) {
    return {
      nextQuestion: null,
      aiTransitionMessage:
        'You reported chest pressure or breathing symptoms. Please review this safety advisory.',
      isComplete: false,
      emergencyNotice:
        'Sudden, severe chest pressure radiating to the arm, neck, or jaw can be a sign of a cardiac emergency. If this is sudden or accompanied by cold sweats or dizziness, call emergency services (112 / 911) or visit the nearest emergency room immediately.',
      currentProgressStage: 'Safety Advisory',
      progressPercent: 50,
    };
  }

  // Primary body area evaluation
  const primary = selectedRegions[0];

  if (!primary || isOtherSelected) {
    return getOtherFlow(ctx);
  }

  switch (primary) {
    case 'head':
      return getHeadFlow(ctx);
    case 'face':
      return getFaceFlow(ctx);
    case 'neck':
      return getNeckFlow(ctx);
    case 'chest':
      return getChestFlow(ctx);
    case 'abdomen':
      return getAbdomenFlow(ctx);
    case 'pelvis':
    case 'buttocks':
      return getPelvisFlow(ctx);
    case 'shoulder-left':
    case 'shoulder-right':
    case 'arm-left':
    case 'arm-right':
    case 'hand-left':
    case 'hand-right':
      return getArmHandFlow(ctx, primary);
    case 'thigh-left':
    case 'thigh-right':
    case 'knee-left':
    case 'knee-right':
    case 'leg-left':
    case 'leg-right':
    case 'foot-left':
    case 'foot-right':
      return getLegFootFlow(ctx, primary);
    case 'upper-back':
    case 'lower-back':
    case 'back':
      return getBackFlow(ctx);
    default:
      return getOtherFlow(ctx);
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. HEAD FLOW (Headache, Dizziness, Pressure, Migraine, Vision)
// ─────────────────────────────────────────────────────────────────────────────
const getHeadFlow = (ctx: EngineContext): EngineResult => {
  const { answers, initialDescription } = ctx;

  // Q1: What are you experiencing?
  if (!answers['head_problem']) {
    let intro = "Thanks! I see you've selected Head. Let's understand what's happening.";
    if (initialDescription) {
      intro = `Thanks! I noted your note: "${initialDescription}". Let's understand what you're experiencing with your head.`;
    }
    return {
      aiTransitionMessage: intro,
      currentProgressStage: 'Identifying Symptoms',
      progressPercent: 15,
      isComplete: false,
      nextQuestion: {
        id: 'head_problem',
        type: 'choice',
        prompt: 'What are you experiencing?',
        options: [
          { id: 'headache', label: 'Headache', emoji: '🤕' },
          { id: 'dizziness', label: 'Dizziness', emoji: '💫' },
          { id: 'pressure', label: 'Pressure', emoji: '🪨' },
          { id: 'migraine', label: 'Migraine-like symptoms', emoji: '⚡' },
          { id: 'vision', label: 'Vision-related discomfort', emoji: '👁️' },
          { id: 'other_head', label: 'Something else', emoji: '❓' },
        ],
      },
    };
  }

  // Q2: How would you describe the pain / discomfort? [ Mild ] [ Moderate ] [ Severe ]
  if (!answers['pain_severity']) {
    const probLabel = answers['head_problem']?.label || 'concern';
    return {
      aiTransitionMessage: `Got it. How would you describe the pain?`,
      currentProgressStage: 'Assessing Severity',
      progressPercent: 30,
      isComplete: false,
      nextQuestion: {
        id: 'pain_severity',
        type: 'choice',
        prompt: 'How would you describe the pain?',
        options: [
          { id: 'mild', label: 'Mild', description: 'Noticeable, but able to carry on normal activities' },
          { id: 'moderate', label: 'Moderate', description: 'Uncomfortable, interferes with focus and work' },
          { id: 'severe', label: 'Severe', description: 'Intense, hard to function, need to rest' },
        ],
      },
    };
  }

  // Q3: How long have you been experiencing it? (Slider: 1 day ── 10+ days)
  // Skipped dynamically if user already provided duration in initialDescription!
  if (answers['duration_slider'] === undefined) {
    return {
      aiTransitionMessage: 'How long have you been experiencing it?',
      currentProgressStage: 'Determining Timeline',
      progressPercent: 45,
      isComplete: false,
      nextQuestion: {
        id: 'duration_slider',
        type: 'slider',
        prompt: 'How long have you had it?',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 3,
        minLabel: '1 day',
        maxLabel: '10+ days',
        unit: 'days',
      },
    };
  }

  // Q4: Where exactly do you feel the pain?
  if (!answers['head_location']) {
    const durationNote = answers['duration_auto_extracted']
      ? `I noted you've had this for ${answers['duration_auto_extracted']}. `
      : '';
    return {
      aiTransitionMessage: `${durationNote}Where exactly do you feel the pain?`,
      currentProgressStage: 'Pinpointing Location',
      progressPercent: 60,
      isComplete: false,
      nextQuestion: {
        id: 'head_location',
        type: 'choice',
        prompt: 'Where exactly do you feel the pain?',
        options: [
          { id: 'forehead', label: 'Forehead & Brow', emoji: '🎯' },
          { id: 'temples', label: 'Temples (Sides of head)', emoji: '↔️' },
          { id: 'one_side', label: 'One side of head only', emoji: '🌓' },
          { id: 'back_head', label: 'Back of head & Base of skull', emoji: '🔙' },
          { id: 'behind_eyes', label: 'Behind the eyes', emoji: '👀' },
          { id: 'all_over', label: 'All over / Band around head', emoji: '🔄' },
        ],
      },
    };
  }

  // Q5: Does anything make it worse? (Checkboxes)
  if (!answers['aggravating_factors']) {
    return {
      aiTransitionMessage: 'Thanks. Does anything make it worse?',
      currentProgressStage: 'Identifying Triggers',
      progressPercent: 75,
      isComplete: false,
      nextQuestion: {
        id: 'aggravating_factors',
        type: 'multiselect',
        prompt: 'Does anything make it worse?',
        options: [
          { id: 'bright_light', label: 'Bright light' },
          { id: 'loud_sounds', label: 'Loud sounds' },
          { id: 'physical_activity', label: 'Physical activity' },
          { id: 'lack_of_sleep', label: 'Lack of sleep' },
          { id: 'stress', label: 'Stress' },
          { id: 'nothing_specific', label: 'Nothing specific' },
        ],
      },
    };
  }

  // Q6: Have you experienced this before? [ Yes ] [ No ]
  if (answers['previous_episodes'] === undefined) {
    return {
      aiTransitionMessage: 'Have you experienced this before?',
      currentProgressStage: 'Clinical History',
      progressPercent: 90,
      isComplete: false,
      nextQuestion: {
        id: 'previous_episodes',
        type: 'yesno',
        prompt: 'Have you experienced this before?',
        allowNotSure: true,
      },
    };
  }

  // Completed
  return {
    nextQuestion: null,
    aiTransitionMessage:
      'Thank you. We have gathered the key details for your healthcare professional.',
    isComplete: true,
    currentProgressStage: 'Information Recorded',
    progressPercent: 100,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. NECK FLOW
// ─────────────────────────────────────────────────────────────────────────────
const getNeckFlow = (ctx: EngineContext): EngineResult => {
  const { answers } = ctx;

  if (!answers['neck_problem']) {
    return {
      aiTransitionMessage: "Thanks! I see you've selected Neck. Let's understand what's happening.",
      currentProgressStage: 'Identifying Symptoms',
      progressPercent: 15,
      isComplete: false,
      nextQuestion: {
        id: 'neck_problem',
        type: 'choice',
        prompt: 'What are you experiencing in your neck?',
        options: [
          { id: 'stiffness', label: 'Stiff neck / Reduced movement', emoji: '🔒' },
          { id: 'muscle_spasm', label: 'Muscle soreness / Spasm', emoji: '🩹' },
          { id: 'sharp_pain', label: 'Sharp stabbing pain when turning', emoji: '⚡' },
          { id: 'radiating', label: 'Pain radiating into shoulders or arm', emoji: '〰️' },
          { id: 'other_neck', label: 'Dull constant ache', emoji: '☁️' },
        ],
      },
    };
  }

  if (!answers['pain_severity']) {
    return {
      aiTransitionMessage: 'How would you describe the pain?',
      currentProgressStage: 'Assessing Severity',
      progressPercent: 30,
      isComplete: false,
      nextQuestion: {
        id: 'pain_severity',
        type: 'choice',
        prompt: 'How would you describe the pain?',
        options: [
          { id: 'mild', label: 'Mild' },
          { id: 'moderate', label: 'Moderate' },
          { id: 'severe', label: 'Severe' },
        ],
      },
    };
  }

  if (answers['duration_slider'] === undefined) {
    return {
      aiTransitionMessage: 'How long have you had it?',
      currentProgressStage: 'Determining Timeline',
      progressPercent: 50,
      isComplete: false,
      nextQuestion: {
        id: 'duration_slider',
        type: 'slider',
        prompt: 'How long have you had it?',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 2,
        minLabel: '1 day',
        maxLabel: '10+ days',
        unit: 'days',
      },
    };
  }

  if (!answers['neck_triggers']) {
    return {
      aiTransitionMessage: 'Does anything trigger or make the neck discomfort worse?',
      currentProgressStage: 'Identifying Triggers',
      progressPercent: 75,
      isComplete: false,
      nextQuestion: {
        id: 'neck_triggers',
        type: 'multiselect',
        prompt: 'Any of these trigger or worsen it?',
        options: [
          { id: 'screen_work', label: 'Desk / Screen work' },
          { id: 'slept_awkwardly', label: 'Slept in awkward posture' },
          { id: 'lifting', label: 'Heavy lifting / Exercise' },
          { id: 'sudden_movement', label: 'Sudden head turn / Jerk' },
          { id: 'stress', label: 'Stress / Tension' },
          { id: 'none', label: 'Nothing specific' },
        ],
      },
    };
  }

  if (answers['previous_episodes'] === undefined) {
    return {
      aiTransitionMessage: 'Have you experienced this before?',
      currentProgressStage: 'Clinical History',
      progressPercent: 90,
      isComplete: false,
      nextQuestion: {
        id: 'previous_episodes',
        type: 'yesno',
        prompt: 'Have you experienced this before?',
      },
    };
  }

  return {
    nextQuestion: null,
    aiTransitionMessage: 'Thank you. All responses recorded.',
    isComplete: true,
    currentProgressStage: 'Information Recorded',
    progressPercent: 100,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. CHEST FLOW
// ─────────────────────────────────────────────────────────────────────────────
const getChestFlow = (ctx: EngineContext): EngineResult => {
  const { answers } = ctx;

  if (!answers['chest_sensation']) {
    return {
      aiTransitionMessage: "Thanks! I see you've selected Chest. Let's understand what's happening.",
      currentProgressStage: 'Identifying Symptoms',
      progressPercent: 15,
      isComplete: false,
      nextQuestion: {
        id: 'chest_sensation',
        type: 'choice',
        prompt: 'What are you experiencing?',
        options: [
          { id: 'burning_acid', label: 'Burning / Acid reflux / Heartburn', emoji: '🔥' },
          { id: 'sharp_breath', label: 'Sharp pain when breathing deeply', emoji: '🫁' },
          { id: 'cough_phlegm', label: 'Persistent cough or congestion', emoji: '🤧' },
          { id: 'heaviness_pressure', label: 'Heaviness or pressure', emoji: '⚠️' },
          { id: 'muscle_rib', label: 'Tender muscle or rib soreness', emoji: '🩹' },
          { id: 'shortness_breath', label: 'Shortness of breath with exertion', emoji: '💨' },
        ],
      },
    };
  }

  if (!answers['pain_severity']) {
    return {
      aiTransitionMessage: 'How would you describe the discomfort?',
      currentProgressStage: 'Assessing Severity',
      progressPercent: 35,
      isComplete: false,
      nextQuestion: {
        id: 'pain_severity',
        type: 'choice',
        prompt: 'How would you describe the pain?',
        options: [
          { id: 'mild', label: 'Mild' },
          { id: 'moderate', label: 'Moderate' },
          { id: 'severe', label: 'Severe' },
        ],
      },
    };
  }

  if (answers['duration_slider'] === undefined) {
    return {
      aiTransitionMessage: 'How long have you had it?',
      currentProgressStage: 'Determining Timeline',
      progressPercent: 55,
      isComplete: false,
      nextQuestion: {
        id: 'duration_slider',
        type: 'slider',
        prompt: 'How long have you been experiencing it?',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 2,
        minLabel: '1 day',
        maxLabel: '10+ days',
        unit: 'days',
      },
    };
  }

  if (!answers['chest_timing']) {
    return {
      aiTransitionMessage: 'When is this sensation most noticeable?',
      currentProgressStage: 'Context & Timing',
      progressPercent: 75,
      isComplete: false,
      nextQuestion: {
        id: 'chest_timing',
        type: 'choice',
        prompt: 'When is it most noticeable?',
        options: [
          { id: 'after_meals', label: 'After eating / Lying down' },
          { id: 'deep_breath', label: 'When taking deep breaths or coughing' },
          { id: 'physical_exertion', label: 'During physical exertion or walking' },
          { id: 'constant', label: 'Constant throughout the day' },
          { id: 'random', label: 'Occurs intermittently without pattern' },
        ],
      },
    };
  }

  if (answers['previous_episodes'] === undefined) {
    return {
      aiTransitionMessage: 'Have you experienced this before?',
      currentProgressStage: 'Clinical History',
      progressPercent: 90,
      isComplete: false,
      nextQuestion: {
        id: 'previous_episodes',
        type: 'yesno',
        prompt: 'Have you experienced this before?',
      },
    };
  }

  return {
    nextQuestion: null,
    aiTransitionMessage: 'Thank you. All responses recorded.',
    isComplete: true,
    currentProgressStage: 'Information Recorded',
    progressPercent: 100,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 1B. FACE FLOW (Sinuses, Jaw, Facial pain)
// ─────────────────────────────────────────────────────────────────────────────
const getFaceFlow = (ctx: EngineContext): EngineResult => {
  const { answers, initialDescription } = ctx;

  if (!answers['face_problem']) {
    let intro = "Thanks! I see you've selected Face. Let's understand what's happening.";
    if (initialDescription) {
      intro = `Thanks! I noted your concern: "${initialDescription}". Let's explore what you're experiencing with your face.`;
    }
    return {
      aiTransitionMessage: intro,
      currentProgressStage: 'Identifying Symptoms',
      progressPercent: 15,
      isComplete: false,
      nextQuestion: {
        id: 'face_problem',
        type: 'choice',
        prompt: 'What are you experiencing in your face?',
        options: [
          { id: 'sinus_pressure', label: 'Sinus pressure or congestion', emoji: '👃' },
          { id: 'jaw_dental', label: 'Jaw or dental pain', emoji: '🦷' },
          { id: 'eye_orbit', label: 'Pain around eyes or brow', emoji: '👁️' },
          { id: 'facial_numbness', label: 'Numbness, tingling or twitching', emoji: '⚡' },
          { id: 'skin_rash', label: 'Skin irritation, swelling, or rash', emoji: '🩹' },
          { id: 'other_face', label: 'Other facial discomfort', emoji: '❓' },
        ],
      },
    };
  }

  if (!answers['pain_severity']) {
    return {
      aiTransitionMessage: 'How would you describe the discomfort?',
      currentProgressStage: 'Assessing Severity',
      progressPercent: 35,
      isComplete: false,
      nextQuestion: {
        id: 'pain_severity',
        type: 'choice',
        prompt: 'How would you describe the pain?',
        options: [
          { id: 'mild', label: 'Mild' },
          { id: 'moderate', label: 'Moderate' },
          { id: 'severe', label: 'Severe' },
        ],
      },
    };
  }

  if (!answers['face_location']) {
    return {
      aiTransitionMessage: 'Where on your face do you feel it most?',
      currentProgressStage: 'Pinpointing Location',
      progressPercent: 55,
      isComplete: false,
      nextQuestion: {
        id: 'face_location',
        type: 'body-part',
        prompt: 'Where exactly is the discomfort located?',
        options: [
          { id: 'sinuses_forehead', label: 'Forehead & Sinuses' },
          { id: 'around_eyes', label: 'Around eyes or temples' },
          { id: 'cheeks', label: 'Cheeks / Mid-face' },
          { id: 'jaw_chin', label: 'Jaw or chin' },
          { id: 'one_side', label: 'One side only' },
          { id: 'entire_face', label: 'Entire face' },
        ],
      },
    };
  }

  if (answers['duration_slider'] === undefined) {
    return {
      aiTransitionMessage: 'How long have you had it?',
      currentProgressStage: 'Determining Timeline',
      progressPercent: 75,
      isComplete: false,
      nextQuestion: {
        id: 'duration_slider',
        type: 'duration',
        prompt: 'How long have you had it?',
      },
    };
  }

  if (answers['previous_episodes'] === undefined) {
    return {
      aiTransitionMessage: 'Have you experienced this before?',
      currentProgressStage: 'Clinical History',
      progressPercent: 90,
      isComplete: false,
      nextQuestion: {
        id: 'previous_episodes',
        type: 'yesno',
        prompt: 'Have you experienced this before?',
      },
    };
  }

  return {
    nextQuestion: null,
    aiTransitionMessage: "Thank you. I've gathered a clear picture of what you're experiencing. Let's review everything together.",
    isComplete: true,
    currentProgressStage: 'Information Recorded',
    progressPercent: 100,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. ABDOMEN FLOW (Stomach, Liver, Cramping, Acidity)
// ─────────────────────────────────────────────────────────────────────────────
const getAbdomenFlow = (ctx: EngineContext): EngineResult => {
  const { answers, initialDescription } = ctx;

  // Q1: Where exactly do you feel the pain? (Sub-region selector)
  if (!answers['abdomen_location']) {
    let intro = "Thanks! I see you've selected Abdomen. Let's understand what's happening.";
    if (initialDescription) {
      intro = `Thanks! I noted your concern: "${initialDescription}". Where exactly do you feel the pain?`;
    }
    return {
      aiTransitionMessage: intro,
      currentProgressStage: 'Pinpointing Location',
      progressPercent: 20,
      isComplete: false,
      nextQuestion: {
        id: 'abdomen_location',
        type: 'body-part',
        prompt: 'Where exactly do you feel the pain?',
        options: [
          { id: 'upper_abdomen', label: 'Upper abdomen', description: 'Stomach / epigastric' },
          { id: 'lower_abdomen', label: 'Lower abdomen', description: 'Pelvic / lower bowel' },
          { id: 'left_side', label: 'Left side', description: 'Left flank / lower left' },
          { id: 'right_side', label: 'Right side', description: 'Right upper or lower quadrant' },
          { id: 'around_belly_button', label: 'Around the belly button', description: 'Periumbilical' },
          { id: 'entire_abdomen', label: 'Entire abdomen', description: 'Diffuse cramping' },
        ],
      },
    };
  }

  // Q2: How would you describe the pain?
  if (!answers['pain_description']) {
    const locLabel = answers['abdomen_location']?.label || 'selected area';
    return {
      aiTransitionMessage: `Noted: ${locLabel}. How would you describe the pain?`,
      currentProgressStage: 'Characterizing Pain',
      progressPercent: 35,
      isComplete: false,
      nextQuestion: {
        id: 'pain_description',
        type: 'choice',
        prompt: 'How would you describe the pain?',
        options: [
          { id: 'cramping', label: 'Cramping', emoji: '🌀' },
          { id: 'sharp', label: 'Sharp', emoji: '⚡' },
          { id: 'burning', label: 'Burning', emoji: '🔥' },
          { id: 'dull', label: 'Dull', emoji: '☁️' },
          { id: 'pressure', label: 'Pressure', emoji: '🪨' },
          { id: 'not_sure', label: 'Not sure', emoji: '❓' },
        ],
      },
    };
  }

  // Q3: How severe is the pain right now? (Slider 1 to 10)
  if (answers['pain_severity_score'] === undefined && !answers['pain_severity']) {
    return {
      aiTransitionMessage: 'How severe is the pain right now?',
      currentProgressStage: 'Assessing Severity',
      progressPercent: 50,
      isComplete: false,
      nextQuestion: {
        id: 'severity_slider',
        type: 'slider',
        prompt: 'How severe is the pain right now?',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 7,
        minLabel: 'Mild',
        maxLabel: 'Severe',
        isPainScale: true,
      },
    };
  }

  // Q4: Does anything make the pain worse? (Checkboxes)
  if (!answers['abdomen_triggers']) {
    return {
      aiTransitionMessage: 'Does anything make the pain worse?',
      currentProgressStage: 'Identifying Triggers',
      progressPercent: 65,
      isComplete: false,
      nextQuestion: {
        id: 'abdomen_triggers',
        type: 'multiselect',
        prompt: 'Does anything make the pain worse?',
        options: [
          { id: 'eating', label: 'Eating' },
          { id: 'walking', label: 'Walking' },
          { id: 'coughing', label: 'Coughing' },
          { id: 'movement', label: 'Movement' },
          { id: 'lying_down', label: 'Lying down' },
          { id: 'nothing_specific', label: 'Nothing specific' },
          { id: 'not_sure', label: 'Not sure' },
        ],
      },
    };
  }

  // Q5: Have you experienced this type of pain before? (Yes / No)
  if (answers['previous_episodes'] === undefined) {
    return {
      aiTransitionMessage: 'Have you experienced this type of pain before?',
      currentProgressStage: 'Clinical History',
      progressPercent: 80,
      isComplete: false,
      nextQuestion: {
        id: 'previous_episodes',
        type: 'yesno',
        prompt: 'Have you experienced this type of pain before?',
      },
    };
  }

  // Q6: Associated symptoms
  if (!answers['associated_symptoms']) {
    return {
      aiTransitionMessage: 'Are you experiencing any other symptoms along with it?',
      currentProgressStage: 'Associated Symptoms',
      progressPercent: 90,
      isComplete: false,
      nextQuestion: {
        id: 'associated_symptoms',
        type: 'multiselect',
        prompt: 'Any of these accompanying symptoms?',
        options: [
          { id: 'nausea', label: 'Nausea' },
          { id: 'vomiting', label: 'Vomiting' },
          { id: 'dizziness', label: 'Dizziness' },
          { id: 'fatigue', label: 'Fatigue' },
          { id: 'fever', label: 'Fever' },
          { id: 'none', label: 'None of these' },
        ],
      },
    };
  }

  // Q7: If duration was not provided in initial description, ask duration
  if (answers['duration_slider'] === undefined) {
    return {
      aiTransitionMessage: 'How long have you been experiencing this?',
      currentProgressStage: 'Determining Timeline',
      progressPercent: 95,
      isComplete: false,
      nextQuestion: {
        id: 'duration_slider',
        type: 'duration',
        prompt: 'How long have you had it?',
      },
    };
  }

  return {
    nextQuestion: null,
    aiTransitionMessage: "Thank you. I've gathered a clear picture of what you're experiencing. Let's review everything together.",
    isComplete: true,
    currentProgressStage: 'Information Recorded',
    progressPercent: 100,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. PELVIS FLOW
// ─────────────────────────────────────────────────────────────────────────────
const getPelvisFlow = (ctx: EngineContext): EngineResult => {
  const { answers } = ctx;

  if (!answers['pelvis_problem']) {
    return {
      aiTransitionMessage: "Thanks! I see you've selected Pelvis. Let's understand what's happening.",
      currentProgressStage: 'Identifying Symptoms',
      progressPercent: 20,
      isComplete: false,
      nextQuestion: {
        id: 'pelvis_problem',
        type: 'choice',
        prompt: 'What are you experiencing?',
        options: [
          { id: 'urinary_burning', label: 'Burning sensation or pain during urination', emoji: '🔥' },
          { id: 'urinary_frequency', label: 'Frequent or sudden urgent urination', emoji: '💧' },
          { id: 'dull_ache', label: 'Dull aching pelvic pressure', emoji: '☁️' },
          { id: 'cramping', label: 'Cramping discomfort', emoji: '〰️' },
          { id: 'groin_strain', label: 'Groin pull or muscle strain', emoji: '🩹' },
        ],
      },
    };
  }

  if (!answers['pain_severity']) {
    return {
      aiTransitionMessage: 'How would you describe the discomfort?',
      currentProgressStage: 'Assessing Severity',
      progressPercent: 40,
      isComplete: false,
      nextQuestion: {
        id: 'pain_severity',
        type: 'choice',
        prompt: 'How would you describe the pain?',
        options: [
          { id: 'mild', label: 'Mild' },
          { id: 'moderate', label: 'Moderate' },
          { id: 'severe', label: 'Severe' },
        ],
      },
    };
  }

  if (answers['duration_slider'] === undefined) {
    return {
      aiTransitionMessage: 'How long have you had it?',
      currentProgressStage: 'Determining Timeline',
      progressPercent: 60,
      isComplete: false,
      nextQuestion: {
        id: 'duration_slider',
        type: 'slider',
        prompt: 'How long have you had it?',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 2,
        minLabel: '1 day',
        maxLabel: '10+ days',
        unit: 'days',
      },
    };
  }

  if (answers['previous_episodes'] === undefined) {
    return {
      aiTransitionMessage: 'Have you experienced this before?',
      currentProgressStage: 'Clinical History',
      progressPercent: 85,
      isComplete: false,
      nextQuestion: {
        id: 'previous_episodes',
        type: 'yesno',
        prompt: 'Have you experienced this before?',
      },
    };
  }

  return {
    nextQuestion: null,
    aiTransitionMessage: 'Thank you. All responses recorded.',
    isComplete: true,
    currentProgressStage: 'Information Recorded',
    progressPercent: 100,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. ARM & HAND FLOW
// ─────────────────────────────────────────────────────────────────────────────
const getArmHandFlow = (ctx: EngineContext, regionId: BodyRegionId): EngineResult => {
  const { answers } = ctx;
  const isHand = regionId.includes('hand');
  const side = regionId.includes('left') ? 'Left' : 'Right';
  const partName = isHand ? `${side} hand & wrist` : `${side} arm & shoulder`;

  if (!answers['arm_problem']) {
    return {
      aiTransitionMessage: `Thanks! I see you've selected ${partName}. Let's understand what's happening.`,
      currentProgressStage: 'Identifying Symptoms',
      progressPercent: 20,
      isComplete: false,
      nextQuestion: {
        id: 'arm_problem',
        type: 'choice',
        prompt: `What are you experiencing in your ${partName}?`,
        options: [
          { id: 'joint_pain', label: 'Joint pain (Wrist, Elbow, or Shoulder)', emoji: '🦴' },
          { id: 'muscle_soreness', label: 'Muscle strain or stiffness', emoji: '🩹' },
          { id: 'tingling_numbness', label: 'Numbness or "pins and needles"', emoji: '⚡' },
          { id: 'swelling', label: 'Swelling or tenderness to touch', emoji: '💧' },
          { id: 'weakness', label: 'Weakness / Reduced grip strength', emoji: '✊' },
        ],
      },
    };
  }

  if (!answers['pain_severity']) {
    return {
      aiTransitionMessage: 'How would you describe the pain?',
      currentProgressStage: 'Assessing Severity',
      progressPercent: 40,
      isComplete: false,
      nextQuestion: {
        id: 'pain_severity',
        type: 'choice',
        prompt: 'How would you describe the pain?',
        options: [
          { id: 'mild', label: 'Mild' },
          { id: 'moderate', label: 'Moderate' },
          { id: 'severe', label: 'Severe' },
        ],
      },
    };
  }

  if (answers['duration_slider'] === undefined) {
    return {
      aiTransitionMessage: 'How long have you had it?',
      currentProgressStage: 'Determining Timeline',
      progressPercent: 60,
      isComplete: false,
      nextQuestion: {
        id: 'duration_slider',
        type: 'slider',
        prompt: 'How long have you had it?',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 2,
        minLabel: '1 day',
        maxLabel: '10+ days',
        unit: 'days',
      },
    };
  }

  if (!answers['arm_triggers']) {
    return {
      aiTransitionMessage: 'Did any specific activity cause or worsen it?',
      currentProgressStage: 'Identifying Triggers',
      progressPercent: 80,
      isComplete: false,
      nextQuestion: {
        id: 'arm_triggers',
        type: 'choice',
        prompt: 'Did any specific activity trigger it?',
        options: [
          { id: 'repetitive_work', label: 'Repetitive typing or manual tasks' },
          { id: 'heavy_lifting', label: 'Heavy lifting or sports workout' },
          { id: 'bump_fall', label: 'Recent fall or accidental bump' },
          { id: 'slept_on', label: 'Woke up with it after sleeping on it' },
          { id: 'none', label: 'Started without obvious cause' },
        ],
      },
    };
  }

  if (answers['previous_episodes'] === undefined) {
    return {
      aiTransitionMessage: 'Have you experienced this before?',
      currentProgressStage: 'Clinical History',
      progressPercent: 92,
      isComplete: false,
      nextQuestion: {
        id: 'previous_episodes',
        type: 'yesno',
        prompt: 'Have you experienced this before?',
      },
    };
  }

  return {
    nextQuestion: null,
    aiTransitionMessage: 'Thank you. All responses recorded.',
    isComplete: true,
    currentProgressStage: 'Information Recorded',
    progressPercent: 100,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. LEG & FOOT FLOW
// ─────────────────────────────────────────────────────────────────────────────
const getLegFootFlow = (ctx: EngineContext, regionId: BodyRegionId): EngineResult => {
  const { answers } = ctx;
  const isFoot = regionId.includes('foot');
  const side = regionId.includes('left') ? 'Left' : 'Right';
  const partName = isFoot ? `${side} foot / ankle` : `${side} leg / knee`;

  if (!answers['leg_problem']) {
    return {
      aiTransitionMessage: `Thanks! I see you've selected ${partName}. Let's understand what's happening.`,
      currentProgressStage: 'Identifying Symptoms',
      progressPercent: 20,
      isComplete: false,
      nextQuestion: {
        id: 'leg_problem',
        type: 'choice',
        prompt: `What are you experiencing in your ${partName}?`,
        options: [
          { id: 'knee_pain', label: 'Knee joint pain / stiffness', emoji: '🦵' },
          { id: 'ankle_twist', label: 'Ankle sprain or swelling', emoji: '🦶' },
          { id: 'calf_cramp', label: 'Calf cramp or tight muscle', emoji: '🩹' },
          { id: 'heel_pain', label: 'Heel or arch pain when walking', emoji: '👟' },
          { id: 'shooting_nerve', label: 'Shooting pain down leg (Sciatica-like)', emoji: '⚡' },
          { id: 'tingling', label: 'Numbness or tingling in toes/foot', emoji: '〰️' },
        ],
      },
    };
  }

  if (!answers['pain_severity']) {
    return {
      aiTransitionMessage: 'How would you describe the pain?',
      currentProgressStage: 'Assessing Severity',
      progressPercent: 40,
      isComplete: false,
      nextQuestion: {
        id: 'pain_severity',
        type: 'choice',
        prompt: 'How would you describe the pain?',
        options: [
          { id: 'mild', label: 'Mild' },
          { id: 'moderate', label: 'Moderate' },
          { id: 'severe', label: 'Severe' },
        ],
      },
    };
  }

  if (answers['duration_slider'] === undefined) {
    return {
      aiTransitionMessage: 'How long have you had it?',
      currentProgressStage: 'Determining Timeline',
      progressPercent: 60,
      isComplete: false,
      nextQuestion: {
        id: 'duration_slider',
        type: 'slider',
        prompt: 'How long have you had it?',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 2,
        minLabel: '1 day',
        maxLabel: '10+ days',
        unit: 'days',
      },
    };
  }

  if (!answers['leg_timing']) {
    return {
      aiTransitionMessage: 'When does it hurt most?',
      currentProgressStage: 'Context & Timing',
      progressPercent: 78,
      isComplete: false,
      nextQuestion: {
        id: 'leg_timing',
        type: 'choice',
        prompt: 'When is the discomfort most noticeable?',
        options: [
          { id: 'walking', label: 'Walking or bearing weight' },
          { id: 'first_steps', label: 'First steps out of bed in the morning' },
          { id: 'stairs', label: 'Climbing or descending stairs' },
          { id: 'rest_night', label: 'At rest or during sleep' },
          { id: 'constant', label: 'Constant throughout the day' },
        ],
      },
    };
  }

  if (answers['previous_episodes'] === undefined) {
    return {
      aiTransitionMessage: 'Have you experienced this before?',
      currentProgressStage: 'Clinical History',
      progressPercent: 92,
      isComplete: false,
      nextQuestion: {
        id: 'previous_episodes',
        type: 'yesno',
        prompt: 'Have you experienced this before?',
      },
    };
  }

  return {
    nextQuestion: null,
    aiTransitionMessage: 'Thank you. All responses recorded.',
    isComplete: true,
    currentProgressStage: 'Information Recorded',
    progressPercent: 100,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. BACK FLOW
// ─────────────────────────────────────────────────────────────────────────────
const getBackFlow = (ctx: EngineContext): EngineResult => {
  const { answers } = ctx;

  if (!answers['back_problem']) {
    return {
      aiTransitionMessage: "Thanks! I see you've selected Back. Let's understand what's happening.",
      currentProgressStage: 'Identifying Symptoms',
      progressPercent: 20,
      isComplete: false,
      nextQuestion: {
        id: 'back_problem',
        type: 'choice',
        prompt: 'What are you experiencing in your back?',
        options: [
          { id: 'lower_back', label: 'Lower back stiffness / ache', emoji: '🪵' },
          { id: 'muscle_spasm', label: 'Acute muscle spasm / Catch', emoji: '⚡' },
          { id: 'sciatica', label: 'Pain radiating down buttock or leg', emoji: '〰️' },
          { id: 'upper_back', label: 'Upper back / Between shoulder blades', emoji: '🔙' },
        ],
      },
    };
  }

  if (!answers['pain_severity']) {
    return {
      aiTransitionMessage: 'How would you describe the pain?',
      currentProgressStage: 'Assessing Severity',
      progressPercent: 40,
      isComplete: false,
      nextQuestion: {
        id: 'pain_severity',
        type: 'choice',
        prompt: 'How would you describe the pain?',
        options: [
          { id: 'mild', label: 'Mild' },
          { id: 'moderate', label: 'Moderate' },
          { id: 'severe', label: 'Severe' },
        ],
      },
    };
  }

  if (answers['duration_slider'] === undefined) {
    return {
      aiTransitionMessage: 'How long have you had it?',
      currentProgressStage: 'Determining Timeline',
      progressPercent: 60,
      isComplete: false,
      nextQuestion: {
        id: 'duration_slider',
        type: 'slider',
        prompt: 'How long have you had it?',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 3,
        minLabel: '1 day',
        maxLabel: '10+ days',
        unit: 'days',
      },
    };
  }

  if (answers['previous_episodes'] === undefined) {
    return {
      aiTransitionMessage: 'Have you experienced this before?',
      currentProgressStage: 'Clinical History',
      progressPercent: 88,
      isComplete: false,
      nextQuestion: {
        id: 'previous_episodes',
        type: 'yesno',
        prompt: 'Have you experienced this before?',
      },
    };
  }

  return {
    nextQuestion: null,
    aiTransitionMessage: 'Thank you. All responses recorded.',
    isComplete: true,
    currentProgressStage: 'Information Recorded',
    progressPercent: 100,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. OTHER / SYSTEMIC FLOW (Fever, Skin, Allergy, Fatigue)
// ─────────────────────────────────────────────────────────────────────────────
const getOtherFlow = (ctx: EngineContext): EngineResult => {
  const { answers } = ctx;

  if (!answers['other_problem']) {
    return {
      aiTransitionMessage:
        "Let's understand your general symptoms. What has been bothering you?",
      currentProgressStage: 'Identifying Concern',
      progressPercent: 20,
      isComplete: false,
      nextQuestion: {
        id: 'other_problem',
        type: 'choice',
        prompt: 'What are you experiencing?',
        options: [
          { id: 'fever_chills', label: 'Fever or chills', emoji: '🌡️' },
          { id: 'fatigue_weakness', label: 'Extreme fatigue & weakness', emoji: '🔋' },
          { id: 'skin_rash', label: 'Skin rash, redness, or itching', emoji: '🔴' },
          { id: 'allergy_cold', label: 'Cold / Allergy / Sneezing', emoji: '🤧' },
          { id: 'appetite_weight', label: 'Loss of appetite or weight changes', emoji: '⚖️' },
          { id: 'general_discomfort', label: 'General body ache / malaise', emoji: '☁️' },
        ],
      },
    };
  }

  if (!answers['pain_severity']) {
    return {
      aiTransitionMessage: 'How would you describe the intensity of your symptoms?',
      currentProgressStage: 'Assessing Severity',
      progressPercent: 40,
      isComplete: false,
      nextQuestion: {
        id: 'pain_severity',
        type: 'choice',
        prompt: 'How would you describe the severity?',
        options: [
          { id: 'mild', label: 'Mild' },
          { id: 'moderate', label: 'Moderate' },
          { id: 'severe', label: 'Severe' },
        ],
      },
    };
  }

  if (answers['duration_slider'] === undefined) {
    return {
      aiTransitionMessage: 'How long have you had it?',
      currentProgressStage: 'Determining Timeline',
      progressPercent: 65,
      isComplete: false,
      nextQuestion: {
        id: 'duration_slider',
        type: 'slider',
        prompt: 'How long have you had it?',
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 2,
        minLabel: '1 day',
        maxLabel: '10+ days',
        unit: 'days',
      },
    };
  }

  if (answers['previous_episodes'] === undefined) {
    return {
      aiTransitionMessage: 'Have you experienced this before?',
      currentProgressStage: 'Clinical History',
      progressPercent: 88,
      isComplete: false,
      nextQuestion: {
        id: 'previous_episodes',
        type: 'yesno',
        prompt: 'Have you experienced this before?',
      },
    };
  }

  return {
    nextQuestion: null,
    aiTransitionMessage: 'Thank you. All responses recorded.',
    isComplete: true,
    currentProgressStage: 'Information Recorded',
    progressPercent: 100,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// BUILD STRUCTURED SUMMARY DATA
// ─────────────────────────────────────────────────────────────────────────────
export const buildConsultationSummary = (ctx: EngineContext): ConsultationSummaryData => {
  const { selectedRegions, isOtherSelected, initialDescription, answers } = ctx;

  const primaryArea = getPrimaryRegionLabel(selectedRegions, isOtherSelected);

  // Concern label
  const concernObj =
    answers['head_problem'] ||
    answers['neck_problem'] ||
    answers['chest_sensation'] ||
    answers['abdomen_problem'] ||
    answers['pelvis_problem'] ||
    answers['arm_problem'] ||
    answers['leg_problem'] ||
    answers['back_problem'] ||
    answers['other_problem'];

  const concern = concernObj?.label || 'General symptom review';

  // Severity
  const severityAnswer = answers['pain_severity'];
  let severity = 'Moderate';
  if (typeof severityAnswer === 'string') {
    severity = severityAnswer.charAt(0).toUpperCase() + severityAnswer.slice(1);
  } else if (severityAnswer?.label) {
    severity = severityAnswer.label;
  }

  // Duration
  let duration = 'A few days';
  if (answers['duration_auto_extracted']) {
    duration = answers['duration_auto_extracted'];
  } else if (answers['duration_slider']) {
    const days = answers['duration_slider'];
    duration = days >= 10 ? '10+ days' : `${days} ${days === 1 ? 'day' : 'days'}`;
  }

  // Location
  const locObj =
    answers['head_location'] ||
    answers['abdomen_location'] ||
    answers['chest_timing'] ||
    answers['leg_timing'];
  const location = locObj?.label || primaryArea;

  // Associated symptoms
  const rawAssociated = answers['associated_symptoms'] || [];
  const associatedSymptoms: string[] = Array.isArray(rawAssociated)
    ? rawAssociated.map((a: any) => (typeof a === 'string' ? a : a.label || a.id))
    : [];

  // Triggers
  const rawTriggers =
    answers['aggravating_factors'] ||
    answers['neck_triggers'] ||
    answers['arm_triggers'] ||
    [];
  const triggers: string[] = Array.isArray(rawTriggers)
    ? rawTriggers.map((t: any) => (typeof t === 'string' ? t : t.label || t.id))
    : [];

  // Previous episodes
  let previousEpisodes = 'No prior history reported';
  if (answers['previous_episodes'] === true) {
    previousEpisodes = 'Yes, experienced previously';
  } else if (answers['previous_episodes'] === false) {
    previousEpisodes = 'No, first time experiencing';
  }

  // Additional Information
  const additionalInformation = initialDescription
    ? initialDescription.trim()
    : 'No additional notes provided';

  // Triage Priority
  let triagePriority: ConsultationSummaryData['triagePriority'] = 'Routine (Level 3)';
  if (severity.toLowerCase().includes('severe')) {
    triagePriority = 'Priority OPD (Level 2)';
  }

  // Recommended Department
  let recommendedDepartment = 'General Medicine / OPD';
  if (selectedRegions.includes('head')) {
    recommendedDepartment = 'Neurology / General OPD';
  } else if (selectedRegions.includes('neck') || selectedRegions.includes('back')) {
    recommendedDepartment = 'Orthopaedics & Spine Clinic';
  } else if (selectedRegions.includes('chest')) {
    recommendedDepartment = 'Pulmonology & Cardiology Triage';
  } else if (selectedRegions.includes('abdomen')) {
    recommendedDepartment = 'Gastroenterology / Hepatology';
  } else if (selectedRegions.includes('arm-left') || selectedRegions.includes('leg-left')) {
    recommendedDepartment = 'Orthopaedics & Physiotherapy';
  }

  return {
    primaryArea,
    selectedRegions,
    concern,
    duration,
    severity,
    location,
    associatedSymptoms,
    triggers,
    previousEpisodes,
    additionalInformation,
    triagePriority,
    recommendedDepartment,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};
