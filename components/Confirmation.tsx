
import React from 'react';
import { Patient, Doctor } from '../types';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface ConfirmationProps {
  patient: Patient;
  doctor: Doctor;
  onStartOver: () => void;
}

const Confirmation: React.FC<ConfirmationProps> = ({ patient, doctor, onStartOver }) => {
  return (
    <div className="text-center animate-fade-in h-full flex flex-col justify-between">
        <div>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20">
                <CheckCircleIcon className="h-6 w-6 text-green-300" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-200">Appointment Details Sent</h2>
            <p className="mt-2 text-slate-400 text-sm">
                Thank you, {patient.fullName}. The clinic will contact you shortly at {patient.contact} to confirm your appointment.
            </p>

            <div className="mt-6 text-left bg-slate-800/30 border border-slate-700/60 rounded-lg p-4 space-y-3 text-xs overflow-y-auto max-h-[250px]">
                <h3 className="text-md font-semibold text-slate-200 border-b border-slate-600 pb-2">Summary</h3>
                <div>
                    <h4 className="font-semibold text-slate-300">Patient Details</h4>
                    <p className="text-slate-400"><strong>Name:</strong> {patient.fullName}</p>
                    <p className="text-slate-400"><strong>Date of Birth:</strong> {patient.dob}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-slate-300 mt-2">Medical History</h4>
                    <p className="text-slate-400"><strong>Conditions:</strong> {patient.pastConditions || 'N/A'}</p>
                    <p className="text-slate-400"><strong>Surgeries:</strong> {patient.surgeries || 'N/A'}</p>
                    <p className="text-slate-400"><strong>Medications:</strong> {patient.medications || 'N/A'}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-300 mt-2">Selected Doctor & Clinic</h4>
                    <p className="text-slate-400"><strong>Doctor:</strong> {doctor.name}</p>
                    <p className="text-slate-400"><strong>Specialty:</strong> {doctor.specialty}</p>
                    <p className="text-slate-400"><strong>Clinic:</strong> {doctor.clinicName}</p>
                    <p className="text-slate-400"><strong>Address:</strong> {doctor.address}</p>
                </div>
            </div>
        </div>

        <div className="mt-6 flex-shrink-0">
            <button onClick={onStartOver} className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors">
                Start a New Intake
            </button>
        </div>
    </div>
  );
};

export default Confirmation;