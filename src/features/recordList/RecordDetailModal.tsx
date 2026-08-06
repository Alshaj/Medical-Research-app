import React from 'react';
import { X, FileText, Activity, FlaskConical, Stethoscope, Copy, Microchip, Award } from 'lucide-react';
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
    .filter(([key, val]) => val && key !== 'other')
    .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()));

  if (record.symptoms?.other) {
    presentSymptoms.push(record.otherSymptomsText ? `Other (${record.otherSymptomsText})` : 'Other');
  }

  const displayCity = record.city === 'Other City' && record.customCity ? record.customCity : record.city;

  const displayDiagnosis = record.diagnosis === 'Other Hematological Malignancy' && record.customDiagnosis
    ? record.customDiagnosis
    : record.diagnosis;

  const rawTreatment = record.lineOfTreatment || record.inductionProtocol;
  const displayTreatment = (rawTreatment === 'Other') && record.customLineOfTreatment
    ? record.customLineOfTreatment
    : rawTreatment;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl border border-slate-200 overflow-hidden my-auto animate-fade-in">
        {/* Header */}
        <div className="bg-teal-800 text-white p-4 sm:p-5 flex items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs uppercase tracking-wider bg-teal-700 text-teal-100 px-2 py-0.5 rounded font-mono">
                Study ID: {record.studyId || record.patientId}
              </span>
              {record.mrn && (
                <span className="text-[10px] sm:text-xs tracking-wider bg-teal-900 text-teal-200 px-2 py-0.5 rounded font-mono">
                  MRN: {record.mrn}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold mt-1.5 leading-snug">{displayDiagnosis}</h2>
            {record.subType && <p className="text-xs text-teal-200 mt-0.5">{record.subType}</p>}
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
          {/* Section 1 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <Stethoscope className="w-4 h-4" /> 1. General & Demographics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block">Study ID:</span>
                <span className="font-semibold text-slate-700">{record.studyId || record.patientId}</span>
              </div>
              <div>
                <span className="text-slate-400 block">MRN:</span>
                <span className="font-semibold text-slate-700">{record.mrn || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Age / Gender:</span>
                <span className="font-semibold text-slate-700">{record.age ? `${record.age}y` : 'N/A'}, {record.gender || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">City (Yemen):</span>
                <span className="font-semibold text-slate-700">{displayCity || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Marital Status:</span>
                <span className="font-semibold text-slate-700">{record.maritalStatus || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Admission Date:</span>
                <span className="font-semibold text-slate-700">{record.admissionDate || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <Activity className="w-4 h-4" /> 2. Clinical Symptoms
            </h3>
            <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 space-y-3">
              <div>
                <span className="text-xs text-slate-400 block mb-1">Present Symptoms:</span>
                {presentSymptoms.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {presentSymptoms.map((sym) => (
                      <span key={sym} className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-teal-100 text-teal-800 border border-teal-200">
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
                  <p className="text-xs text-slate-700 mt-0.5 whitespace-pre-wrap leading-relaxed">{record.chiefComplaint}</p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <FlaskConical className="w-4 h-4" /> 3. Laboratory Data
            </h3>
            <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 space-y-3 text-xs">
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

          {/* Section 4 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <Microchip className="w-4 h-4" /> 4. Diagnostics
            </h3>
            <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div><span className="text-slate-400 block">Peripheral Blast:</span><span className="font-semibold text-slate-700">{record.diagnostics?.peripheralBlast ?? 'N/A'}</span></div>
                <div><span className="text-slate-400 block">BM Blast:</span><span className="font-semibold text-slate-700">{record.diagnostics?.boneMarrowBlast ?? 'N/A'}</span></div>
                <div><span className="text-slate-400 block">LN Biopsy:</span><span className="font-semibold text-slate-700">{record.diagnostics?.lymphNodeBiopsyPerformed ? 'Yes' : 'No'}</span></div>
              </div>

              {record.diagnostics?.lymphNodeBiopsyPerformed && record.diagnostics?.lymphNodeBiopsySummary && (
                <div><span className="text-slate-400 block font-medium">LN Biopsy Summary:</span><p className="text-slate-700">{record.diagnostics.lymphNodeBiopsySummary}</p></div>
              )}
              {record.diagnostics?.pbsFindings && (
                <div><span className="text-slate-400 block font-medium">PBS Findings:</span><p className="text-slate-700">{record.diagnostics.pbsFindings}</p></div>
              )}
              {record.diagnostics?.bmCellularity && (
                <div><span className="text-slate-400 block font-medium">BM Cellularity:</span><p className="text-slate-700">{record.diagnostics.bmCellularity}</p></div>
              )}
              {record.diagnostics?.bmBiopsySummary && (
                <div><span className="text-slate-400 block font-medium">BM Biopsy Summary:</span><p className="text-slate-700">{record.diagnostics.bmBiopsySummary}</p></div>
              )}
              {record.diagnostics?.flowCytometry && (
                <div><span className="text-slate-400 block font-medium">Flow Cytometry Immunophenotyping:</span><p className="text-slate-700">{record.diagnostics.flowCytometry}</p></div>
              )}
              {record.diagnostics?.cytogenetics && (
                <div><span className="text-slate-400 block font-medium">Cytogenetics (Karyotype):</span><p className="text-slate-700">{record.diagnostics.cytogenetics}</p></div>
              )}
              {record.diagnostics?.molecularGenetics && (
                <div><span className="text-slate-400 block font-medium">Molecular Genetics:</span><p className="text-slate-700">{record.diagnostics.molecularGenetics}</p></div>
              )}
              {record.diagnostics?.ctScanImaging && (
                <div><span className="text-slate-400 block font-medium">CT Scan / Imaging Findings:</span><p className="text-slate-700">{record.diagnostics.ctScanImaging}</p></div>
              )}
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <FileText className="w-4 h-4" /> 5. Diagnosis
            </h3>
            <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div><span className="text-slate-400 block">Hematological Malignancy Diagnosis:</span><span className="font-bold text-slate-800 text-xs sm:text-sm">{displayDiagnosis}</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <div><span className="text-slate-400 block">Subtype / Classification:</span><span className="font-semibold text-slate-700">{record.subType || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">Stage / Risk Group:</span><span className="font-semibold text-slate-700">{record.stageRiskGroup || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">IHC Markers:</span><span className="font-semibold text-slate-700">{record.ihcMarkers || 'N/A'}</span></div>
              </div>
            </div>
          </div>

          {/* Section 6 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2 text-teal-800">
              <Award className="w-4 h-4" /> 6. Treatment & Outcome
            </h3>
            <div className="bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div><span className="text-slate-400 block">Line of Treatment:</span><span className="font-semibold text-slate-800">{displayTreatment || 'N/A'}</span></div>
                <div><span className="text-slate-400 block">Treatment Outcome:</span><span className="font-bold text-emerald-700">{record.outcome || record.treatmentOutcome || 'N/A'}</span></div>
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
