import React from 'react';
import { X, User, Activity, FlaskConical, Copy } from 'lucide-react';
import { MedicalRecord } from '../../types/record';
import { Button } from '../../components/ui/Button';

interface RecordDetailModalProps {
  record: MedicalRecord | null;
  onClose: () => void;
}

export const RecordDetailModal: React.FC<RecordDetailModalProps> = ({ record, onClose }) => {
  if (!record) return null;

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(record, null, 2));
    alert('Full Record JSON copied to clipboard!');
  };

  const displayAge = record.age !== undefined && record.age !== null ? String(record.age) : 'N/A';
  const displayWeight = record.weight !== undefined && record.weight !== null ? String(record.weight) : 'N/A';
  const rawSex = record.sex || record.gender || '';
  const displaySex = (rawSex === '1' || rawSex === '1 = Male') ? 'Male' : (rawSex === '2' || rawSex === '2 = Female') ? 'Female' : (rawSex || 'N/A');
  const rawCKD = record.previousCKD || record.pmhx?.previousCKD || '';
  const displayPreviousCKD = (rawCKD === '1' || rawCKD === '1 = Yes') ? 'Yes' : (rawCKD === '0' || rawCKD === '0 = No') ? 'No' : (rawCKD || 'N/A');

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-auto animate-fade-in">
        {/* Header */}
        <div className="bg-teal-800 text-white p-4 sm:p-5 flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider bg-teal-700 text-teal-100 px-2 py-0.5 rounded font-mono">
                ID: {record.studyId || record.patientId || record.id}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold mt-1.5 leading-snug">Patient Case Detail</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700 transition shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto text-xs sm:text-sm">
          {/* Section 1: Demographics */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <User className="w-4 h-4" /> 1. Demographics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">ID:</span>
                <span className="font-semibold text-slate-700">{record.studyId || record.patientId || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Age:</span>
                <span className="font-semibold text-slate-700">{displayAge}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Sex:</span>
                <span className="font-semibold text-slate-700">{displaySex}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Date of Admission:</span>
                <span className="font-semibold text-slate-700">{record.admissionDate || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Weight:</span>
                <span className="font-semibold text-slate-700">{displayWeight}</span>
              </div>
            </div>
          </div>

          {/* Section 2: PMHX */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <Activity className="w-4 h-4" /> 2. PMHX
            </h3>
            <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">Previous CKD?:</span>
                <span className="font-semibold text-slate-700">{displayPreviousCKD}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Labs */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <FlaskConical className="w-4 h-4" /> 3. Labs
            </h3>
            <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-slate-700">
                <div><span className="text-slate-400 block">Hb:</span> <span className="font-medium">{record.labs?.hb || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">WBC count:</span> <span className="font-medium">{record.labs?.wbcCount || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">Platelets count:</span> <span className="font-medium">{record.labs?.plateletsCount || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">S. Cr:</span> <span className="font-medium">{record.labs?.sCr || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">eGFR:</span> <span className="font-medium">{record.labs?.egfr || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">RI:</span> <span className="font-medium">{record.labs?.ri || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">B. Urea:</span> <span className="font-medium">{record.labs?.bUrea || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">Ca:</span> <span className="font-medium">{record.labs?.ca || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">LDH:</span> <span className="font-medium">{record.labs?.ldh || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">uric acid:</span> <span className="font-medium">{record.labs?.uricAcid || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">B2 Microglobulin:</span> <span className="font-medium">{record.labs?.b2Microglobulin || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">Bone marrow plasma cell %:</span> <span className="font-medium">{record.labs?.bmPlasmaCellPercent || 'N/A'}</span></div>
              </div>

              {/* SPEP Bands */}
              <div className="pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-700 block mb-1.5">Serum Protein Electrophoresis Bands:</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                  <div><span className="text-slate-400">Albumin:</span> {record.labs?.spepAlbumin || 'N/A'}</div>
                  <div><span className="text-slate-400">Alpha 1 Globulin:</span> {record.labs?.spepAlpha1Globulin || 'N/A'}</div>
                  <div><span className="text-slate-400">Alpha 2 Globulin:</span> {record.labs?.spepAlpha2Globulin || 'N/A'}</div>
                  <div><span className="text-slate-400">Beta Globulin:</span> {record.labs?.spepBetaGlobulin || 'N/A'}</div>
                  <div><span className="text-slate-400">Gamma Globulin:</span> {record.labs?.spepGammaGlobulin || 'N/A'}</div>
                  <div><span className="text-slate-400">A/G Ratio:</span> {record.labs?.spepAgRatio || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-row items-center justify-between gap-2">
          <Button variant="outline" size="sm" icon={<Copy className="w-4 h-4" />} onClick={handleCopyJSON}>
            Copy JSON
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
