import { db } from './database';
import { recordRepository } from './repository';

export async function seedInitialDataIfEmpty() {
  const count = await db.records.count();
  if (count > 0) return;

  const sampleRecords = [
    {
      studyId: 'STU-2024-001',
      mrn: 'MRN-84920',
      patientId: 'STU-2024-001',
      age: 45,
      gender: 'Male',
      city: "Sana'a",
      maritalStatus: 'Married',
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
      labs: {
        hemoglobin: 8.2,
        wbcCount: 34.5,
        rbcCount: 3.2,
        hematocrit: 24.5,
        plateletCount: 45,
        mcv: 78.5,
        mch: 25.6,
        mchc: 32.1,
        rdw: 16.5,
        absoluteGranulocytes: 1.2,
        absoluteLymphocytes: 0.8,
        differentialCount: 'Blasts 68%, Neutrophils 15%, Lymphocytes 17%',
        ldh: 650,
        uricAcid: 8.4,
        serumCreatinine: 1.1,
        alt: 32,
        ast: 28
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
      studyId: 'STU-2024-002',
      mrn: 'MRN-73812',
      patientId: 'STU-2024-002',
      age: 62,
      gender: 'Female',
      city: 'Aden',
      maritalStatus: 'Widowed',
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
      labs: {
        hemoglobin: 9.8,
        wbcCount: 78.2,
        rbcCount: 3.8,
        hematocrit: 29.8,
        plateletCount: 88,
        mcv: 84.0,
        mch: 27.5,
        mchc: 33.0,
        rdw: 14.2,
        absoluteGranulocytes: 12.5,
        absoluteLymphocytes: 64.2,
        differentialCount: 'Lymphocytes 82%, Smudge cells present',
        ldh: 340,
        uricAcid: 6.8,
        serumCreatinine: 0.9,
        alt: 45,
        ast: 51
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
      studyId: 'STU-2024-003',
      mrn: 'MRN-91204',
      patientId: 'STU-2024-003',
      age: 28,
      gender: 'Female',
      city: 'Other City',
      customCity: 'Yarim',
      maritalStatus: 'Single',
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
      labs: {
        hemoglobin: 6.4,
        wbcCount: 1.8,
        rbcCount: 2.4,
        hematocrit: 19.2,
        plateletCount: 12,
        mcv: 80.0,
        mch: 26.6,
        mchc: 33.3,
        rdw: 18.1,
        absoluteGranulocytes: 0.2,
        absoluteLymphocytes: 0.9,
        differentialCount: 'Promyelocytes 85% with Auer rods',
        ldh: 890,
        uricAcid: 9.2,
        serumCreatinine: 1.3,
        alt: 22,
        ast: 19
      },
      diagnosis: 'Acute Promyelocytic Leukemia (APL)',
      subType: 'Hypergranular APL',
      stageRiskGroup: 'High Risk',
      ihcMarkers: 'MPO hyper-positive, CD33+',
      inductionProtocol: 'ATRA + Arsenic Trioxide (ATO)',
      treatmentResponse: 'Complete Molecular Remission',
      relapseDate: '',
      outcome: 'Complete Remission'
    }
  ];

  for (const record of sampleRecords) {
    await recordRepository.saveRecord(record);
  }
}
