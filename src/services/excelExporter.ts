import * as XLSX from 'xlsx';
import { MedicalRecord } from '../types/record';

/**
 * Transforms JSON MedicalRecord objects into flat Excel rows
 */
export function transformRecordToExcelRow(record: MedicalRecord) {
  // Map Sex: Male -> 1, Female -> 2
  let sexVal: number | string = '';
  const rawSex = (record.sex || record.gender || '').trim();
  if (rawSex.toLowerCase() === 'male' || rawSex === '1' || rawSex === '1 = Male') {
    sexVal = 1;
  } else if (rawSex.toLowerCase() === 'female' || rawSex === '2' || rawSex === '2 = Female') {
    sexVal = 2;
  } else if (rawSex) {
    sexVal = rawSex;
  }

  // Map Previous CKD?: Yes -> 1, No -> 0
  let ckdVal: number | string = '';
  const rawCKD = (record.previousCKD || record.pmhx?.previousCKD || '').trim();
  if (rawCKD.toLowerCase() === 'yes' || rawCKD === '1' || rawCKD === '1 = Yes') {
    ckdVal = 1;
  } else if (rawCKD.toLowerCase() === 'no' || rawCKD === '0' || rawCKD === '0 = No') {
    ckdVal = 0;
  } else if (rawCKD) {
    ckdVal = rawCKD;
  }

  // Map RI: Yes -> 1, No -> 0
  let riVal: number | string = '';
  const rawRI = (record.labs?.ri || '').trim();
  if (rawRI.toLowerCase() === 'yes' || rawRI === '1' || rawRI === '1 = Yes') {
    riVal = 1;
  } else if (rawRI.toLowerCase() === 'no' || rawRI === '0' || rawRI === '0 = No') {
    riVal = 0;
  } else if (rawRI) {
    riVal = rawRI;
  }

  return {
    'ID': record.studyId || record.patientId || '',
    'Age': record.age !== undefined && record.age !== null ? record.age : '',
    'Sex': sexVal,
    'Date of Admission': record.admissionDate || '',
    'Weight': record.weight !== undefined && record.weight !== null ? record.weight : '',

    // Section 2: PMHX
    'Previous CKD?': ckdVal,

    // Section 3: Labs
    'Hb': record.labs?.hb ?? '',
    'WBC count': record.labs?.wbcCount ?? '',
    'Platelets count': record.labs?.plateletsCount ?? '',
    'S. Cr': record.labs?.sCr ?? '',
    'eGFR': record.labs?.egfr ?? '',
    'RI': riVal,
    'B. Urea': record.labs?.bUrea ?? '',
    'Ca': record.labs?.ca ?? '',
    'LDH': record.labs?.ldh ?? '',
    'uric acid': record.labs?.uricAcid ?? '',
    'B2 Microglobulin': record.labs?.b2Microglobulin ?? '',
    'Bone Marrow Plasma Cell %': record.labs?.bmPlasmaCellPercent ?? '',

    // SPEP Bands
    'SPEP - Albumin': record.labs?.spepAlbumin ?? '',
    'SPEP - Alpha 1 Globulin': record.labs?.spepAlpha1Globulin ?? '',
    'SPEP - Alpha 2 Globulin': record.labs?.spepAlpha2Globulin ?? '',
    'SPEP - Beta Globulin': record.labs?.spepBetaGlobulin ?? '',
    'SPEP - Gamma Globulin': record.labs?.spepGammaGlobulin ?? '',
    'SPEP - A/G Ratio': record.labs?.spepAgRatio ?? '',

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
