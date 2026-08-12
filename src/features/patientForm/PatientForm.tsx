import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Save, ArrowLeft, RotateCcw, User, FlaskConical, CheckCircle, Activity } from 'lucide-react';

import { recordRepository } from '../../db/repository';
import { useRecordStore } from '../../stores/useRecordStore';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

// Inline Zod Resolver for 100% Vite bundling reliability
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

const SEX_OPTIONS = [
  { value: '', label: 'Select Sex' },
  { value: '1', label: '1 = Male' },
  { value: '2', label: '2 = Female' },
];

const YES_NO_OPTIONS = [
  { value: '', label: 'Select Option' },
  { value: '1', label: '1 = Yes' },
  { value: '0', label: '0 = No' },
];

// Zod Validation Schema - All fields are optional!
const patientFormSchema = z.object({
  // Section 1: Demographics
  id: z.string().optional(),
  age: z.string().optional(), // Accepts number in fraction e.g. 0.5 (5 months)
  sex: z.string().optional(),
  admissionDate: z.string().optional(),
  weight: z.string().optional(), // Accepts rational numbers e.g. 70 or 68.5

  // Section 2: PMHX
  previousCKD: z.string().optional(),

  // Section 3: Labs
  labs: z.object({
    hb: z.string().optional(),
    wbcCount: z.string().optional(),
    plateletsCount: z.string().optional(),
    sCr: z.string().optional(),
    egfr: z.string().optional(), // eGFR (right after S. Cr)
    ri: z.string().optional(), // RI (right after eGFR)
    bUrea: z.string().optional(),
    ca: z.string().optional(),
    ldh: z.string().optional(),
    uricAcid: z.string().optional(),
    b2Microglobulin: z.string().optional(),
    bmPlasmaCellPercent: z.string().optional(),

    // Serum Protein Electrophoresis Bands
    spepAlbumin: z.string().optional(),
    spepAlpha1Globulin: z.string().optional(),
    spepAlpha2Globulin: z.string().optional(),
    spepBetaGlobulin: z.string().optional(),
    spepGammaGlobulin: z.string().optional(),
    spepAgRatio: z.string().optional(),
  }),
});

type PatientFormData = z.infer<typeof patientFormSchema>;

export const PatientForm: React.FC = () => {
  const { editingRecord, setEditingRecord, setActiveTab } = useRecordStore();
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const defaultValues: PatientFormData = {
    id: editingRecord?.studyId || editingRecord?.patientId || '',
    age: editingRecord?.age !== undefined && editingRecord?.age !== null ? String(editingRecord.age) : '',
    sex: editingRecord?.sex === 'Male' ? '1' : editingRecord?.sex === 'Female' ? '2' : (editingRecord?.sex || editingRecord?.gender || ''),
    admissionDate: editingRecord?.admissionDate || new Date().toISOString().split('T')[0],
    weight: editingRecord?.weight !== undefined && editingRecord?.weight !== null ? String(editingRecord.weight) : '',
    previousCKD: editingRecord?.previousCKD === 'Yes' ? '1' : editingRecord?.previousCKD === 'No' ? '0' : (editingRecord?.previousCKD || editingRecord?.pmhx?.previousCKD || ''),
    labs: {
      hb: editingRecord?.labs?.hb ?? '',
      wbcCount: editingRecord?.labs?.wbcCount ?? '',
      plateletsCount: editingRecord?.labs?.plateletsCount ?? '',
      sCr: editingRecord?.labs?.sCr ?? '',
      egfr: editingRecord?.labs?.egfr ?? '',
      ri: editingRecord?.labs?.ri ?? '',
      bUrea: editingRecord?.labs?.bUrea ?? '',
      ca: editingRecord?.labs?.ca ?? '',
      ldh: editingRecord?.labs?.ldh ?? '',
      uricAcid: editingRecord?.labs?.uricAcid ?? '',
      b2Microglobulin: editingRecord?.labs?.b2Microglobulin ?? '',
      bmPlasmaCellPercent: editingRecord?.labs?.bmPlasmaCellPercent ?? '',
      spepAlbumin: editingRecord?.labs?.spepAlbumin ?? '',
      spepAlpha1Globulin: editingRecord?.labs?.spepAlpha1Globulin ?? '',
      spepAlpha2Globulin: editingRecord?.labs?.spepAlpha2Globulin ?? '',
      spepBetaGlobulin: editingRecord?.labs?.spepBetaGlobulin ?? '',
      spepGammaGlobulin: editingRecord?.labs?.spepGammaGlobulin ?? '',
      spepAgRatio: editingRecord?.labs?.spepAgRatio ?? '',
    },
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PatientFormData>({
    resolver: customZodResolver(patientFormSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [editingRecord]);

  const onSubmit = async (data: PatientFormData) => {
    if (isSubmitting || saveSuccess) return;

    try {
      const generatedStudyId = data.id?.trim() || `PAT-${Date.now().toString().slice(-6)}`;

      await recordRepository.saveRecord({
        id: editingRecord?.id,
        createdAt: editingRecord?.createdAt,
        studyId: generatedStudyId,
        patientId: generatedStudyId,
        age: data.age ? parseFloat(data.age) || data.age : null,
        sex: data.sex,
        gender: data.sex,
        admissionDate: data.admissionDate,
        weight: data.weight ? parseFloat(data.weight) || data.weight : null,
        previousCKD: data.previousCKD,
        pmhx: {
          previousCKD: data.previousCKD,
        },
        labs: data.labs,
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
    <div className="max-w-4xl mx-auto pb-36 px-1 sm:px-0">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 sm:gap-3">
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
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
            {editingRecord ? `Edit Case (${editingRecord.studyId || editingRecord.patientId})` : 'New Patient Case'}
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
            <p className="font-semibold text-sm">Patient Case Record Saved Successfully!</p>
            <p className="text-xs text-emerald-700">Stored safely in your device's IndexedDB collection.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
        {/* Section 1: Demographics */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-base sm:text-lg border-b border-slate-100 pb-3">
            <User className="w-5 h-5 text-teal-700 shrink-0" />
            <span>1. Demographics</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            <Input
              label="ID"
              {...register('id')}
            />
            <Input
              label="Age"
              type="number"
              step="any"
              placeholder="e.g. 42 or 0.5 (5 months)"
              {...register('age')}
            />
            <Select
              label="Sex"
              options={SEX_OPTIONS}
              {...register('sex')}
            />
            <Input
              label="Date of admission"
              type="date"
              {...register('admissionDate')}
            />
            <Input
              label="Weight"
              type="number"
              step="any"
              placeholder="e.g. 70 or 68.5"
              {...register('weight')}
            />
          </div>
        </div>

        {/* Section 2: PMHX */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-4 sm:space-y-5">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-base sm:text-lg border-b border-slate-100 pb-3">
            <Activity className="w-5 h-5 text-teal-700 shrink-0" />
            <span>2. PMHX</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Select
              label="Previous CKD?"
              options={YES_NO_OPTIONS}
              {...register('previousCKD')}
            />
          </div>
        </div>

        {/* Section 3: Labs */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-teal-800 font-semibold text-base sm:text-lg border-b border-slate-100 pb-3">
            <FlaskConical className="w-5 h-5 text-teal-700 shrink-0" />
            <span>3. Labs</span>
          </div>

          {/* Standard Lab Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Input
              label="Hb"
              {...register('labs.hb')}
            />
            <Input
              label="WBC count"
              {...register('labs.wbcCount')}
            />
            <Input
              label="Platelets count"
              {...register('labs.plateletsCount')}
            />
            <Input
              label="S. Cr"
              {...register('labs.sCr')}
            />
            <Input
              label="eGFR"
              {...register('labs.egfr')}
            />
            <Input
              label="RI"
              {...register('labs.ri')}
            />
            <Input
              label="B. Urea"
              {...register('labs.bUrea')}
            />
            <Input
              label="Ca"
              {...register('labs.ca')}
            />
            <Input
              label="LDH"
              {...register('labs.ldh')}
            />
            <Input
              label="uric acid"
              {...register('labs.uricAcid')}
            />
            <Input
              label="B2 Microglobulin"
              {...register('labs.b2Microglobulin')}
            />
            <Input
              label="Bone marrow plasma cell percentage"
              {...register('labs.bmPlasmaCellPercent')}
            />
          </div>

          {/* Serum Protein Electrophoresis Bands Subsection */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-teal-900 border-l-4 border-teal-600 pl-2">
              Serum Protein Electrophoresis Bands:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Input
                label="Albumin"
                {...register('labs.spepAlbumin')}
              />
              <Input
                label="Alpha 1 Globulin"
                {...register('labs.spepAlpha1Globulin')}
              />
              <Input
                label="Alpha 2 Globulin"
                {...register('labs.spepAlpha2Globulin')}
              />
              <Input
                label="Beta Globulin"
                {...register('labs.spepBetaGlobulin')}
              />
              <Input
                label="Gamma Globulin"
                {...register('labs.spepGammaGlobulin')}
              />
              <Input
                label="A/G Ratio"
                {...register('labs.spepAgRatio')}
              />
            </div>
          </div>
        </div>

        {/* Sticky Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 bg-white/95 backdrop-blur border-t border-slate-200 shadow-lg z-30">
          <div className="max-w-4xl mx-auto flex flex-col items-center gap-1">
            <Button
              type="submit"
              disabled={isSubmitting || saveSuccess}
              className={`w-full sm:w-auto px-10 py-3 font-semibold text-sm sm:text-base rounded-xl shadow-md transition-all ${
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
            <p className="text-[11px] sm:text-xs text-slate-500 text-center">
              Saved to this device first — syncs automatically when you are back online
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
