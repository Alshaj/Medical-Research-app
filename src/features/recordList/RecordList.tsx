import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search, Download, Plus, Edit3, Trash2, Eye, Filter, FileSpreadsheet, Upload, RotateCcw } from 'lucide-react';

import { db } from '../../db/database';
import { recordRepository } from '../../db/repository';
import { useRecordStore } from '../../stores/useRecordStore';
import { exportRecordsToExcel } from '../../services/excelExporter';
import { MedicalRecord } from '../../types/record';
import { Button } from '../../components/ui/Button';

export const RecordList: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedSexFilter,
    setSelectedSexFilter,
    selectedPreviousCKDFilter,
    setSelectedPreviousCKDFilter,
    resetFilters,
    setActiveTab,
    setEditingRecord,
    setViewingRecord,
  } = useRecordStore();

  // Reactive IndexedDB query using Dexie liveQuery
  const records = useLiveQuery(
    async () => {
      const collection = db.records.orderBy('updatedAt').reverse();
      return await collection.toArray();
    },
    [],
    [] as MedicalRecord[]
  );

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedSexFilter !== 'ALL' ||
    selectedPreviousCKDFilter !== 'ALL';

  // Filter records based on search query & filters
  const filteredRecords = React.useMemo(() => {
    return (records || []).filter((rec: MedicalRecord) => {
      // Sex filter
      const recSex = rec.sex || rec.gender || '';
      if (selectedSexFilter !== 'ALL') {
        if (selectedSexFilter === 'Male' && recSex !== 'Male' && recSex !== '1' && recSex !== '1 = Male') return false;
        if (selectedSexFilter === 'Female' && recSex !== 'Female' && recSex !== '2' && recSex !== '2 = Female') return false;
        if (selectedSexFilter !== 'Male' && selectedSexFilter !== 'Female' && recSex !== selectedSexFilter) return false;
      }

      // Previous CKD filter
      if (selectedPreviousCKDFilter !== 'ALL') {
        const recCKD = rec.previousCKD || rec.pmhx?.previousCKD || '';
        if (selectedPreviousCKDFilter === 'Yes' && recCKD !== 'Yes' && recCKD !== '1' && recCKD !== '1 = Yes') return false;
        if (selectedPreviousCKDFilter === 'No' && recCKD !== 'No' && recCKD !== '0' && recCKD !== '0 = No') return false;
        if (selectedPreviousCKDFilter !== 'Yes' && selectedPreviousCKDFilter !== 'No' && recCKD !== selectedPreviousCKDFilter) return false;
      }

      // Search query across ID, Profile No, age, sex, labs
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const idStr = (rec.studyId || rec.patientId || rec.id).toLowerCase();
      const profStr = (rec.profileNo || '').toLowerCase();
      const ageStr = rec.age !== undefined && rec.age !== null ? String(rec.age) : '';

      return (
        idStr.includes(q) ||
        profStr.includes(q) ||
        ageStr.includes(q) ||
        recSex.toLowerCase().includes(q) ||
        (rec.labs?.hb && rec.labs.hb.toLowerCase().includes(q)) ||
        (rec.labs?.ldh && rec.labs.ldh.toLowerCase().includes(q))
      );
    });
  }, [records, searchQuery, selectedSexFilter, selectedPreviousCKDFilter]);

  const handleDelete = async (id: string, studyId: string) => {
    if (confirm(`Are you sure you want to delete patient record "${studyId}"?`)) {
      await recordRepository.deleteRecord(id);
    }
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
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const jsonContent = event.target?.result as string;
        const count = await recordRepository.importJSONBackup(jsonContent);
        alert(`Successfully restored ${count} records into your device storage.`);
      } catch (err) {
        alert('Invalid JSON file format. Restore failed.');
      }
    };
    reader.readAsText(file);
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
            onClick={() => exportRecordsToExcel(filteredRecords)}
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
              onClick={resetFilters}
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
            placeholder="Search by ID, Age, Sex, Lab values..."
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

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Sex Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Sex</label>
            <select
              value={selectedSexFilter}
              onChange={(e) => setSelectedSexFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="ALL">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Previous CKD Filter */}
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Previous CKD</label>
            <select
              value={selectedPreviousCKDFilter}
              onChange={(e) => setSelectedPreviousCKDFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white"
            >
              <option value="ALL">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
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
              ? 'Your local database is currently empty. Click "New Patient" to add a record.'
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
              onDelete={() => handleDelete(record.id, record.studyId || record.patientId || record.id)}
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
  const displayId = record.studyId || record.patientId || 'Unassigned';
  const displayAge = record.age !== undefined && record.age !== null ? `${record.age}y` : 'N/A';
  const rawSex = record.sex || record.gender || 'N/A';
  const displaySex = (rawSex === '1' || rawSex === '1 = Male') ? 'Male' : (rawSex === '2' || rawSex === '2 = Female') ? 'Female' : rawSex;
  const rawCKD = record.previousCKD || record.pmhx?.previousCKD || 'N/A';
  const displayPreviousCKD = (rawCKD === '1' || rawCKD === '1 = Yes') ? 'Yes' : (rawCKD === '0' || rawCKD === '0 = No') ? 'No' : rawCKD;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-100">
              ID: {displayId}
            </span>
            {record.profileNo && (
              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200" title="Profile No">
                Prof: {record.profileNo}
              </span>
            )}
          </div>
          {displayPreviousCKD !== 'N/A' && (
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${
              displayPreviousCKD === 'Yes' || displayPreviousCKD === '1' || displayPreviousCKD === '1 = Yes'
                ? 'bg-rose-100 text-rose-800 border-rose-200'
                : 'bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}>
              Prior CKD: {displayPreviousCKD}
            </span>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
          <div>
            <span className="text-slate-400">Age:</span>{' '}
            <span className="font-medium text-slate-700">{displayAge}</span>
          </div>
          <div>
            <span className="text-slate-400">Sex:</span>{' '}
            <span className="font-medium text-slate-700">{displaySex}</span>
          </div>
          <div>
            <span className="text-slate-400">Hb:</span>{' '}
            <span className="font-medium text-slate-700">{record.labs?.hb ?? 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400">WBC:</span>{' '}
            <span className="font-medium text-slate-700">{record.labs?.wbcCount ?? 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400">S. Cr:</span>{' '}
            <span className="font-medium text-slate-700">{record.labs?.sCr ?? 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400">eGFR:</span>{' '}
            <span className="font-medium text-slate-700">{record.labs?.egfr ?? 'N/A'}</span>
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
