
import React, { useState } from 'react';
import { Patient } from '../types';
import { MicrophoneIcon } from './icons/MicrophoneIcon';

interface PatientIntakeFormProps {
  onSubmit: (data: Patient) => void;
  onStartVoiceIntake: () => void;
}

const PatientIntakeForm: React.FC<PatientIntakeFormProps> = ({ onSubmit, onStartVoiceIntake }) => {
  const [formData, setFormData] = useState<Patient>({
    fullName: '',
    dob: '',
    contact: '',
    symptoms: '',
    pastConditions: '',
    surgeries: '',
    medications: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputStyle = "mt-1 block w-full px-3 py-2 bg-white/5 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 focus:bg-white/10 sm:text-sm transition-all text-slate-200 placeholder:text-slate-500";
  const labelStyle = "block text-xs font-medium text-slate-400";

  return (
    <div className="animate-fade-in h-full flex flex-col">
        <p className="text-center text-slate-400 text-sm mb-4">Please provide your details or use voice intake.</p>
        <form onSubmit={handleSubmit} className="space-y-3 flex-grow overflow-y-auto pr-2">
            <fieldset>
                 <legend className="text-sm font-semibold text-cyan-300 mb-2">Patient Information</legend>
                 <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="fullName" className={labelStyle}>Full Name</label>
                            <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} required className={inputStyle} placeholder="e.g., Jane Doe" />
                        </div>
                        <div>
                            <label htmlFor="dob" className={labelStyle}>Date of Birth</label>
                            <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} required className={`${inputStyle} [color-scheme:dark]`} />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="contact" className={labelStyle}>Email or Phone Number</label>
                        <input type="text" name="contact" id="contact" value={formData.contact} onChange={handleChange} required className={inputStyle} placeholder="email@example.com" />
                    </div>
                    <div>
                        <label htmlFor="symptoms" className={labelStyle}>Please describe your symptoms</label>
                        <textarea name="symptoms" id="symptoms" rows={2} value={formData.symptoms} onChange={handleChange} required className={inputStyle} placeholder="e.g., Sharp chest pains..."></textarea>
                    </div>
                </div>
            </fieldset>

            <fieldset className="!mt-4">
                 <legend className="text-sm font-semibold text-cyan-300 mb-2">Medical History</legend>
                 <div className="space-y-3">
                    <div>
                        <label htmlFor="pastConditions" className={labelStyle}>Past Medical Conditions</label>
                        <textarea name="pastConditions" id="pastConditions" rows={2} value={formData.pastConditions} onChange={handleChange} className={inputStyle} placeholder="e.g., Asthma, Hypertension..."></textarea>
                    </div>
                    <div>
                        <label htmlFor="surgeries" className={labelStyle}>Previous Surgeries</label>
                        <textarea name="surgeries" id="surgeries" rows={2} value={formData.surgeries} onChange={handleChange} className={inputStyle} placeholder="e.g., Appendectomy (2015)..."></textarea>
                    </div>
                     <div>
                        <label htmlFor="medications" className={labelStyle}>Current Medications</label>
                        <textarea name="medications" id="medications" rows={2} value={formData.medications} onChange={handleChange} className={inputStyle} placeholder="e.g., Lisinopril 10mg..."></textarea>
                    </div>
                </div>
            </fieldset>

             <div className="!mt-4 pt-2">
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-cyan-500 rounded-md shadow-sm text-sm font-medium text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all hover:shadow-[var(--glow-cyan)]">
                    Submit and Analyze
                </button>
            </div>
        </form>
         <div className="mt-4 relative flex-shrink-0">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-700" />
            </div>
            <div className="relative flex justify-center">
                <span className="bg-black/20 px-2 text-sm text-slate-500 backdrop-blur-sm">Or</span>
            </div>
        </div>
        <div className="mt-4 flex-shrink-0">
            <button
                type="button"
                onClick={onStartVoiceIntake}
                className="w-full flex justify-center items-center py-2 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-slate-500/10 hover:bg-slate-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-colors"
            >
                <MicrophoneIcon className="w-5 h-5 mr-2 text-slate-400" />
                Start Voice Intake
            </button>
        </div>
    </div>
  );
};

export default PatientIntakeForm;