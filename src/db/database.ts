import Dexie, { Table } from 'dexie';
import { MedicalRecord } from '../types/record';

export const db = new Dexie('MedicalResearchPWA_DB') as Dexie & {
  records: Table<MedicalRecord, string>;
};

db.version(1).stores({
  records: 'id, patientId, diagnosis, outcome, admissionDate, createdAt, updatedAt'
});
