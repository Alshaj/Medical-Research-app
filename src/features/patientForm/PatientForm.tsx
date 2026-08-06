import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Save, ArrowLeft, RotateCcw, Activity, FileText, FlaskConical, Stethoscope } from 'lucide-react';

import { recordRepository } from '../../db/repository';
import { useRecordStore } from '../../stores/useRecordStore';
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

// Zod Validation Schema
const patientFormSchema = z.object({
  studyId: z.string().min(1, 'Study ID is required'),
  mrn: z.string().optional(),
  age: z.coerce.number().optional().nullable(),
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
  }),

  chiefComplaint: z.string().optional(),

  labs: z.object({
    // Complete Blood Count (CBC) Profile
    hemoglobin: z.coerce.number().optional().nullable(),
    wbcCount: z.coerce.number().optional().nullable(),
    rbcCount: z.coerce.number().optional().nullable(),
    hematocrit: z.coerce.number().optional().nullable(),
    plateletCount: z.coerce.number().optional().nullable(),
    mcv: z.coerce.number().optional().nullable(),
    mch: z.coerce.number().optional().nullable(),
    mchc: z.coerce.number().optional().nullable(),
    rdw: z.coerce.number().optional().nullable(),
    absoluteGranulocytes: z.coerce.number().optional().nullable(),
    absoluteLymphocytes: z.coerce.number().optional().nullable(),
    differentialCount: z.string().optional(),

    // Biochemistry & Other Labs
    ldh: z.coerce.number().optional().nullable(),
    uricAcid: z.coerce.number().optional().nullable(),
    serumCreatinine: z.coerce.number().optional().nullable(),
    alt: z.coerce.number().optional().nullable(),
    ast: z.coerce.number().optional().nullable(),
  }),

  diagnosis: z.string().min(1, 'Diagnosis is required'),
  subType: z.string().optional(),
  stageRiskGroup: z.string().optional(),
  ihcMarkers: z.string().optional(),
  inductionProtocol: z.string().optional(),
  treatmentResponse: z.string().optional(),
  relapseDate: z.string().optional(),
  outcome: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

export const PatientForm: React.FC = () => {
  const { editingRecord, setEditingRecord, setActiveTab } = useRecordStore();
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const defaultValues: PatientFormData = {
    studyId: editingRecord?.studyId || editingRecord?.patientId || '',
    mrn: editingRecord?.mrn || '',
    age: editingRecord?.age ?? null,
    gender: editingRecord?.gender || 'Male',
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
    },
    chiefComplaint: editingRecord?.chiefComplaint || '',
    labs: {
      hemoglobin: editingRecord?.labs?.hemoglobin ?? null,
      wbcCount: editingRecord?.labs?.wbcCount ?? null,
      rbcCount: editingRecord?.labs?.rbcCount ?? null,
      hematocrit: editingRecord?.labs?.hematocrit ?? null,
      plateletCount: editingRecord?.labs?.plateletCount ?? null,
      mcv: editingRecord?.labs?.mcv ?? null,
      mch: editingRecord?.labs?.mch ?? null,
      mchc: editingRecord?.labs?.mchc ?? null,
      rdw: editingRecord?.labs?.rdw ?? null,
      absoluteGranulocytes: editingRecord?.labs?.absoluteGranulocytes ?? null,
      absoluteLymphocytes: editingRecord?.labs?.absoluteLymphocytes ?? null,
      differentialCount: editingRecord?.labs?.differentialCount || '',
      ldh: editingRecord?.labs?.ldh ?? null,
      uricAcid: editingRecord?.labs?.uricAcid ?? null,
      serumCreatinine: editingRecord?.labs?.serumCreatinine ?? null,
      alt: editingRecord?.labs?.alt ?? null,
      ast: editingRecord?.labs?.ast ?? null,
    },
    diagnosis: editingRecord?.diagnosis || '',
    subType: editingRecord?.subType || '',
    stageRiskGroup: editingRecord?.stageRiskGroup || '',
    ihcMarkers: editingRecord?.ihcMarkers || '',
    inductionProtocol: editingRecord?.inductionProtocol || '',
    treatmentResponse: editingRecord?.treatmentResponse || '',
    relapseDate: editingRecord?.relapseDate || '',
    outcome: editingRecord?.outcome || '',
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

  useEffect(() => {
    reset(defaultValues);
  }, [editingRecord]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      await recordRepository.saveRecord({
        id: editingRecord?.id,
        createdAt: editingRecord?.createdAt,
        studyId: data.studyId,
        patientId: data.studyId, // legacy fallback
        mrn: data.mrn,
        age: data.age,
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
        },
        chiefComplaint: data.chiefComplaint,
        labs: data.labs,
        diagnosis: data.diagnosis,
        subType: data.subType,
        stageRiskGroup: data.stageRiskGroup,
        ihcMarkers: data.ihcMarkers,
        inductionProtocol: data.inductionProtocol,
        treatmentResponse: data.treatmentResponse,
        relapseDate: data.relapseDate,
        outcome: data.outcome,
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setEditingRecord(null);
        setActiveTab('list');
      }, 1200);
    } catch (err) {
      console.error('Error saving patient record:', err);
      alert('Failed to save record into local IndexedDB.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
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
            {editingRecord ? `Edit Patient Record (${editingRecord.studyId || editingRecord.patientId})` : 'New Patient Record'}
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => reset()}
          icon={<RotateCcw className="w-3.5 h-3.5" />}
        >
          Reset Form
        </Button>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-fade-in">
          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">✓</div>
          <div>
            <p className="font-semibold text-sm">Patient Record Saved Successfully!</p>
            <p className="text-xs text-emerald-700">Stored safely in your device's IndexedDB JSON collection.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Section 1: Demographics & Admission */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-lg border-b border-slate-100 pb-3">
            <Stethoscope className="w-5 h-5 text-teal-700" />
            <span>General & Demographics</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Study ID"
              required
              placeholder="e.g. STU-2024-001"
              error={errors.studyId?.message as string}
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
              placeholder="e.g. 42"
              {...register('age')}
            />
            <Select
              label="Gender"
              options={[
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
            <span>Clinical Symptoms</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
          </div>

          <div className="pt-2">
            <Textarea
              label="Chief Complaint & History Summary"
              placeholder="Enter Chief Complaint & History Summary"
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
              <Input label="Hemoglobin (Hb)" placeholder="Hemoglobin (Hb)" type="number" step="0.1" {...register('labs.hemoglobin')} />
              <Input label="WBC Count" placeholder="WBC Count" type="number" step="0.1" {...register('labs.wbcCount')} />
              <Input label="RBC Count" placeholder="RBC Count" type="number" step="0.01" {...register('labs.rbcCount')} />
              <Input label="Hematocrit (HCT)" placeholder="Hematocrit (HCT)" type="number" step="0.1" {...register('labs.hematocrit')} />
              <Input label="Platelet Count" placeholder="Platelet Count" type="number" step="1" {...register('labs.plateletCount')} />
              <Input label="MCV" placeholder="MCV" type="number" step="0.1" {...register('labs.mcv')} />
              <Input label="MCH" placeholder="MCH" type="number" step="0.1" {...register('labs.mch')} />
              <Input label="MCHC" placeholder="MCHC" type="number" step="0.1" {...register('labs.mchc')} />
              <Input label="RDW" placeholder="RDW" type="number" step="0.1" {...register('labs.rdw')} />
              <Input label="Absolute Granulocytes" placeholder="Absolute Granulocytes" type="number" step="0.01" {...register('labs.absoluteGranulocytes')} />
              <Input label="Absolute Lymphocytes" placeholder="Absolute Lymphocytes" type="number" step="0.01" {...register('labs.absoluteLymphocytes')} />
              <Input label="Differential Count" placeholder="Differential Count" {...register('labs.differentialCount')} />
            </div>
          </div>

          {/* Subsection B: Biochemistry & Other Labs */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider text-teal-900 border-l-4 border-teal-600 pl-2">
              Biochemistry & Other Labs:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Input label="LDH" placeholder="LDH" type="number" step="1" {...register('labs.ldh')} />
              <Input label="Uric Acid" placeholder="Uric Acid" type="number" step="0.1" {...register('labs.uricAcid')} />
              <Input label="Serum Creatinine" placeholder="Serum Creatinine" type="number" step="0.01" {...register('labs.serumCreatinine')} />
              <Input label="ALT" placeholder="ALT" type="number" step="1" {...register('labs.alt')} />
              <Input label="AST" placeholder="AST" type="number" step="1" {...register('labs.ast')} />
            </div>
          </div>
        </div>

        {/* Section 4: Diagnosis & Outcome */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-lg border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-teal-700" />
            <span>Diagnosis & Outcome</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Diagnosis"
              required
              placeholder="Diagnosis"
              error={errors.diagnosis?.message as string}
              {...register('diagnosis')}
            />
            <Input label="Sub Type" placeholder="Sub Type" {...register('subType')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Stage / Risk Group" placeholder="Stage / Risk Group" {...register('stageRiskGroup')} />
            <Input label="IHC Markers" placeholder="IHC Markers" {...register('ihcMarkers')} />
            <Input label="Induction Protocol" placeholder="Induction Protocol" {...register('inductionProtocol')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="Treatment Response" placeholder="Treatment Response" {...register('treatmentResponse')} />
            <Input label="Relapse Date" type="date" {...register('relapseDate')} />
            <Select
              label="Outcome"
              options={[
                { value: '', label: 'Select outcome' },
                { value: 'Complete Remission', label: 'Complete Remission' },
                { value: 'Partial Remission', label: 'Partial Remission' },
                { value: 'Relapse', label: 'Relapse' },
                { value: 'Refractory', label: 'Refractory' },
                { value: 'Deceased', label: 'Deceased' },
                { value: 'Stable', label: 'Stable' },
                { value: 'Under Treatment', label: 'Under Treatment' },
              ]}
              {...register('outcome')}
            />
          </div>
        </div>

        {/* Floating / Sticky Save Patient Bar matching screenshots */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg z-30">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-1.5">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-12 py-3 bg-teal-800 hover:bg-teal-900 text-white font-semibold text-base rounded-xl shadow-md transition-transform active:scale-95"
              icon={<Save className="w-5 h-5" />}
            >
              {isSubmitting ? 'Saving to Device...' : 'Save Patient'}
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
