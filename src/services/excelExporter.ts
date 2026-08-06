import * as XLSX from 'xlsx';
import { MedicalRecord } from '../types/record';

/**
 * Transforms JSON MedicalRecord objects into flat Excel rows
 * matching all fields from the UI screenshots + City & Marital Status.
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

    // Narrative Medical History
    'Chief Complaint': record.chiefComplaint || '',
    'Past Medical History': record.pastMedicalHistory || '',
    'Family History': record.familyHistory || '',

    // Labs & Diagnostics
    'Hemoglobin (Hb, g/dL)': record.labs?.hemoglobin ?? '',
    'WBC (x10^9/L)': record.labs?.wbc ?? '',
    'Platelets (x10^9/L)': record.labs?.platelets ?? '',
    'ALT (U/L)': record.labs?.alt ?? '',
    'AST (U/L)': record.labs?.ast ?? '',
    'PBS Blasts (%)': record.labs?.pbsBlasts ?? '',
    'PBS Findings': record.labs?.pbsFindings || '',
    'BM Aspirate Blast (%)': record.labs?.bmAspirateBlast ?? '',
    'BM Cellularity': record.labs?.bmCellularity || '',
    'BM Biopsy Summary': record.labs?.bmBiopsySummary || '',
    'Flow Cytometry': record.labs?.flowCytometry || '',
    'Cytogenetics': record.labs?.cytogenetics || '',
    'Molecular Genetics': record.labs?.molecularGenetics || '',

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

  // Map JSON objects to Excel flat row representation
  const flatRows = records.map(transformRecordToExcelRow);

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(flatRows);

  // Auto-calculate column widths
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

  // Create workbook and append sheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Patient Records');

  // Format date stamp for filename
  const dateStamp = new Date().toISOString().split('T')[0];
  const filename = `${filenamePrefix}_${dateStamp}.xlsx`;

  // Trigger browser download
  XLSX.writeFile(workbook, filename);
}
