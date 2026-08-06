export interface ClinicalSymptoms {
  fever: boolean;
  pallor: boolean;
  bleeding: boolean;
  weightLoss: boolean;
  nightSweats: boolean;
  lymphadenopathy: boolean;
  hepatomegaly: boolean;
  splenomegaly: boolean;
  other: boolean;
}

export interface LaboratoryData {
  // Complete Blood Count (CBC) Profile
  hemoglobin?: number | null;
  wbcCount?: number | null;
  rbcCount?: number | null;
  hematocrit?: number | null;
  plateletCount?: number | null;
  mcv?: number | null;
  mch?: number | null;
  mchc?: number | null;
  rdw?: number | null;
  absoluteGranulocytes?: number | null;
  absoluteLymphocytes?: number | null;
  differentialCount?: string;

  // Biochemistry & Other Labs
  ldh?: number | null;
  uricAcid?: number | null;
  serumCreatinine?: number | null;
  alt?: number | null;
  ast?: number | null;
}

export interface MedicalRecord {
  id: string; // Unique record UUID
  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  // Demographics
  studyId: string; // Study ID (Required *)
  mrn?: string; // Medical Record Number
  patientId?: string; // Legacy fallback
  age?: number | null;
  gender?: 'Male' | 'Female' | string;
  city?: string;
  customCity?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | string;
  admissionDate?: string;

  // Clinical Symptoms
  symptoms: ClinicalSymptoms;
  otherSymptomsText?: string; // Text box for custom symptoms when 'other' is toggled

  // Medical History
  chiefComplaint?: string; // Chief Complaint & History Summary

  // Laboratory Data
  labs: LaboratoryData;

  // Diagnosis & Outcome
  diagnosis: string; // Required *
  subType?: string;
  stageRiskGroup?: string;
  ihcMarkers?: string;
  inductionProtocol?: string;
  treatmentResponse?: string;
  relapseDate?: string;
  outcome?: string;

  tags?: string[];
  notes?: string;
}

export type MedicalRecordInput = Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: string;
};
