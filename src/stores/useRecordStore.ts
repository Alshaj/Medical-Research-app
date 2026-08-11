import { create } from 'zustand';
import { MedicalRecord } from '../types/record';

interface RecordStoreState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedSexFilter: string;
  setSelectedSexFilter: (sex: string) => void;

  selectedPreviousCKDFilter: string;
  setSelectedPreviousCKDFilter: (ckd: string) => void;

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

  selectedSexFilter: 'ALL',
  setSelectedSexFilter: (sex) => set({ selectedSexFilter: sex }),

  selectedPreviousCKDFilter: 'ALL',
  setSelectedPreviousCKDFilter: (ckd) => set({ selectedPreviousCKDFilter: ckd }),

  activeTab: 'list',
  setActiveTab: (tab) => set({ activeTab: tab }),

  editingRecord: null,
  setEditingRecord: (record) => set({ editingRecord: record, activeTab: record ? 'new' : 'list' }),

  viewingRecord: null,
  setViewingRecord: (record) => set({ viewingRecord: record }),

  resetFilters: () =>
    set({
      searchQuery: '',
      selectedSexFilter: 'ALL',
      selectedPreviousCKDFilter: 'ALL',
    }),
}));
