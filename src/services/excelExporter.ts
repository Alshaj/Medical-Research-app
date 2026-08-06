import * as XLSX from 'xlsx';
import { MedicalRecord } from '../types/record';

/**
 * Transforms JSON MedicalRecord objects into flat Excel rows
 */
export function transformRecordToExcelRow(record: MedicalRecord) {
  return {
    'Record ID': record.id,
    'Patient ID / MRN': record.patientId || '',
    'Age': record.age !== undefined && record.age !== null ? record.age : '',
    'Gender': record.gender || '',
    'City (Yemen)': record.city || '',
    'Marital Status': record.maritalStatus || '',
    'Occupation': record.occupation || '',
    'Admission Date': record.admissionDate || '',
    
    // Clinical Symptoms
    'Fever': record.symptoms?.fever ? 'Yes' : 'No',
    'Pallor': record.symptoms?.pallor ? 'Yes' : 'No',
    'Bleeding': record.symptoms?.bleeding ? 'Yes' : 'No',
    'Weight Loss': record.symptoms?.weightLoss ? 'Yes' : 'No',
    'Night Sweats': record.symptoms?.nightSweats ? 'Yes' : 'No',
    'Lymphadenopathy': record.symptoms?.lymphadenopathy ? 'Yes' : 'No',
    'Hepatomegaly': record.symptoms?.hepatomegaly ? 'Yes' : 'No',
    'Splenomegaly': record.symptoms?.splenomegaly ? 'Yes' : 'No',

    // Narrative History Summary
    'Chief Complaint & History Summary': record.chiefComplaint || '',

    // Complete Blood Count (CBC) Profile
    'Hemoglobin (Hb)': record.labs?.hemoglobin ?? '',
    'WBC Count': record.labs?.wbcCount ?? '',
    'RBC Count': record.labs?.rbcCount ?? '',
    'Hematocrit (HCT)': record.labs?.hematocrit ?? '',
    'Platelet Count': record.labs?.plateletCount ?? '',
    'MCV': record.labs?.mcv ?? '',
    'MCH': record.labs?.mch ?? '',
    'MCHC': record.labs?.mchc ?? '',
    'RDW': record.labs?.rdw ?? '',
    'Absolute Granulocytes': record.labs?.absoluteGranulocytes ?? '',
    'Absolute Lymphocytes': record.labs?.absoluteLymphocytes ?? '',
    'Differential Count': record.labs?.differentialCount || '',

    // Biochemistry & Other Labs
    'LDH': record.labs?.ldh ?? '',
    'Uric Acid': record.labs?.uricAcid ?? '',
    'Serum Creatinine': record.labs?.serumCreatinine ?? '',
    'ALT': record.labs?.alt ?? '',
    'AST': record.labs?.ast ?? '',

    // Diagnosis & Outcome
    'Diagnosis': record.diagnosis || '',
    'Sub Type': record.subType || '',
    'Stage / Risk Group': record.stageRiskGroup || '',
    'IHC Markers': record.ihcMarkers || '',
    'Induction Protocol': record.inductionProtocol || '',
    'Treatment Response': record.treatmentResponse || '',
    'Relapse Date': record.relapseDate || '',
    'Outcome': record.outcome || '',
    
    // Metadata
    'Date Created': record.createdAt ? new Date(record.createdAt).toLocaleDateString() : '',
    'Last Updated': record.updatedAt ? new Date(record.updatedAt).toLocaleDateString() : ''
  };
}

/**
 * Exports an array of MedicalRecord JSON objects into an Excel (.xlsx) file
 */
export function exportRecordsToExcel(records: MedicalRecord[], filenamePrefix = 'Medical_Research_Data') {
  if (!records || records.length === 0) {
    alert('No patient records available to export.');
    return;
  }

  const flatRows = records.map(transformRecordToExcelRow);
  const worksheet = XLSX.utils.json_to_sheet(flatRows);

  const maxCols = Object.keys(flatRows[0] || {});
  const colWidths = maxCols.map((key) => {
    let maxLength = key.length;
    flatRows.forEach((row) => {
      const val = String((row as Record<string, unknown>)[key] || '');
      if (val.length > maxLength) {
        maxLength = Math.min(val.length, 50);
      }
    });
    return { wch: maxLength + 3 };
  });

  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Patient Records');

  const dateStamp = new Date().toISOString().split('T')[0];
  const filename = `${filenamePrefix}_${dateStamp}.xlsx`;

  XLSX.writeFile(workbook, filename);
}
