
import React from 'react';
import { Patient } from '../types';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { DocumentScannerIcon } from './icons/DocumentScannerIcon';
import { useTranslations } from '../hooks/useTranslations';

interface PatientIntakeFormProps {
  patientData: Patient;
  onDataChange: (field: keyof Patient, value: string) => void;
  onSubmit: (data: Patient) => void;
  onStartVoiceIntake: () => void;
  onStartImageAnalysis: () => void;
}

const PatientIntakeForm: React.FC<PatientIntakeFormProps> = ({ patientData, onDataChange, onSubmit, onStartVoiceIntake, onStartImageAnalysis }) => {
  const { t } = useTranslations();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onDataChange(name as keyof Patient, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(patientData);
  };

  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white/5 dark:bg-white/5 border border-slate-400 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 dark:focus:bg-white/10 sm:text-sm transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-500";
  const labelStyle = "block text-xs font-medium text-slate-600 dark:text-slate-400";

  return (
    <div className="animate-fade-in h-full flex flex-col">
        <p className="text-center text-slate-600 dark:text-slate-400 text-sm mb-4">{t('intakeFormDesc')}</p>
        <form onSubmit={handleSubmit} className="space-y-3 flex-grow overflow-y-auto pr-2">
            <fieldset>
                 <legend className="text-sm font-semibold text-cyan-600 dark:text-cyan-300 mb-2">{t('patientInfo')}</legend>
                 <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="fullName" className={labelStyle}>{t('fullName')}</label>
                            <input type="text" name="fullName" id="fullName" value={patientData.fullName} onChange={handleChange} required className={inputStyle} placeholder={t('fullNamePlaceholder')} />
                        </div>
                        <div>
                            <label htmlFor="dob" className={labelStyle}>{t('dob')}</label>
                            <input type="date" name="dob" id="dob" value={patientData.dob} onChange={handleChange} required className={`${inputStyle} [color-scheme:dark]`} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="contact" className={labelStyle}>{t('contactInfo')}</label>
                        <input type="text" name="contact" id="contact" value={patientData.contact} onChange={handleChange} required className={inputStyle} placeholder={t('contactInfoPlaceholder')} />
                    </div>
                    <div>
                        <label htmlFor="symptoms" className={labelStyle}>{t('symptoms')}</label>
                        <textarea name="symptoms" id="symptoms" rows={2} value={patientData.symptoms} onChange={handleChange} required className={inputStyle} placeholder={t('symptomsPlaceholder')}></textarea>
                    </div>
                </div>
            </fieldset>

            <fieldset className="!mt-4">
                 <legend className="text-sm font-semibold text-cyan-600 dark:text-cyan-300 mb-2">{t('medicalHistory')}</legend>
                 <div className="space-y-3">
                    <div>
                        <label htmlFor="pastConditions" className={labelStyle}>{t('pastConditions')}</label>
                        <textarea name="pastConditions" id="pastConditions" rows={2} value={patientData.pastConditions} onChange={handleChange} className={inputStyle} placeholder={t('pastConditionsPlaceholder')}></textarea>
                    </div>
                    <div>
                        <label htmlFor="surgeries" className={labelStyle}>{t('surgeries')}</label>
                        <textarea name="surgeries" id="surgeries" rows={2} value={patientData.surgeries} onChange={handleChange} className={inputStyle} placeholder={t('surgeriesPlaceholder')}></textarea>
                    </div>
                     <div>
                        <label htmlFor="medications" className={labelStyle}>{t('medications')}</label>
                        <textarea name="medications" id="medications" rows={2} value={patientData.medications} onChange={handleChange} className={inputStyle} placeholder={t('medicationsPlaceholder')}></textarea>
                    </div>
                </div>
            </fieldset>

             <div className="!mt-4 pt-2">
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-cyan-500 rounded-md shadow-sm text-sm font-medium text-cyan-700 dark:text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all hover:shadow-[var(--glow-cyan)]">
                    {t('submitAndAnalyze')}
                </button>
            </div>
        </form>
         <div className="mt-4 relative flex-shrink-0">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-300 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-white/80 dark:bg-black/20 px-2 text-sm text-slate-500 backdrop-blur-sm">{t('orUseAIAssistant')}</span>
            </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 flex-shrink-0">
            <button
                type="button"
                onClick={onStartVoiceIntake}
                className="w-full flex justify-center items-center py-2 px-4 border border-slate-400 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-500/10 hover:bg-slate-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors"
            >
                <MicrophoneIcon className="w-5 h-5 rtl:ml-2 ltr:mr-2 text-slate-500 dark:text-slate-400" />
                {t('startVoiceIntake')}
            </button>
            <button
                type="button"
                onClick={onStartImageAnalysis}
                className="w-full flex justify-center items-center py-2 px-4 border border-slate-400 dark:border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-500/10 hover:bg-slate-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors"
            >
                <DocumentScannerIcon className="w-5 h-5 rtl:ml-2 ltr:mr-2 text-slate-500 dark:text-slate-400" />
                {t('analyzeImage')}
            </button>
        </div>
    </div>
  );
};

export default PatientIntakeForm;
