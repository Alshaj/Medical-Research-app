import { db } from './database';
import { MedicalRecord, MedicalRecordInput } from '../types/record';

export const recordRepository = {
  /**
   * Save or update a patient record JSON document in IndexedDB
   */
  async saveRecord(record: MedicalRecordInput): Promise<string> {
    const now = new Date().toISOString();
    const id = record.id || `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const studyId = record.studyId !== undefined ? record.studyId : (record.patientId !== undefined ? record.patientId : null);

    const fullRecord: MedicalRecord = {
      ...record,
      id,
      studyId: studyId || null,
      patientId: studyId || null,
      createdAt: record.createdAt || now,
      updatedAt: now,
      labs: {
        ...(record.labs || {}),
      },
    };

    await db.records.put(fullRecord);
    return id;
  },

  /**
   * Fetch single record by ID
   */
  async getRecordById(id: string): Promise<MedicalRecord | undefined> {
    return await db.records.get(id);
  },

  /**
   * Delete record by ID
   */
  async deleteRecord(id: string): Promise<void> {
    await db.records.delete(id);
  },

  /**
   * Clear all records
   */
  async clearAllRecords(): Promise<void> {
    await db.records.clear();
  },

  /**
   * Export all database records as JSON string backup
   */
  async exportJSONBackup(): Promise<string> {
    const allRecords = await db.records.toArray();
    return JSON.stringify(allRecords, null, 2);
  },

  /**
   * Import JSON backup into IndexedDB
   */
  async importJSONBackup(jsonString: string): Promise<number> {
    try {
      const records: MedicalRecord[] = JSON.parse(jsonString);
      if (!Array.isArray(records)) {
        throw new Error('Invalid JSON format: expected an array of records');
      }

      await db.transaction('rw', db.records, async () => {
        for (const record of records) {
          if (record.id) {
            await db.records.put(record);
          }
        }
      });

      return records.length;
    } catch (err) {
      console.error('Failed to import JSON backup', err);
      throw err;
    }
  }
};
