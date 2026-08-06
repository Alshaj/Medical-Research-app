import { create } from 'zustand';
import { MedicalRecord } from '../types/record';

interface RecordStoreState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  selectedGenderFilter: string;
  setSelectedGenderFilter: (gender: string) => void;

  selectedCityFilter: string;
  setSelectedCityFilter: (city: string) => void;

  selectedDiagnosisFilter: string;
  setSelectedDiagnosisFilter: (diagnosis: string) => void;

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

  selectedGenderFilter: 'ALL',
  setSelectedGenderFilter: (gender) => set({ selectedGenderFilter: gender }),

  selectedCityFilter: 'ALL',
  setSelectedCityFilter: (city) => set({ selectedCityFilter: city }),

  selectedDiagnosisFilter: 'ALL',
  setSelectedDiagnosisFilter: (diagnosis) => set({ selectedDiagnosisFilter: diagnosis }),

  selectedOutcomeFilter: 'ALL',
  setSelectedOutcomeFilter: (outcome) => set({ selectedOutcomeFilter: outcome }),

  activeTab: 'list',
  setActiveTab: (tab) => set({ activeTab: tab }),

  editingRecord: null,
  setEditingRecord: (record) => set({ editingRecord: record, activeTab: record ? 'new' : 'list' }),

  viewingRecord: null,
  setViewingRecord: (record) => set({ viewingRecord: record }),

  resetFilters: () =>
    set({
      searchQuery: '',
      selectedGenderFilter: 'ALL',
      selectedCityFilter: 'ALL',
      selectedDiagnosisFilter: 'ALL',
      selectedOutcomeFilter: 'ALL',
    }),
}));
