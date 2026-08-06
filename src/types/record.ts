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

export interface DiagnosticsData {
  peripheralBlast?: number | null;
  boneMarrowBlast?: number | null;
  pbsFindings?: string;
  bmCellularity?: string;
  bmBiopsySummary?: string;
  lymphNodeBiopsyPerformed?: boolean;
  lymphNodeBiopsySummary?: string; // Dynamic text box when Lymph Node Biopsy is toggled ON
  flowCytometry?: string;
  cytogenetics?: string;
  molecularGenetics?: string;
  ctScanImaging?: string;
}

export interface MedicalRecord {
  id: string; // Unique record UUID
  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  // Section 1: Demographics
  studyId: string; // Study ID (Required *)
  mrn?: string; // Medical Record Number
  patientId?: string; // Legacy fallback
  age?: number | null;
  gender?: 'Male' | 'Female' | string;
  city?: string;
  customCity?: string;
  maritalStatus?: 'Single' | 'Married' | 'Divorced' | 'Widowed' | string;
  admissionDate?: string;

  // Section 2: Clinical Symptoms
  symptoms: ClinicalSymptoms;
  otherSymptomsText?: string;

  // Medical History Summary
  chiefComplaint?: string;

  // Section 3: Laboratory Data
  labs: LaboratoryData;

  // Section 4: Diagnostics
  diagnostics: DiagnosticsData;

  // Section 5: Diagnosis
  diagnosis: string; // Hematological Malignancy Diagnosis * (Required)
  subType?: string; // Disease Subtype / FAB / WHO Classification
  stageRiskGroup?: string; // Stage / Risk Group
  ihcMarkers?: string; // Immunohistochemistry (IHC) Markers

  // Section 6: Treatment & Outcome
  lineOfTreatment?: string;
  customLineOfTreatment?: string; // Dynamic text input when Line of Treatment is 'Other'
  inductionProtocol?: string; // Legacy fallback
  outcome?: string; // Treatment Outcome
  treatmentOutcome?: string;

  tags?: string[];
  notes?: string;
}

export type MedicalRecordInput = Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: string;
};
