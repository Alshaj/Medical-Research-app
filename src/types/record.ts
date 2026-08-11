export interface DemographicsData {
  id?: string;
  age?: number | string | null;
  sex?: string;
  admissionDate?: string;
}

export interface PMHXData {
  previousCKD?: string;
}

export interface LabsData {
  hb?: string;
  wbcCount?: string;
  plateletsCount?: string;
  sCr?: string;
  egfr?: string; // eGFR (after S. Cr)
  ri?: string; // RI (after eGFR)
  bUrea?: string;
  ca?: string;
  ldh?: string;
  uricAcid?: string;
  b2Microglobulin?: string;
  bmPlasmaCellPercent?: string;

  // Serum protein electrophoresis bands
  spepAlbumin?: string;
  spepAlpha1Globulin?: string;
  spepAlpha2Globulin?: string;
  spepBetaGlobulin?: string;
  spepGammaGlobulin?: string;
  spepAgRatio?: string;
}

export interface MedicalRecord {
  id: string; // Unique record UUID
  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  // Section 1: Demographics (All optional)
  studyId?: string;
  patientId?: string; // ID field
  age?: number | string | null; // Numbers in fraction (e.g., 0.5 = 5 months)
  sex?: string; // Sex
  gender?: string; // Alias for sex
  admissionDate?: string; // Date of admission
  weight?: number | string | null; // Weight (accepts rational numbers)

  // Section 2: PMHX (Past Medical History)
  previousCKD?: string; // 'Yes' | 'No'
  pmhx?: PMHXData;

  // Section 3: Labs (All optional, accept strings)
  labs?: LabsData;

  // Metadata fields
  diagnosis?: string;
  tags?: string[];
  notes?: string;
}

export type MedicalRecordInput = Omit<MedicalRecord, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: string;
};
