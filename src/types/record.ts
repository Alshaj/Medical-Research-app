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
  // Complete Blood Count (CBC) Profile - Accepts numbers or strings (e.g. 0.2, "12-14", "<0.5")
  hemoglobin?: number | string | null;
  wbcCount?: number | string | null;
  rbcCount?: number | string | null;
  hematocrit?: number | string | null;
  plateletCount?: number | string | null;
  mcv?: number | string | null;
  mch?: number | string | null;
  mchc?: number | string | null;
  rdw?: number | string | null;
  absoluteGranulocytes?: number | string | null;
  absoluteLymphocytes?: number | string | null;
  differentialCount?: string;

  // Biochemistry & Other Labs - Accepts numbers or strings
  ldh?: number | string | null;
  uricAcid?: number | string | null;
  serumCreatinine?: number | string | null;
  alt?: number | string | null;
  ast?: number | string | null;
}

export interface DiagnosticsData {
  peripheralBlast?: number | string | null;
  boneMarrowBlast?: number | string | null;
  pbsFindings?: string;
  bmCellularity?: string;
  bmBiopsySummary?: string;
  lymphNodeBiopsyPerformed?: boolean;
  lymphNodeBiopsySummary?: string;
  flowCytometry?: string;
  cytogenetics?: string;
  molecularGenetics?: string;
  ctScanImaging?: string;
}

export interface MedicalRecord {
  id: string; // Unique record UUID
  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  // Section 1: Demographics (All optional)
  studyId?: string; // Optional
  mrn?: string; // Optional
  patientId?: string; // Legacy fallback
  age?: number | string | null; // Accepts decimal/fraction e.g. 0.2
  gender?: 'Male' | 'Female' | string;
  city?: string;
  customCity?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | string;
  admissionDate?: string;

  // Section 2: Clinical Symptoms (All optional)
  symptoms: ClinicalSymptoms;
  otherSymptomsText?: string;

  // Medical History Summary
  chiefComplaint?: string;

  // Section 3: Laboratory Data (All optional, accepts string/number)
  labs: LaboratoryData;

  // Section 4: Diagnostics (All optional, accepts string/number)
  diagnostics: DiagnosticsData;

  // Section 5: Diagnosis (Only Hematological Malignancy Diagnosis is REQUIRED)
  diagnosis: string; // Required *
  customDiagnosis?: string;
  subType?: string;
  stageRiskGroup?: string;
  ihcMarkers?: string;

  // Section 6: Treatment & Outcome (All optional)
  lineOfTreatment?: string;
  customLineOfTreatment?: string;
  inductionProtocol?: string;
  outcome?: string;
  treatmentOutcome?: string;

  tags?: string[];
  notes?: string;
}

export type MedicalRecordInput = Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: string;
};
