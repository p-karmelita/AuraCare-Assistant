
import React from 'react';
import { Patient, Doctor } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { useTranslations } from '../hooks/useTranslations';

interface ConfirmationProps {
  patient: Patient;
  doctor: Doctor;
  onStartOver: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ patient, doctor, onStartOver }) => {
  const { t } = useTranslations();
  
  return (
    <div className="text-center animate-fade-in h-full flex flex-col justify-between">
        <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircleIcon className="h-6 w-6 text-green-400 dark:text-green-300" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-slate-200">{t('confirmationTitle')}</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
                {t('confirmationSubtitle', { fullName: patient.fullName, contact: patient.contact })}
            </p>

            <div className="mt-6 text-left bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/60 rounded-lg p-4 space-y-3 text-xs overflow-y-auto max-h-[250px]">
                <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-600 pb-2">{t('summary')}</h3>
                <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300">{t('patientDetails')}</h4>
                    <p className="text-slate-600 dark:text-slate-400"><strong>{t('nameLabel')}:</strong> {patient.fullName}</p>
                    <p className="text-slate-600 dark:text-slate-400"><strong>{t('dobLabel')}:</strong> {patient.dob}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mt-2">{t('medicalHistory')}</h4>
                    <p className="text-slate-600 dark:text-slate-400"><strong>{t('conditionsLabel')}:</strong> {patient.pastConditions || t('na')}</p>
                    <p className="text-slate-600 dark:text-slate-400"><strong>{t('surgeriesLabel')}:</strong> {patient.surgeries || t('na')}</p>
                    <p className="text-slate-600 dark:text-slate-400"><strong>{t('medicationsLabel')}:</strong> {patient.medications || t('na')}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300 mt-2">{t('selectedDoctorClinic')}</h4>
                    <p className="text-slate-600 dark:text-slate-400"><strong>{t('doctorLabel')}:</strong> {doctor.name}</p>
                    <p className="text-slate-600 dark:text-slate-400"><strong>{t('specialtyLabel')}:</strong> {doctor.specialty}</p>
                    <p className="text-slate-600 dark:text-slate-400"><strong>{t('clinicLabel')}:</strong> {doctor.clinicName}</p>
                    <p className="text-slate-600 dark:text-slate-400"><strong>{t('addressLabel')}:</strong> {doctor.address}</p>
                </div>
            </div>
        </div>

        <div className="mt-6 flex-shrink-0">
            <button onClick={onStartOver} className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-cyan-700 dark:text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors">
                {t('startNewIntake')}
            </button>
        </div>
    </div>
  );
};

export default Confirmation;
