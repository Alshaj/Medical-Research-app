import { db } from './database';
import { recordRepository } from './repository';

export async function seedInitialDataIfEmpty() {
  const count = await db.records.count();
  if (count > 0) return;

  const sampleRecords = [
    {
      patientId: 'PT-2024-001',
      age: 45,
      gender: 'Male',
      city: "Sana'a",
      maritalStatus: 'Married',
      occupation: 'Civil Engineer',
      admissionDate: '2024-05-12',
      symptoms: {
        fever: true,
        pallor: true,
        bleeding: false,
        weightLoss: true,
        nightSweats: true,
        lymphadenopathy: true,
        hepatomegaly: false,
        splenomegaly: true
      },
      chiefComplaint: 'Intermittent high-grade fever for 3 weeks with progressive fatigue and night sweats.',
      pastMedicalHistory: 'Hypertension treated with Amlodipine 5mg. No previous hospitalizations.',
      familyHistory: 'No history of malignancy or hematological disorders in first-degree relatives.',
      labs: {
        hemoglobin: 8.2,
        wbc: 34.5,
        platelets: 45,
        alt: 32,
        ast: 28,
        pbsBlasts: 42,
        pbsFindings: 'Numerous circulating myeloblasts with Auer rods noted.',
        bmAspirateBlast: 68,
        bmCellularity: 'Hypercellular bone marrow with erythroid hypoplasia.',
        bmBiopsySummary: 'Diffuse blast infiltration replacing normal hematopoiesis.',
        flowCytometry: 'Positive for CD33, CD13, CD117, MPO. Negative for CD3, CD19.',
        cytogenetics: 't(8;21)(q22;q22.1); RUNX1-RUNX1T1.',
        molecularGenetics: 'NPM1 negative, FLT3-ITD negative.'
      },
      diagnosis: 'Acute Myeloid Leukemia (AML)',
      subType: 'AML with t(8;21)',
      stageRiskGroup: 'Favorable Risk',
      ihcMarkers: 'MPO+, CD34+, CD117+',
      inductionProtocol: '7+3 Cytarabine and Daunorubicin',
      treatmentResponse: 'Complete Hematologic Response',
      relapseDate: '',
      outcome: 'Complete Remission'
    },
    {
      patientId: 'PT-2024-002',
      age: 62,
      gender: 'Female',
      city: 'Aden',
      maritalStatus: 'Widowed',
      occupation: 'Teacher',
      admissionDate: '2024-06-01',
      symptoms: {
        fever: false,
        pallor: true,
        bleeding: true,
        weightLoss: false,
        nightSweats: false,
        lymphadenopathy: true,
        hepatomegaly: true,
        splenomegaly: true
      },
      chiefComplaint: 'Painless cervical lymphadenopathy and easy bruising on lower extremities.',
      pastMedicalHistory: 'Type 2 Diabetes mellitus managed with Metformin.',
      familyHistory: 'Mother had breast cancer at age 68.',
      labs: {
        hemoglobin: 9.8,
        wbc: 78.2,
        platelets: 88,
        alt: 45,
        ast: 51,
        pbsBlasts: 12,
        pbsFindings: 'Mature small lymphocytes with smudge cells present.',
        bmAspirateBlast: 15,
        bmCellularity: 'Hypercellular marrow with mature lymphoid aggregates.',
        bmBiopsySummary: 'Nodular and diffuse infiltration of small mature-appearing B cells.',
        flowCytometry: 'CD5+, CD19+, CD23+, CD20 (weak), Kappa light chain restricted.',
        cytogenetics: 'del(13q14) single anomaly.',
        molecularGenetics: 'IGHV mutated status.'
      },
      diagnosis: 'Chronic Lymphocytic Leukemia (CLL)',
      subType: 'B-cell CLL',
      stageRiskGroup: 'Rai Stage II / Binet Stage B',
      ihcMarkers: 'CD5+, CD23+, ZAP-70 negative',
      inductionProtocol: 'Ibrutinib monotherapy 420mg daily',
      treatmentResponse: 'Partial Response with nodal regression',
      relapseDate: '',
      outcome: 'Stable'
    },
    {
      patientId: 'PT-2024-003',
      age: 28,
      gender: 'Female',
      city: 'Taiz',
      maritalStatus: 'Single',
      occupation: 'Software Developer',
      admissionDate: '2024-06-20',
      symptoms: {
        fever: true,
        pallor: true,
        bleeding: true,
        weightLoss: true,
        nightSweats: true,
        lymphadenopathy: false,
        hepatomegaly: false,
        splenomegaly: false
      },
      chiefComplaint: 'Severe epistaxis, mucosal bleeding, skin petechiae, and extreme lethargy.',
      pastMedicalHistory: 'Unremarkable medical history.',
      familyHistory: 'No relevant medical history.',
      labs: {
        hemoglobin: 6.4,
        wbc: 1.8,
        platelets: 12,
        alt: 22,
        ast: 19,
        pbsBlasts: 85,
        pbsFindings: 'Severe pancytopenia with abundant abnormal promyelocytes containing multiple Auer rods (faggot cells).',
        bmAspirateBlast: 90,
        bmCellularity: 'Markedly hypercellular packed with promyelocytes.',
        bmBiopsySummary: 'Hypergranular promyelocytic blast predominance.',
        flowCytometry: 'CD33 bright+, CD13+, MPO hyper-positive, CD34 negative, HLA-DR negative.',
        cytogenetics: 't(15;17)(q24.1;q21.2); PML-RARA.',
        molecularGenetics: 'PML-RARA isoform bcr1 positive.'
      },
      diagnosis: 'Acute Promyelocytic Leukemia (APL)',
      subType: 'Hypergranular APL',
      stageRiskGroup: 'High Risk (WBC pancytopenic but DIC risk)',
      ihcMarkers: 'MPO hyper-positive, CD33+',
      inductionProtocol: 'ATRA (All-trans retinoic acid) + Arsenic Trioxide (ATO)',
      treatmentResponse: 'Rapid DIC resolution & Complete Molecular Remission',
      relapseDate: '',
      outcome: 'Complete Remission'
    }
  ];

  for (const record of sampleRecords) {
    await recordRepository.saveRecord(record);
  }
}
