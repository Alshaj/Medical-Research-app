import { create } from 'zustand';
import { MedicalRecord } from '../types/record';

interface RecordStoreState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedOutcomeFilter: string;
  setSelectedOutcomeFilter: (outcome: string) => void;

  activeTab: 'list' | 'new' | 'analytics';
  setActiveTab: (tab: 'list' | 'new' | 'analytics') => void;

  editingRecord: MedicalRecord | null;
  setEditingRecord: (record: MedicalRecord | null) => void;

  viewingRecord: MedicalRecord | null;
  setViewingRecord: (record: MedicalRecord | null) => void;

  resetFilters: () => void;
}

export const useRecordStore = create<RecordStoreState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  selectedOutcomeFilter: 'ALL',
  setSelectedOutcomeFilter: (outcome) => set({ selectedOutcomeFilter: outcome }),

  activeTab: 'list',
  setActiveTab: (tab) => set({ activeTab: tab }),

  editingRecord: null,
  setEditingRecord: (record) => set({ editingRecord: record, activeTab: record ? 'new' : 'list' }),

  viewingRecord: null,
  setViewingRecord: (record) => set({ viewingRecord: record }),

  resetFilters: () => set({ searchQuery: '', selectedOutcomeFilter: 'ALL' })
}));
