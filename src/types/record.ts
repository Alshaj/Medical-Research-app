export interface ClinicalSymptoms {
  fever: boolean;
  pallor: boolean;
  bleeding: boolean;
  weightLoss: boolean;
  nightSweats: boolean;
  lymphadenopathy: boolean;
  hepatomegaly: boolean;
  splenomegaly: boolean;
}

export interface LabsDiagnostics {
  hemoglobin?: number | null;
  wbc?: number | null;
  platelets?: number | null;
  alt?: number | null;
  ast?: number | null;
  pbsBlasts?: number | null;
  pbsFindings?: string;
  bmAspirateBlast?: number | null;
  bmCellularity?: string;
  bmBiopsySummary?: string;
  flowCytometry?: string;
  cytogenetics?: string;
  molecularGenetics?: string;
}

export interface MedicalRecord {
  id: string; // Unique record UUID
  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  // Demographics
  patientId: string; // MRN or anonymized Patient ID
  age?: number | null;
  gender?: 'Male' | 'Female' | string;
  city?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | string;
  occupation?: string;
  admissionDate?: string;

  // Clinical Symptoms
  symptoms: ClinicalSymptoms;

  // Medical History
  chiefComplaint?: string; // Chief Complaint & History Summary

  // Labs & Diagnostics
  labs: LabsDiagnostics;

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
