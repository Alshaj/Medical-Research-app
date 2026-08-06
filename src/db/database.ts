import Dexie, { Table } from 'dexie';
import { MedicalRecord } from '../types/record';

export const db = new Dexie('MedicalResearchPWA_v2') as Dexie & {
  records: Table<MedicalRecord, string>;
};

db.version(1).stores({
  records: 'id, studyId, patientId, diagnosis, outcome, admissionDate, createdAt, updatedAt'
});
