import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Save, ArrowLeft, RotateCcw, Activity, FileText, FlaskConical, Stethoscope, Microchip, Award, CheckCircle } from 'lucide-react';

import { recordRepository } from '../../db/repository';
import { useRecordStore } from '../../stores/useRecordStore';
import { useToastStore } from '../../stores/useToastStore';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Button } from '../../components/ui/Button';

// Inline Zod Resolver for React Hook Form for 100% Vite/Rollup bundling reliability
const customZodResolver = (schema: z.ZodSchema) => async (values: any) => {
  const result = schema.safeParse(values);
  if (result.success) {
    return { values: result.data, errors: {} };
  }

  const errors: Record<string, any> = {};
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    errors[path] = {
      type: issue.code,
      message: issue.message,
    };
  });

  return { values: {}, errors };
};

const YEMENI_CITIES = [
  { value: '', label: 'Select City (Yemen)' },
  { value: "Sana'a", label: "Sana'a (صنعاء)" },
  { value: 'Aden', label: 'Aden (عدن)' },
  { value: 'Taiz', label: 'Taiz (تعز)' },
  { value: 'Al Hudaydah', label: 'Al Hudaydah (الحديدة)' },
  { value: 'Mukalla', label: 'Mukalla (المكلا)' },
  { value: 'Ibb', label: 'Ibb (إب)' },
  { value: 'Dhamar', label: 'Dhamar (ذمار)' },
  { value: 'Amran', label: 'Amran (عمران)' },
  { value: 'Sayyan', label: 'Sayyan / Seiyun (سيئون)' },
  { value: 'Saada', label: 'Saada (صعدة)' },
  { value: 'Al Mahrah', label: 'Al Mahrah (المهرة)' },
  { value: 'Hajjah', label: 'Hajjah (حجة)' },
  { value: 'Shabwah', label: 'Shabwah (شبوة)' },
  { value: 'Abyan', label: 'Abyan (أبين)' },
  { value: 'Lahij', label: 'Lahij (لحج)' },
  { value: 'Marib', label: 'Marib (مأرب)' },
  { value: 'Al Bayda', label: 'Al Bayda (البيضاء)' },
  { value: 'Socotra', label: 'Socotra (سقطرى)' },
  { value: 'Other City', label: 'Other City' }
];

const MARITAL_STATUS_OPTIONS = [
  { value: '', label: 'Select Marital Status' },
  { value: 'Single', label: 'Single' },
  { value: 'Married', label: 'Married' },
  { value: 'Divorced', label: 'Divorced' },
  { value: 'Widowed', label: 'Widowed' }
];

// Exact Hematological Malignancy Diagnosis options from screenshots
const DIAGNOSIS_OPTIONS = [
  { value: '', label: 'Select Hematological Malignancy Diagnosis *' },
  { value: 'Acute Myeloid Leukemia (AML)', label: 'Acute Myeloid Leukemia (AML)' },
  { value: 'Acute Lymphoblastic Leukemia (ALL)', label: 'Acute Lymphoblastic Leukemia (ALL)' },
  { value: 'Chronic Myeloid Leukemia (CML)', label: 'Chronic Myeloid Leukemia (CML)' },
  { value: 'Chronic Lymphocytic Leukemia (CLL)', label: 'Chronic Lymphocytic Leukemia (CLL)' },
  { value: 'Hodgkin Lymphoma', label: 'Hodgkin Lymphoma' },
  { value: 'Non-Hodgkin Lymphoma', label: 'Non-Hodgkin Lymphoma' },
  { value: 'Diffuse Large B-cell Lymphoma (DLBCL)', label: 'Diffuse Large B-cell Lymphoma (DLBCL)' },
  { value: 'Burkitt Lymphoma', label: 'Burkitt Lymphoma' },
  { value: 'Mantle Cell Lymphoma', label: 'Mantle Cell Lymphoma' },
  { value: 'Follicular Lymphoma', label: 'Follicular Lymphoma' },
  { value: 'T-cell Lymphoma', label: 'T-cell Lymphoma' },
  { value: 'Multiple Myeloma', label: 'Multiple Myeloma' },
  { value: 'Plasma Cell Leukemia', label: 'Plasma Cell Leukemia' },
  { value: 'Myelodysplastic Syndrome (MDS)', label: 'Myelodysplastic Syndrome (MDS)' },
  { value: 'Myeloproliferative Neoplasms (MPN)', label: 'Myeloproliferative Neoplasms (MPN)' },
  { value: 'Chronic Myelomonocytic Leukemia (CMML)', label: 'Chronic Myelomonocytic Leukemia (CMML)' },
  { value: 'Hairy Cell Leukemia', label: 'Hairy Cell Leukemia' },
  { value: 'Other Hematological Malignancy', label: 'Other Hematological Malignancy' }
];

const LINE_OF_TREATMENT_OPTIONS = [
  { value: '', label: 'Select Line of Treatment' },
  { value: 'First-line Induction', label: 'First-line Induction' },
  { value: 'Consolidation / Maintenance', label: 'Consolidation / Maintenance' },
  { value: 'Second-line / Relapsed / Refractory', label: 'Second-line / Relapsed / Refractory' },
  { value: 'Palliative Care', label: 'Palliative Care' },
  { value: 'Stem Cell Transplant', label: 'Stem Cell Transplant' },
  { value: 'Observation / Watchful Waiting', label: 'Observation / Watchful Waiting' },
  { value: 'Other', label: 'Other' }
];

const TREATMENT_OUTCOME_OPTIONS = [
  { value: '', label: 'Select Treatment Outcome' },
  { value: 'Complete Remission (CR)', label: 'Complete Remission (CR)' },
  { value: 'Partial Remission (PR)', label: 'Partial Remission (PR)' },
  { value: 'Stable Disease (SD)', label: 'Stable Disease (SD)' },
  { value: 'Progressive Disease (PD)', label: 'Progressive Disease (PD)' },
  { value: 'Relapsed', label: 'Relapsed' },
  { value: 'Deceased', label: 'Deceased' },
  { value: 'Lost to Follow-up', label: 'Lost to Follow-up' },
  { value: 'Ongoing Treatment', label: 'Ongoing Treatment' }
];

// Zod Validation Schema - ONLY diagnosis is required!
const patientFormSchema = z.object({
  studyId: z.string().optional(),
  mrn: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  city: z.string().optional(),
  customCity: z.string().optional(),
  maritalStatus: z.string().optional(),
  admissionDate: z.string().optional(),

  symptoms: z.object({
    fever: z.boolean(),
    pallor: z.boolean(),
    bleeding: z.boolean(),
    weightLoss: z.boolean(),
    nightSweats: z.boolean(),
    lymphadenopathy: z.boolean(),
    hepatomegaly: z.boolean(),
    splenomegaly: z.boolean(),
    other: z.boolean(),
  }),
  otherSymptomsText: z.string().optional(),

  chiefComplaint: z.string().optional(),

  labs: z.object({
    hemoglobin: z.string().optional(),
    wbcCount: z.string().optional(),
    rbcCount: z.string().optional(),
    hematocrit: z.string().optional(),
    plateletCount: z.string().optional(),
    mcv: z.string().optional(),
    mch: z.string().optional(),
    mchc: z.string().optional(),
    rdw: z.string().optional(),
    absoluteGranulocytes: z.string().optional(),
    absoluteLymphocytes: z.string().optional(),
    differentialCount: z.string().optional(),
    ldh: z.string().optional(),
    uricAcid: z.string().optional(),
    serumCreatinine: z.string().optional(),
    alt: z.string().optional(),
    ast: z.string().optional(),
  }),

  diagnostics: z.object({
    peripheralBlast: z.string().optional(),
    boneMarrowBlast: z.string().optional(),
    pbsFindings: z.string().optional(),
    bmCellularity: z.string().optional(),
    bmBiopsySummary: z.string().optional(),
    lymphNodeBiopsyPerformed: z.boolean(),
    lymphNodeBiopsySummary: z.string().optional(),
    flowCytometry: z.string().optional(),
    cytogenetics: z.string().optional(),
    molecularGenetics: z.string().optional(),
    ctScanImaging: z.string().optional(),
  }),

  diagnosis: z.string().min(1, 'Hematological Malignancy Diagnosis is required'),
  customDiagnosis: z.string().optional(),
  subType: z.string().optional(),
  stageRiskGroup: z.string().optional(),
  ihcMarkers: z.string().optional(),

  lineOfTreatment: z.string().optional(),
  customLineOfTreatment: z.string().optional(),
  outcome: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

export const PatientForm: React.FC = () => {
  const { editingRecord, setEditingRecord, setActiveTab } = useRecordStore();
  const { addToast } = useToastStore();
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const defaultValues: PatientFormData = {
    studyId: editingRecord?.studyId || editingRecord?.patientId || '',
    mrn: editingRecord?.mrn || '',
    age: editingRecord?.age !== undefined && editingRecord?.age !== null ? String(editingRecord.age) : '',
    gender: editingRecord?.gender || '',
    city: editingRecord?.city || '',
    customCity: editingRecord?.customCity || '',
    maritalStatus: editingRecord?.maritalStatus || '',
    admissionDate: editingRecord?.admissionDate || new Date().toISOString().split('T')[0],
    symptoms: {
      fever: editingRecord?.symptoms?.fever || false,
      pallor: editingRecord?.symptoms?.pallor || false,
      bleeding: editingRecord?.symptoms?.bleeding || false,
      weightLoss: editingRecord?.symptoms?.weightLoss || false,
      nightSweats: editingRecord?.symptoms?.nightSweats || false,
      lymphadenopathy: editingRecord?.symptoms?.lymphadenopathy || false,
      hepatomegaly: editingRecord?.symptoms?.hepatomegaly || false,
      splenomegaly: editingRecord?.symptoms?.splenomegaly || false,
      other: editingRecord?.symptoms?.other || false,
    },
    otherSymptomsText: editingRecord?.otherSymptomsText || '',
    chiefComplaint: editingRecord?.chiefComplaint || '',
    labs: {
      hemoglobin: editingRecord?.labs?.hemoglobin !== undefined && editingRecord?.labs?.hemoglobin !== null ? String(editingRecord.labs.hemoglobin) : '',
      wbcCount: editingRecord?.labs?.wbcCount !== undefined && editingRecord?.labs?.wbcCount !== null ? String(editingRecord.labs.wbcCount) : '',
      rbcCount: editingRecord?.labs?.rbcCount !== undefined && editingRecord?.labs?.rbcCount !== null ? String(editingRecord.labs.rbcCount) : '',
      hematocrit: editingRecord?.labs?.hematocrit !== undefined && editingRecord?.labs?.hematocrit !== null ? String(editingRecord.labs.hematocrit) : '',
      plateletCount: editingRecord?.labs?.plateletCount !== undefined && editingRecord?.labs?.plateletCount !== null ? String(editingRecord.labs.plateletCount) : '',
      mcv: editingRecord?.labs?.mcv !== undefined && editingRecord?.labs?.mcv !== null ? String(editingRecord.labs.mcv) : '',
      mch: editingRecord?.labs?.mch !== undefined && editingRecord?.labs?.mch !== null ? String(editingRecord.labs.mch) : '',
      mchc: editingRecord?.labs?.mchc !== undefined && editingRecord?.labs?.mchc !== null ? String(editingRecord.labs.mchc) : '',
      rdw: editingRecord?.labs?.rdw !== undefined && editingRecord?.labs?.rdw !== null ? String(editingRecord.labs.rdw) : '',
      absoluteGranulocytes: editingRecord?.labs?.absoluteGranulocytes !== undefined && editingRecord?.labs?.absoluteGranulocytes !== null ? String(editingRecord.labs.absoluteGranulocytes) : '',
      absoluteLymphocytes: editingRecord?.labs?.absoluteLymphocytes !== undefined && editingRecord?.labs?.absoluteLymphocytes !== null ? String(editingRecord.labs.absoluteLymphocytes) : '',
      differentialCount: editingRecord?.labs?.differentialCount || '',
      ldh: editingRecord?.labs?.ldh !== undefined && editingRecord?.labs?.ldh !== null ? String(editingRecord.labs.ldh) : '',
      uricAcid: editingRecord?.labs?.uricAcid !== undefined && editingRecord?.labs?.uricAcid !== null ? String(editingRecord.labs.uricAcid) : '',
      serumCreatinine: editingRecord?.labs?.serumCreatinine !== undefined && editingRecord?.labs?.serumCreatinine !== null ? String(editingRecord.labs.serumCreatinine) : '',
      alt: editingRecord?.labs?.alt !== undefined && editingRecord?.labs?.alt !== null ? String(editingRecord.labs.alt) : '',
      ast: editingRecord?.labs?.ast !== undefined && editingRecord?.labs?.ast !== null ? String(editingRecord.labs.ast) : '',
    },
    diagnostics: {
      peripheralBlast: editingRecord?.diagnostics?.peripheralBlast !== undefined && editingRecord?.diagnostics?.peripheralBlast !== null ? String(editingRecord.diagnostics.peripheralBlast) : '',
      boneMarrowBlast: editingRecord?.diagnostics?.boneMarrowBlast !== undefined && editingRecord?.diagnostics?.boneMarrowBlast !== null ? String(editingRecord.diagnostics.boneMarrowBlast) : '',
      pbsFindings: editingRecord?.diagnostics?.pbsFindings || '',
      bmCellularity: editingRecord?.diagnostics?.bmCellularity || '',
      bmBiopsySummary: editingRecord?.diagnostics?.bmBiopsySummary || '',
      lymphNodeBiopsyPerformed: editingRecord?.diagnostics?.lymphNodeBiopsyPerformed || false,
      lymphNodeBiopsySummary: editingRecord?.diagnostics?.lymphNodeBiopsySummary || '',
      flowCytometry: editingRecord?.diagnostics?.flowCytometry || '',
      cytogenetics: editingRecord?.diagnostics?.cytogenetics || '',
      molecularGenetics: editingRecord?.diagnostics?.molecularGenetics || '',
      ctScanImaging: editingRecord?.diagnostics?.ctScanImaging || '',
    },
    diagnosis: editingRecord?.diagnosis || '',
    customDiagnosis: editingRecord?.customDiagnosis || '',
    subType: editingRecord?.subType || '',
    stageRiskGroup: editingRecord?.stageRiskGroup || '',
    ihcMarkers: editingRecord?.ihcMarkers || '',
    lineOfTreatment: editingRecord?.lineOfTreatment || editingRecord?.inductionProtocol || '',
    customLineOfTreatment: editingRecord?.customLineOfTreatment || '',
    outcome: editingRecord?.outcome || editingRecord?.treatmentOutcome || '',
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: customZodResolver(patientFormSchema),
    defaultValues,
  });

  const selectedCity = watch('city');
  const isOtherSymptomToggled = watch('symptoms.other');
  const isLymphNodeBiopsyToggled = watch('diagnostics.lymphNodeBiopsyPerformed');
  const selectedDiagnosis = watch('diagnosis');
  const selectedLineOfTreatment = watch('lineOfTreatment');

  useEffect(() => {
    reset(defaultValues);
  }, [editingRecord]);

  const onSubmit = async (data: PatientFormData) => {
    if (isSubmitting || saveSuccess) return;

    try {
      const generatedStudyId = data.studyId?.trim() || `STU-${Date.now().toString().slice(-6)}`;

      await recordRepository.saveRecord({
        id: editingRecord?.id,
        createdAt: editingRecord?.createdAt,
        studyId: generatedStudyId,
        patientId: generatedStudyId,
        mrn: data.mrn,
        age: data.age ? data.age : null,
        gender: data.gender,
        city: data.city,
        customCity: data.city === 'Other City' ? data.customCity : undefined,
        maritalStatus: data.maritalStatus,
        admissionDate: data.admissionDate,
        symptoms: {
          fever: !!data.symptoms.fever,
          pallor: !!data.symptoms.pallor,
          bleeding: !!data.symptoms.bleeding,
          weightLoss: !!data.symptoms.weightLoss,
          nightSweats: !!data.symptoms.nightSweats,
          lymphadenopathy: !!data.symptoms.lymphadenopathy,
          hepatomegaly: !!data.symptoms.hepatomegaly,
          splenomegaly: !!data.symptoms.splenomegaly,
          other: !!data.symptoms.other,
        },
        otherSymptomsText: data.symptoms.other ? data.otherSymptomsText : undefined,
        chiefComplaint: data.chiefComplaint,
        labs: data.labs,
        diagnostics: {
          ...data.diagnostics,
          lymphNodeBiopsySummary: data.diagnostics.lymphNodeBiopsyPerformed ? data.diagnostics.lymphNodeBiopsySummary : undefined,
        },
        diagnosis: data.diagnosis,
        customDiagnosis: data.diagnosis === 'Other Hematological Malignancy' ? data.customDiagnosis : undefined,
        subType: data.subType,
        stageRiskGroup: data.stageRiskGroup,
        ihcMarkers: data.ihcMarkers,
        lineOfTreatment: data.lineOfTreatment,
        customLineOfTreatment: data.lineOfTreatment === 'Other' ? data.customLineOfTreatment : undefined,
        inductionProtocol: data.lineOfTreatment,
        outcome: data.outcome,
        treatmentOutcome: data.outcome,
      });

      setSaveSuccess(true);
      addToast('success', `Patient Record (${generatedStudyId}) saved to IndexedDB!`);

      setTimeout(() => {
        setSaveSuccess(false);
        setEditingRecord(null);
        setActiveTab('list');
      }, 1200);
    } catch (err) {
      console.error('Error saving patient record:', err);
      addToast('error', 'Failed to save patient record into local storage.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditingRecord(null);
              setActiveTab('list');
            }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Records
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">
            {editingRecord ? `Edit Patient Record (${editingRecord.studyId || editingRecord.patientId})` : 'New Patient Case'}
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            reset();
            addToast('info', 'Form inputs reset.');
          }}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Form
        </Button>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">✓</div>
          <div>
            <p className="font-semibold text-sm">Patient Case Record Saved Successfully!</p>
            <p className="text-xs text-emerald-700">Stored safely in your device's IndexedDB JSON collection.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Demographics & Admission */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-lg border-b border-slate-100 pb-3">
            <Stethoscope className="w-5 h-5 text-teal-700" />
            <span>1. General & Demographics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Study ID"
              placeholder="e.g. STU-2024-089 (Optional)"
              {...register('studyId')}
            />
            <Input
              label="MRN (Medical Record No)"
              placeholder="e.g. MRN-98421"
              {...register('mrn')}
            />
            <Input
              label="Age (Years)"
              type="number"
              step="0.01"
              placeholder="e.g. 42 or 0.2 (2 months)"
              {...register('age')}
            />
            <Select
              label="Gender"
              options={[
                { value: '', label: 'Select Gender' },
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' }
              ]}
              {...register('gender')}
            />
            <Select
              label="City (Yemen)"
              options={YEMENI_CITIES}
              {...register('city')}
            />

            {/* Conditional Custom City Input */}
            {selectedCity === 'Other City' && (
              <Input
                label="Custom City Name"
                placeholder="Enter custom city name"
                {...register('customCity')}
              />
            )}

            <Select
              label="Marital Status"
              options={MARITAL_STATUS_OPTIONS}
              {...register('maritalStatus')}
            />
            <Input
              label="Admission Date"
              type="date"
              {...register('admissionDate')}
            />
          </div>
        </div>

        {/* Section 2: Clinical Symptoms */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-lg border-b border-slate-100 pb-3">
            <Activity className="w-5 h-5 text-teal-700" />
            <span>2. Clinical Symptoms</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
            <Controller
              name="symptoms.fever"
              control={control}
              render={({ field: { value, onChange } }) => <Switch label="Fever" checked={!!value} onChange={onChange} />}
            />
            <Controller
              name="symptoms.pallor"
              control={control}
              render={({ field: { value, onChange } }) => <Switch label="Pallor" checked={!!value} onChange={onChange} />}
            />
            <Controller
              name="symptoms.bleeding"
              control={control}
              render={({ field: { value, onChange } }) => <Switch label="Bleeding" checked={!!value} onChange={onChange} />}
            />
            <Controller
              name="symptoms.weightLoss"
              control={control}
              render={({ field: { value, onChange } }) => <Switch label="Weight Loss" checked={!!value} onChange={onChange} />}
            />
            <Controller
              name="symptoms.nightSweats"
              control={control}
              render={({ field: { value, onChange } }) => <Switch label="Night Sweats" checked={!!value} onChange={onChange} />}
            />
            <Controller
              name="symptoms.lymphadenopathy"
              control={control}
              render={({ field: { value, onChange } }) => <Switch label="Lymphadenopathy" checked={!!value} onChange={onChange} />}
            />
            <Controller
              name="symptoms.hepatomegaly"
              control={control}
              render={({ field: { value, onChange } }) => <Switch label="Hepatomegaly" checked={!!value} onChange={onChange} />}
            />
            <Controller
              name="symptoms.splenomegaly"
              control={control}
              render={({ field: { value, onChange } }) => <Switch label="Splenomegaly" checked={!!value} onChange={onChange} />}
            />
            <Controller
              name="symptoms.other"
              control={control}
              render={({ field: { value, onChange } }) => <Switch label="Other" checked={!!value} onChange={onChange} />}
            />
          </div>

          {/* Conditional Input for Other Symptoms */}
          {isOtherSymptomToggled && (
            <div className="pt-2 animate-fade-in">
              <Input
                label="Specify Other Symptoms"
                placeholder="Type additional clinical symptoms here..."
                {...register('otherSymptomsText')}
              />
            </div>
          )}

          <div className="pt-2">
            <Textarea
              label="Chief Complaint & History Summary"
              placeholder="Enter Chief Complaint & History Summary (Optional)"
              rows={4}
              {...register('chiefComplaint')}
            />
          </div>
        </div>

        {/* Section 3: Laboratory Data */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-lg border-b border-slate-100 pb-3">
            <FlaskConical className="w-5 h-5 text-teal-700" />
            <span>3. Laboratory Data</span>
          </div>

          {/* Subsection A: Complete Blood Count (CBC) Profile */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-teal-900 border-l-4 border-teal-600 pl-2">
              Complete Blood Count (CBC) Profile:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Input label="Hemoglobin (Hb)" placeholder="Hemoglobin (Hb)" type="text" {...register('labs.hemoglobin')} />
              <Input label="WBC Count" placeholder="WBC Count" type="text" {...register('labs.wbcCount')} />
              <Input label="RBC Count" placeholder="RBC Count" type="text" {...register('labs.rbcCount')} />
              <Input label="Hematocrit (HCT)" placeholder="Hematocrit (HCT)" type="text" {...register('labs.hematocrit')} />
              <Input label="Platelet Count" placeholder="Platelet Count" type="text" {...register('labs.plateletCount')} />
              <Input label="MCV" placeholder="MCV" type="text" {...register('labs.mcv')} />
              <Input label="MCH" placeholder="MCH" type="text" {...register('labs.mch')} />
              <Input label="MCHC" placeholder="MCHC" type="text" {...register('labs.mchc')} />
              <Input label="RDW" placeholder="RDW" type="text" {...register('labs.rdw')} />
              <Input label="Absolute Granulocytes" placeholder="Absolute Granulocytes" type="text" {...register('labs.absoluteGranulocytes')} />
              <Input label="Absolute Lymphocytes" placeholder="Absolute Lymphocytes" type="text" {...register('labs.absoluteLymphocytes')} />
              <Input label="Differential Count" placeholder="Differential Count" type="text" {...register('labs.differentialCount')} />
            </div>
          </div>

          {/* Subsection B: Biochemistry & Other Labs */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-teal-900 border-l-4 border-teal-600 pl-2">
              Biochemistry & Other Labs:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Input label="LDH" placeholder="LDH" type="text" {...register('labs.ldh')} />
              <Input label="Uric Acid" placeholder="Uric Acid" type="text" {...register('labs.uricAcid')} />
              <Input label="Serum Creatinine" placeholder="Serum Creatinine" type="text" {...register('labs.serumCreatinine')} />
              <Input label="ALT" placeholder="ALT" type="text" {...register('labs.alt')} />
              <Input label="AST" placeholder="AST" type="text" {...register('labs.ast')} />
            </div>
          </div>
        </div>

        {/* Section 4: Diagnostics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-lg border-b border-slate-100 pb-3">
            <Microchip className="w-5 h-5 text-teal-700" />
            <span>4. Diagnostics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Peripheral Blast" placeholder="Peripheral Blast (e.g. 42% or 42)" type="text" {...register('diagnostics.peripheralBlast')} />
            <Input label="Bone Marrow Blast" placeholder="Bone Marrow Blast (e.g. 68% or 68)" type="text" {...register('diagnostics.boneMarrowBlast')} />
          </div>

          <Textarea label="Peripheral Blood Smear Findings" placeholder="Peripheral Blood Smear Findings" {...register('diagnostics.pbsFindings')} />
          <Input label="Bone Marrow Cellularity" placeholder="Bone Marrow Cellularity" {...register('diagnostics.bmCellularity')} />
          <Textarea label="Bone Marrow Biopsy Summary" placeholder="Bone Marrow Biopsy Summary" {...register('diagnostics.bmBiopsySummary')} />

          <div className="space-y-3 pt-1">
            <Controller
              name="diagnostics.lymphNodeBiopsyPerformed"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Switch label="Lymph Node Biopsy Performed" checked={!!value} onChange={onChange} />
              )}
            />

            {/* Conditional Input when Lymph Node Biopsy Performed is toggled ON */}
            {isLymphNodeBiopsyToggled && (
              <div className="pt-1 animate-fade-in">
                <Textarea
                  label="Lymph Node Biopsy Summary"
                  placeholder="Lymph Node Biopsy Summary findings..."
                  rows={3}
                  {...register('diagnostics.lymphNodeBiopsySummary')}
                />
              </div>
            )}
          </div>

          <div className="space-y-4 pt-2">
            <Textarea label="Flow Cytometry Immunophenotyping" placeholder="Flow Cytometry Immunophenotyping" {...register('diagnostics.flowCytometry')} />
            <Textarea label="Cytogenetics (Karyotype)" placeholder="Cytogenetics (Karyotype)" {...register('diagnostics.cytogenetics')} />
            <Textarea label="Molecular Genetics" placeholder="Molecular Genetics" {...register('diagnostics.molecularGenetics')} />
            <Textarea label="CT Scan / Imaging Findings" placeholder="CT Scan / Imaging Findings" {...register('diagnostics.ctScanImaging')} />
          </div>
        </div>

        {/* Section 5: Diagnosis */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-lg border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-teal-700" />
            <span>5. Diagnosis</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Hematological Malignancy Diagnosis"
                required
                options={DIAGNOSIS_OPTIONS}
                error={errors.diagnosis?.message as string}
                {...register('diagnosis')}
              />
              {/* Conditional Input when Diagnosis is 'Other Hematological Malignancy' */}
              {selectedDiagnosis === 'Other Hematological Malignancy' && (
                <div className="mt-3 animate-fade-in">
                  <Input
                    label="Specify Custom Diagnosis"
                    placeholder="Enter custom diagnosis..."
                    {...register('customDiagnosis')}
                  />
                </div>
              )}
            </div>

            <Input label="Disease Subtype / FAB / WHO Classification" placeholder="Disease Subtype / FAB / WHO Classification" {...register('subType')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Stage / Risk Group" placeholder="Stage / Risk Group" {...register('stageRiskGroup')} />
            <Input label="Immunohistochemistry (IHC) Markers" placeholder="Immunohistochemistry (IHC) Markers" {...register('ihcMarkers')} />
          </div>
        </div>

        {/* Section 6: Treatment & Outcome */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-lg border-b border-slate-100 pb-3">
            <Award className="w-5 h-5 text-teal-700" />
            <span>6. Treatment & Outcome</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Line of Treatment"
                options={LINE_OF_TREATMENT_OPTIONS}
                {...register('lineOfTreatment')}
              />
              {/* Conditional Input when Line of Treatment is 'Other' */}
              {selectedLineOfTreatment === 'Other' && (
                <div className="mt-3 animate-fade-in">
                  <Input
                    label="Specify Custom Line of Treatment"
                    placeholder="Enter custom line of treatment..."
                    {...register('customLineOfTreatment')}
                  />
                </div>
              )}
            </div>

            <Select
              label="Treatment Outcome"
              options={TREATMENT_OUTCOME_OPTIONS}
              {...register('outcome')}
            />
          </div>
        </div>

        {/* Floating / Sticky Save Clinical Case Record Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg z-30">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-1.5">
            <Button
              type="submit"
              disabled={isSubmitting || saveSuccess}
              className={`w-full sm:w-auto px-12 py-3 font-semibold text-base rounded-xl shadow-md transition-all ${
                saveSuccess
                  ? 'bg-emerald-600 text-white cursor-not-allowed opacity-90'
                  : isSubmitting
                  ? 'bg-teal-700 text-white opacity-80 cursor-wait'
                  : 'bg-teal-800 hover:bg-teal-900 text-white active:scale-95'
              }`}
              icon={
                saveSuccess ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )
              }
            >
              {isSubmitting
                ? 'Saving Case Record...'
                : saveSuccess
                ? 'Case Record Saved!'
                : 'Save Clinical Case Record'}
            </Button>
            <p className="text-xs text-slate-500 text-center">
              Saved to this device first — syncs automatically when you are back online
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
