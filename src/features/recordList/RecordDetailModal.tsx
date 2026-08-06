import React from 'react';
import { X, FileText, Activity, FlaskConical, Stethoscope, Copy } from 'lucide-react';
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

  const presentSymptoms = Object.entries(record.symptoms || {})
    .filter(([_, val]) => val)
    .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-8 animate-fade-in">
        {/* Header */}
        <div className="bg-teal-800 text-white p-5 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider bg-teal-700 text-teal-100 px-2.5 py-0.5 rounded font-mono">
              {record.patientId}
            </span>
            <h2 className="text-xl font-bold mt-1">{record.diagnosis}</h2>
            {record.subType && <p className="text-xs text-teal-200">{record.subType}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-teal-200 hover:text-white hover:bg-teal-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">
          {/* General Demographics */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <Stethoscope className="w-4 h-4" /> Demographics & Admission
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">Age:</span>
                <span className="font-semibold text-slate-700">{record.age ? `${record.age} years` : 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Gender:</span>
                <span className="font-semibold text-slate-700">{record.gender || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">City (Yemen):</span>
                <span className="font-semibold text-slate-700">{record.city || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Marital Status:</span>
                <span className="font-semibold text-slate-700">{record.maritalStatus || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Occupation:</span>
                <span className="font-semibold text-slate-700">{record.occupation || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Admission Date:</span>
                <span className="font-semibold text-slate-700">{record.admissionDate || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Clinical Symptoms */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <Activity className="w-4 h-4" /> Clinical Symptoms & History
            </h3>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-3">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Present Symptoms:</span>
                {presentSymptoms.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {presentSymptoms.map((sym) => (
                      <span key={sym} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 border border-teal-200">
                        {sym}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-slate-500 italic">No symptoms toggled</span>
                )}
              </div>

              {record.chiefComplaint && (
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Chief Complaint & History Summary:</span>
                  <p className="text-xs text-slate-700 mt-0.5 whitespace-pre-wrap">{record.chiefComplaint}</p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Laboratory Data */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <FlaskConical className="w-4 h-4" /> 3. Laboratory Data
            </h3>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-3 text-xs">
              <div>
                <span className="font-semibold text-slate-700 block mb-1">Complete Blood Count (CBC) Profile:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700">
                  <div><span className="text-slate-400">Hb:</span> {record.labs?.hemoglobin ?? 'N/A'}</div>
                  <div><span className="text-slate-400">WBC Count:</span> {record.labs?.wbcCount ?? 'N/A'}</div>
                  <div><span className="text-slate-400">RBC Count:</span> {record.labs?.rbcCount ?? 'N/A'}</div>
                  <div><span className="text-slate-400">Hematocrit:</span> {record.labs?.hematocrit ?? 'N/A'}</div>
                  <div><span className="text-slate-400">Platelet Count:</span> {record.labs?.plateletCount ?? 'N/A'}</div>
                  <div><span className="text-slate-400">MCV:</span> {record.labs?.mcv ?? 'N/A'}</div>
                  <div><span className="text-slate-400">MCH:</span> {record.labs?.mch ?? 'N/A'}</div>
                  <div><span className="text-slate-400">MCHC:</span> {record.labs?.mchc ?? 'N/A'}</div>
                  <div><span className="text-slate-400">RDW:</span> {record.labs?.rdw ?? 'N/A'}</div>
                  <div><span className="text-slate-400">Abs Granulocytes:</span> {record.labs?.absoluteGranulocytes ?? 'N/A'}</div>
                  <div><span className="text-slate-400">Abs Lymphocytes:</span> {record.labs?.absoluteLymphocytes ?? 'N/A'}</div>
                  <div><span className="text-slate-400">Diff Count:</span> {record.labs?.differentialCount ?? 'N/A'}</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <span className="font-semibold text-slate-700 block mb-1">Biochemistry & Other Labs:</span>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-slate-700">
                  <div><span className="text-slate-400">LDH:</span> {record.labs?.ldh ?? 'N/A'}</div>
                  <div><span className="text-slate-400">Uric Acid:</span> {record.labs?.uricAcid ?? 'N/A'}</div>
                  <div><span className="text-slate-400">Creatinine:</span> {record.labs?.serumCreatinine ?? 'N/A'}</div>
                  <div><span className="text-slate-400">ALT:</span> {record.labs?.alt ?? 'N/A'}</div>
                  <div><span className="text-slate-400">AST:</span> {record.labs?.ast ?? 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnosis & Outcome */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <FileText className="w-4 h-4" /> Outcome & Protocol
            </h3>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div><span className="text-slate-400 block">Stage / Risk:</span><span className="font-semibold text-slate-700">{record.stageRiskGroup || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">Protocol:</span><span className="font-semibold text-slate-700">{record.inductionProtocol || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">Outcome:</span><span className="font-semibold text-emerald-700">{record.outcome || 'N/A'}</span></div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <Button variant="outline" size="sm" icon={<Copy className="w-4 h-4" />} onClick={handleCopyJSON}>
            Copy JSON Document
          </Button>
          <Button variant="primary" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
