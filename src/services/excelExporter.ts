import * as XLSX from 'xlsx';
import { MedicalRecord } from '../types/record';

/**
 * Transforms JSON MedicalRecord objects into flat Excel rows
 */
export function transformRecordToExcelRow(record: MedicalRecord) {
  const displayCity = record.city === 'Other City' && record.customCity
    ? record.customCity
    : record.city || '';

  return {
    'Record ID': record.id,
    'Study ID': record.studyId || record.patientId || '',
    'MRN': record.mrn || '',
    'Age': record.age !== undefined && record.age !== null ? record.age : '',
    'Gender': record.gender || '',
    'City (Yemen)': displayCity,
    'Marital Status': record.maritalStatus || '',
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
    'Other Symptoms': record.symptoms?.other ? 'Yes' : 'No',
    'Other Symptoms Description': record.otherSymptomsText || '',

    // Narrative History Summary
    'Chief Complaint & History Summary': record.chiefComplaint || '',

    // Section 3: Laboratory Data
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
    'LDH': record.labs?.ldh ?? '',
    'Uric Acid': record.labs?.uricAcid ?? '',
    'Serum Creatinine': record.labs?.serumCreatinine ?? '',
    'ALT': record.labs?.alt ?? '',
    'AST': record.labs?.ast ?? '',

    // Section 4: Diagnostics
    'Peripheral Blast (%)': record.diagnostics?.peripheralBlast ?? '',
    'Bone Marrow Blast (%)': record.diagnostics?.boneMarrowBlast ?? '',
    'Peripheral Blood Smear Findings': record.diagnostics?.pbsFindings || '',
    'Bone Marrow Cellularity': record.diagnostics?.bmCellularity || '',
    'Bone Marrow Biopsy Summary': record.diagnostics?.bmBiopsySummary || '',
    'Lymph Node Biopsy Performed': record.diagnostics?.lymphNodeBiopsyPerformed ? 'Yes' : 'No',
    'Flow Cytometry Immunophenotyping': record.diagnostics?.flowCytometry || '',
    'Cytogenetics (Karyotype)': record.diagnostics?.cytogenetics || '',
    'Molecular Genetics': record.diagnostics?.molecularGenetics || '',
    'CT Scan / Imaging Findings': record.diagnostics?.ctScanImaging || '',

    // Section 5: Diagnosis
    'Hematological Malignancy Diagnosis': record.diagnosis || '',
    'Disease Subtype / FAB / WHO Classification': record.subType || '',
    'Stage / Risk Group': record.stageRiskGroup || '',
    'Immunohistochemistry (IHC) Markers': record.ihcMarkers || '',

    // Section 6: Treatment & Outcome
    'Line of Treatment': record.lineOfTreatment || record.inductionProtocol || '',
    'Treatment Outcome': record.treatmentOutcome || record.outcome || '',
    
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
