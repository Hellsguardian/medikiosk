export type NavTab = 'home' | 'my-health' | 'documents' | 'prescriptions' | 'appointments' | 'profile';

export interface MedicalEpisode {
  id: string;
  condition: string;
  icdCode?: string;
  startDate: string;
  status: 'Ongoing' | 'Completed' | 'Monitoring';
  visitCount: number;
  reportCount: number;
  prescriptionCount: number;
  iconType: 'liver' | 'brain' | 'head' | 'heart' | 'stomach';
  categoryColor: string;
  overview: {
    clinicalSummary: string;
    primarySymptoms: string[];
    currentAssessment: string;
    doctorNotes: string;
    attendingPhysician: string;
    hospital: string;
  };
  reports: MedicalReport[];
  prescriptions: Prescription[];
  visits: EpisodeVisit[];
}

export interface MedicalReport {
  id: string;
  title: string;
  type: 'Blood Test' | 'Liver Function Test' | 'Ultrasound' | 'CT Scan' | 'Discharge Summary' | 'Prescription' | 'Biopsy';
  date: string;
  facility: string;
  status: 'Normal' | 'Abnormal' | 'Critical' | 'Pending Review';
  keyFindings?: string;
  fileSize?: string;
  values?: { parameter: string; value: string; unit: string; normalRange: string; isAbnormal?: boolean }[];
}

export interface Prescription {
  id: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  prescribedBy: string;
  datePrescribed: string;
  status: 'Active' | 'Completed' | 'Discontinued';
  refillsRemaining: number;
}

export interface EpisodeVisit {
  id: string;
  title: string;
  date: string;
  doctorName: string;
  department: string;
  notes: string;
  vitals?: {
    bloodPressure?: string;
    pulse?: string;
    temperature?: string;
    weight?: string;
  };
}

export interface Appointment {
  id: string;
  doctorName: string;
  department: string;
  hospital: string;
  date: string;
  time: string;
  room: string;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  type: 'In-person' | 'Teleconsultation';
}

export interface ConsultationIntake {
  id: string;
  chiefComplaint: string;
  onsetDate: string;
  painLocation: string;
  painSeverity: number; // 1-10
  associatedSymptoms: string[];
  intakeMethod: 'speak' | 'type' | 'touch';
  status: 'Draft Intake' | 'Submitted to Doctor';
  aiStructuredSummary: string;
  submittedAt: string;
}

export interface PatientProfile {
  name: string;
  initials: string;
  abhaId: string;
  fullAbha: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
}
