import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search, Download, Plus, Edit3, Trash2, Eye, Filter, FileSpreadsheet, Upload, RotateCcw } from 'lucide-react';

import { db } from '../../db/database';
import { recordRepository } from '../../db/repository';
import { useRecordStore } from '../../stores/useRecordStore';
import { useToastStore } from '../../stores/useToastStore';
import { exportRecordsToExcel } from '../../services/excelExporter';
import { MedicalRecord } from '../../types/record';
import { Button } from '../../components/ui/Button';

const YEMENI_CITIES = [
  "Sana'a",
  'Aden',
  'Taiz',
  'Al Hudaydah',
  'Mukalla',
  'Ibb',
  'Dhamar',
  'Amran',
  'Sayyan',
  'Saada',
  'Al Mahrah',
  'Hajjah',
  'Shabwah',
  'Abyan',
  'Lahij',
  'Marib',
  'Al Bayda',
  'Socotra',
  'Other City'
];

const DIAGNOSIS_LIST = [
  'Acute Myeloid Leukemia (AML)',
  'Acute Lymphoblastic Leukemia (ALL)',
  'Chronic Myeloid Leukemia (CML)',
  'Chronic Lymphocytic Leukemia (CLL)',
  'Hodgkin Lymphoma',
  'Non-Hodgkin Lymphoma',
  'Diffuse Large B-cell Lymphoma (DLBCL)',
  'Burkitt Lymphoma',
  'Mantle Cell Lymphoma',
  'Follicular Lymphoma',
  'T-cell Lymphoma',
  'Multiple Myeloma',
  'Plasma Cell Leukemia',
  'Myelodysplastic Syndrome (MDS)',
  'Myeloproliferative Neoplasms (MPN)',
  'Chronic Myelomonocytic Leukemia (CMML)',
  'Hairy Cell Leukemia',
  'Other Hematological Malignancy'
];

export const RecordList: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedGenderFilter,
    setSelectedGenderFilter,
    selectedCityFilter,
    setSelectedCityFilter,
    selectedDiagnosisFilter,
    setSelectedDiagnosisFilter,
    selectedOutcomeFilter,
    setSelectedOutcomeFilter,
    resetFilters,
    setActiveTab,
    setEditingRecord,
    setViewingRecord,
  } = useRecordStore();

  const { addToast, openConfirmModal } = useToastStore();

  // Reactive IndexedDB query using Dexie liveQuery
  const records = useLiveQuery(
    async () => {
      let collection = db.records.orderBy('updatedAt').reverse();
      return await collection.toArray();
    },
    [],
    [] as MedicalRecord[]
  );

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedGenderFilter !== 'ALL' ||
    selectedCityFilter !== 'ALL' ||
    selectedDiagnosisFilter !== 'ALL' ||
    selectedOutcomeFilter !== 'ALL';

  // Filter records based on user search query & multi-filters
  const filteredRecords = React.useMemo(() => {
    return (records || []).filter((rec: MedicalRecord) => {
      // Gender filter
      if (selectedGenderFilter !== 'ALL' && rec.gender !== selectedGenderFilter) {
        return false;
      }

      // City filter
      if (selectedCityFilter !== 'ALL') {
        if (selectedCityFilter === 'Other City') {
          if (rec.city !== 'Other City') return false;
        } else if (rec.city !== selectedCityFilter) {
          return false;
        }
      }

      // Diagnosis filter
      if (selectedDiagnosisFilter !== 'ALL') {
        const displayDiag = rec.diagnosis === 'Other Hematological Malignancy' && rec.customDiagnosis
          ? rec.customDiagnosis
          : rec.diagnosis;
        if (rec.diagnosis !== selectedDiagnosisFilter && displayDiag !== selectedDiagnosisFilter) {
          return false;
        }
      }

      // Outcome filter
      if (selectedOutcomeFilter !== 'ALL') {
        const recOutcome = rec.outcome || rec.treatmentOutcome;
        if (recOutcome !== selectedOutcomeFilter) return false;
      }

      // Search query across Study ID, MRN, diagnosis, subtype, complaint, outcome
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const idStr = (rec.studyId || rec.patientId || '').toLowerCase();
      const mrnStr = (rec.mrn || '').toLowerCase();

      return (
        idStr.includes(q) ||
        mrnStr.includes(q) ||
        rec.diagnosis.toLowerCase().includes(q) ||
        (rec.subType && rec.subType.toLowerCase().includes(q)) ||
        (rec.chiefComplaint && rec.chiefComplaint.toLowerCase().includes(q)) ||
        (rec.outcome && rec.outcome.toLowerCase().includes(q))
      );
    });
  }, [records, searchQuery, selectedGenderFilter, selectedCityFilter, selectedDiagnosisFilter, selectedOutcomeFilter]);

  const handleDelete = (id: string, studyId: string) => {
    openConfirmModal({
      title: 'Delete Patient Record',
      message: `Are you sure you want to delete patient record "${studyId}"? This action cannot be undone.`,
      confirmText: 'Delete Record',
      onConfirm: async () => {
        await recordRepository.deleteRecord(id);
        addToast('warning', `Record "${studyId}" deleted.`);
      },
    });
  };

  const handleExportJSON = async () => {
    const jsonStr = await recordRepository.exportJSONBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MedResearch_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('info', 'Downloaded JSON database backup file.');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonContent = event.target?.result as string;
        const count = await recordRepository.importJSONBackup(jsonContent);
        addToast('success', `Successfully restored ${count} records into local storage.`);
      } catch (err) {
        addToast('error', 'Invalid JSON file format. Restore failed.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportExcelClick = () => {
    if (filteredRecords.length === 0) {
      addToast('warning', 'No patient records available to export.');
      return;
    }
    exportRecordsToExcel(filteredRecords);
    addToast('success', `Exported ${filteredRecords.length} records to Excel spreadsheet!`);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Patient Research Records</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {filteredRecords.length} of {records.length} records stored in local JSON database
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            icon={<FileSpreadsheet className="w-4 h-4 text-emerald-700" />}
            onClick={handleExportExcelClick}
            disabled={filteredRecords.length === 0}
          >
            Export to Excel
          </Button>

          <Button
            variant="outline"
            size="sm"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleExportJSON}
            title="Download JSON Database Backup"
          >
            JSON Backup
          </Button>

          <label className="cursor-pointer">
            <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            <span className="inline-flex items-center justify-center font-medium rounded-lg text-xs px-3 py-1.5 gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-sm transition">
              <Upload className="w-3.5 h-3.5" /> Restore JSON
            </span>
          </label>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              setEditingRecord(null);
              setActiveTab('new');
            }}
          >
            New Patient
          </Button>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 border-b border-slate-100 pb-2">
          <span className="flex items-center gap-1.5 text-teal-800">
            <Filter className="w-4 h-4 text-teal-700" /> Filter & Search Records
          </span>
          {hasActiveFilters && (
            <button
              onClick={() => {
                resetFilters();
                addToast('info', 'Filters reset.');
              }}
              className="flex items-center gap-1 text-teal-700 hover:text-teal-900 font-medium transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
            </button>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Study ID, MRN, Diagnosis, Symptoms, Complaint..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid: Gender, City, Diagnosis, Outcome */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {/* 1. Gender Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Gender</label>
            <select
              value={selectedGenderFilter}
              onChange={(e) => setSelectedGenderFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="ALL">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* 2. City Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">City (Yemen)</label>
            <select
              value={selectedCityFilter}
              onChange={(e) => setSelectedCityFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="ALL">All Cities</option>
              {YEMENI_CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Diagnosis Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Diagnosis</label>
            <select
              value={selectedDiagnosisFilter}
              onChange={(e) => setSelectedDiagnosisFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="ALL">All Diagnoses</option>
              {DIAGNOSIS_LIST.map((diag) => (
                <option key={diag} value={diag}>
                  {diag}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Outcome Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Treatment Outcome</label>
            <select
              value={selectedOutcomeFilter}
              onChange={(e) => setSelectedOutcomeFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="ALL">All Outcomes</option>
              <option value="Complete Remission (CR)">Complete Remission (CR)</option>
              <option value="Partial Remission (PR)">Partial Remission (PR)</option>
              <option value="Stable Disease (SD)">Stable Disease (SD)</option>
              <option value="Progressive Disease (PD)">Progressive Disease (PD)</option>
              <option value="Relapsed">Relapsed</option>
              <option value="Deceased">Deceased</option>
              <option value="Lost to Follow-up">Lost to Follow-up</option>
              <option value="Ongoing Treatment">Ongoing Treatment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Record List Grid / Cards */}
      {filteredRecords.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-700">No Patient Records Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {records.length === 0
              ? 'Your local IndexedDB is currently empty. Click "New Patient" to add a record.'
              : 'No records match your active search and filter criteria.'}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={resetFilters} icon={<RotateCcw className="w-3.5 h-3.5" />}>
              Reset Active Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecords.map((record: MedicalRecord) => (
            <RecordCard
              key={record.id}
              record={record}
              onEdit={() => {
                setEditingRecord(record);
                setActiveTab('new');
              }}
              onView={() => setViewingRecord(record)}
              onDelete={() => handleDelete(record.id, record.studyId || record.patientId || 'Record')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface RecordCardProps {
  record: MedicalRecord;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}

const RecordCard: React.FC<RecordCardProps> = ({ record, onEdit, onView, onDelete }) => {
  const activeSymptomsCount = Object.values(record.symptoms || {}).filter(Boolean).length;

  const outcomeColors: Record<string, string> = {
    'Complete Remission (CR)': 'bg-emerald-100 text-emerald-800 border-emerald-200',
    'Partial Remission (PR)': 'bg-teal-100 text-teal-800 border-teal-200',
    'Stable Disease (SD)': 'bg-sky-100 text-sky-800 border-sky-200',
    'Progressive Disease (PD)': 'bg-amber-100 text-amber-800 border-amber-200',
    'Relapsed': 'bg-rose-100 text-rose-800 border-rose-200',
    'Deceased': 'bg-slate-100 text-slate-800 border-slate-300',
    'Lost to Follow-up': 'bg-purple-100 text-purple-800 border-purple-200',
    'Ongoing Treatment': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  };

  const currentOutcome = record.outcome || record.treatmentOutcome || 'No Outcome';
  const outcomeBadge = outcomeColors[currentOutcome] || 'bg-slate-100 text-slate-700 border-slate-200';

  const displayCity = record.city === 'Other City' && record.customCity ? record.customCity : record.city;

  const displayDiagnosis = record.diagnosis === 'Other Hematological Malignancy' && record.customDiagnosis
    ? record.customDiagnosis
    : record.diagnosis;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
            Study ID: {record.studyId || record.patientId}
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${outcomeBadge}`}>
            {currentOutcome}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-800 mt-3 line-clamp-1">{displayDiagnosis}</h3>
        {record.subType && <p className="text-xs text-slate-500">{record.subType}</p>}

        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div>
            <span className="text-slate-400">MRN:</span>{' '}
            <span className="font-medium text-slate-700">{record.mrn || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400">Gender / Age:</span>{' '}
            <span className="font-medium text-slate-700">{record.gender || 'N/A'}{record.age ? `, ${record.age}y` : ''}</span>
          </div>
          <div>
            <span className="text-slate-400">City:</span>{' '}
            <span className="font-medium text-slate-700">{displayCity || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400">Hb / WBC:</span>{' '}
            <span className="font-medium text-slate-700">
              {record.labs?.hemoglobin ?? '-'} / {record.labs?.wbcCount ?? '-'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <span className="text-slate-400 text-[10px]">Updated: {new Date(record.updatedAt).toLocaleDateString()}</span>
        <div className="flex items-center gap-1">
          <button
            onClick={onView}
            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition"
            title="Edit Record"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
