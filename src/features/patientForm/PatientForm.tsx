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

// Zod Validation Schema matching all fields from screenshots
const patientFormSchema = z.object({
  patientId: z.string().min(1, 'Patient ID / MRN is required'),
  age: z.coerce.number().optional().nullable(),
  gender: z.string().optional(),
  occupation: z.string().optional(),
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
  pastMedicalHistory: z.string().optional(),
  familyHistory: z.string().optional(),

  labs: z.object({
    hemoglobin: z.coerce.number().optional().nullable(),
    wbc: z.coerce.number().optional().nullable(),
    platelets: z.coerce.number().optional().nullable(),
    alt: z.coerce.number().optional().nullable(),
    ast: z.coerce.number().optional().nullable(),
    pbsBlasts: z.coerce.number().optional().nullable(),
    pbsFindings: z.string().optional(),
    bmAspirateBlast: z.coerce.number().optional().nullable(),
    bmCellularity: z.string().optional(),
    bmBiopsySummary: z.string().optional(),
    flowCytometry: z.string().optional(),
    cytogenetics: z.string().optional(),
    molecularGenetics: z.string().optional(),
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
    patientId: editingRecord?.patientId || '',
    age: editingRecord?.age ?? null,
    gender: editingRecord?.gender || 'Male',
    occupation: editingRecord?.occupation || '',
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
    pastMedicalHistory: editingRecord?.pastMedicalHistory || '',
    familyHistory: editingRecord?.familyHistory || '',
    labs: {
      hemoglobin: editingRecord?.labs?.hemoglobin ?? null,
      wbc: editingRecord?.labs?.wbc ?? null,
      platelets: editingRecord?.labs?.platelets ?? null,
      alt: editingRecord?.labs?.alt ?? null,
      ast: editingRecord?.labs?.ast ?? null,
      pbsBlasts: editingRecord?.labs?.pbsBlasts ?? null,
      pbsFindings: editingRecord?.labs?.pbsFindings || '',
      bmAspirateBlast: editingRecord?.labs?.bmAspirateBlast ?? null,
      bmCellularity: editingRecord?.labs?.bmCellularity || '',
      bmBiopsySummary: editingRecord?.labs?.bmBiopsySummary || '',
      flowCytometry: editingRecord?.labs?.flowCytometry || '',
      cytogenetics: editingRecord?.labs?.cytogenetics || '',
      molecularGenetics: editingRecord?.labs?.molecularGenetics || '',
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
    formState: { errors, isSubmitting },
  } = useForm<PatientFormData>({
    resolver: customZodResolver(patientFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [editingRecord]);

  const onSubmit = async (data: PatientFormData) => {
    try {
      await recordRepository.saveRecord({
        id: editingRecord?.id,
        createdAt: editingRecord?.createdAt,
        patientId: data.patientId,
        age: data.age,
        gender: data.gender,
        occupation: data.occupation,
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
        pastMedicalHistory: data.pastMedicalHistory,
        familyHistory: data.familyHistory,
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
            {editingRecord ? `Edit Patient Record (${editingRecord.patientId})` : 'New Patient Record'}
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
              label="Patient ID / MRN"
              required
              placeholder="e.g. PT-2024-089"
              error={errors.patientId?.message as string}
              {...register('patientId')}
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
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' },
              ]}
              {...register('gender')}
            />
            <Input
              label="Occupation"
              placeholder="Occupation"
              {...register('occupation')}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <Textarea
              label="Chief Complaint"
              placeholder="Chief Complaint"
              {...register('chiefComplaint')}
            />
            <Textarea
              label="Past Medical History"
              placeholder="Past Medical History"
              {...register('pastMedicalHistory')}
            />
            <Textarea
              label="Family History"
              placeholder="Family History"
              {...register('familyHistory')}
            />
          </div>
        </div>

        {/* Section 3: Labs & Diagnostics */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-lg border-b border-slate-100 pb-3">
            <FlaskConical className="w-5 h-5 text-teal-700" />
            <span>Labs & Diagnostics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <Input label="Hemoglobin (Hb)" unit="g/dL" placeholder="Hb (g/dL)" type="number" step="0.1" {...register('labs.hemoglobin')} />
            <Input label="WBC" unit="x10^9/L" placeholder="WBC" type="number" step="0.1" {...register('labs.wbc')} />
            <Input label="Platelets" unit="x10^9/L" placeholder="Platelets" type="number" step="1" {...register('labs.platelets')} />
            <Input label="ALT" unit="U/L" placeholder="ALT (U/L)" type="number" step="1" {...register('labs.alt')} />
            <Input label="AST" unit="U/L" placeholder="AST (U/L)" type="number" step="1" {...register('labs.ast')} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input label="PBS Blasts (%)" placeholder="PBS Blasts (%)" type="number" step="0.1" {...register('labs.pbsBlasts')} />
            <Input label="BM Aspirate Blast (%)" placeholder="BM Aspirate Blast (%)" type="number" step="0.1" {...register('labs.bmAspirateBlast')} />
            <Input label="BM Cellularity" placeholder="BM Cellularity" {...register('labs.bmCellularity')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea label="PBS Findings" placeholder="PBS Findings" {...register('labs.pbsFindings')} />
            <Textarea label="BM Biopsy Summary" placeholder="BM Biopsy Summary" {...register('labs.bmBiopsySummary')} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Textarea label="Flow Cytometry" placeholder="Flow Cytometry" {...register('labs.flowCytometry')} />
            <Textarea label="Cytogenetics" placeholder="Cytogenetics" {...register('labs.cytogenetics')} />
            <Textarea label="Molecular Genetics" placeholder="Molecular Genetics" {...register('labs.molecularGenetics')} />
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
