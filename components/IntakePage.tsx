
import React, { useState, useCallback } from 'react';
import { IntakeStep, Doctor, Patient } from '../types';
import PatientIntakeForm from './PatientIntakeForm';
import SpecialtySuggestion from './SpecialtySuggestion';
import DoctorClinicSelector from './DoctorClinicSelector';
import Confirmation from './Confirmation';
import VoiceIntakeModal from './VoiceIntakeModal';
import ImageAnalysis from './ImageAnalysis';

const initialPatientData: Patient = {
    fullName: '',
    dob: '',
    contact: '',
    symptoms: '',
    pastConditions: '',
    surgeries: '',
    medications: '',
};

const IntakePage: React.FC = () => {
    const [step, setStep] = useState<IntakeStep>('intake');
    const [patientData, setPatientData] = useState<Patient>(initialPatientData);
    const [specialty, setSpecialty] = useState<string>('');
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [showVoiceIntake, setShowVoiceIntake] = useState(false);

    const handleDataChange = (field: keyof Patient, value: string) => {
        setPatientData(prev => ({...prev, [field]: value}));
    };

    const handleIntakeSubmit = (data: Patient) => {
        setPatientData(data);
        setShowVoiceIntake(false);
        setStep('specialty');
    };

    const handleSpecialtyFound = (foundSpecialty: string) => {
        setSpecialty(foundSpecialty);
    };

    const handleProceedToDoctors = () => {
        setStep('doctors');
    };

    const handleDoctorSelect = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setStep('confirmation');
    };
    
    const handleBackToSpecialty = () => {
        setStep('specialty');
    };

    const handleStartOver = useCallback(() => {
        setStep('intake');
        setPatientData(initialPatientData);
        setSpecialty('');
        setSelectedDoctor(null);
    }, []);

    const handleStartVoiceIntake = () => {
        setShowVoiceIntake(true);
    };
    
    const handleStartImageAnalysis = () => {
        setStep('imageAnalysis');
    };

    const handleImageAnalysisComplete = (analysisText: string) => {
        handleDataChange('symptoms', analysisText);
        setStep('intake');
    };

    const handleBackToIntake = () => {
        setStep('intake');
    }

    const handleCloseVoiceIntake = () => {
        setShowVoiceIntake(false);
    };

    const renderStep = () => {
        switch (step) {
            case 'intake':
                return <PatientIntakeForm 
                    patientData={patientData}
                    onDataChange={handleDataChange}
                    onSubmit={handleIntakeSubmit} 
                    onStartVoiceIntake={handleStartVoiceIntake}
                    onStartImageAnalysis={handleStartImageAnalysis} 
                />;
            case 'imageAnalysis':
                return <ImageAnalysis 
                    onBack={handleBackToIntake}
                    onAnalysisComplete={handleImageAnalysisComplete}
                />;
            case 'specialty':
                return (
                    <SpecialtySuggestion
                        patient={patientData}
                        onSpecialtyFound={handleSpecialtyFound}
                        onProceed={handleProceedToDoctors}
                    />
                );
            case 'doctors':
                return specialty && <DoctorClinicSelector specialty={specialty} onSelect={handleDoctorSelect} onBack={handleBackToSpecialty} />;
            case 'confirmation':
                return selectedDoctor && (
                    <Confirmation
                        patient={patientData}
                        doctor={selectedDoctor}
                        onStartOver={handleStartOver}
                    />
                );
            default:
                return null;
        }
    };

    const getStepTitle = () => {
        switch (step) {
            case 'intake':
                return 'Patient Intake';
            case 'imageAnalysis':
                return 'Premium AI Image Analysis';
            case 'specialty':
                return 'AI Symptom Analysis';
            case 'doctors':
                return 'Find a Specialist';
            case 'confirmation':
                return 'Confirmation & Automated Workflows';
            default:
                return 'AuraCare Assistant';
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="z-10 w-full max-w-2xl animate-fade-in">
                <div
                    className={`
                        bg-black/40 backdrop-blur-2xl border border-cyan-400/50 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3),inset_0_0_10px_rgba(6,182,212,0.1)]
                        flex flex-col h-[85vh] max-h-[750px]
                    `}
                >
                    <h3 className="text-md font-bold p-4 border-b text-cyan-200 border-cyan-300/20 flex-shrink-0">
                        {getStepTitle()}
                    </h3>
                    <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
                        {renderStep()}
                    </div>
                </div>
            </div>

            {showVoiceIntake && (
                <VoiceIntakeModal 
                    onClose={handleCloseVoiceIntake} 
                    onSubmit={handleIntakeSubmit} 
                />
            )}
        </div>
    );
};

export default IntakePage;
