
import React, { useState, useCallback } from 'react';
import { AppStep, Doctor, Patient } from './types';
import PatientIntakeForm from './components/PatientIntakeForm';
import SpecialtySuggestion from './components/SpecialtySuggestion';
import DoctorClinicSelector from './components/DoctorClinicSelector';
import Confirmation from './components/Confirmation';
import VoiceIntakeModal from './components/VoiceIntakeModal';
import { AuraCareLogo } from './components/icons/AuraCareLogo';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('intake');
  const [patientData, setPatientData] = useState<Patient | null>(null);
  const [specialty, setSpecialty] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showVoiceIntake, setShowVoiceIntake] = useState(false);

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
    setPatientData(null);
    setSpecialty('');
    setSelectedDoctor(null);
  }, []);

  const handleStartVoiceIntake = () => {
    setShowVoiceIntake(true);
  };

  const handleCloseVoiceIntake = () => {
    setShowVoiceIntake(false);
  };

  const renderStep = () => {
    switch (step) {
      case 'intake':
        return <PatientIntakeForm onSubmit={handleIntakeSubmit} onStartVoiceIntake={handleStartVoiceIntake} />;
      case 'specialty':
        return patientData && (
          <SpecialtySuggestion
            patient={patientData}
            onSpecialtyFound={handleSpecialtyFound}
            onProceed={handleProceedToDoctors}
          />
        );
      case 'doctors':
        return specialty && <DoctorClinicSelector specialty={specialty} onSelect={handleDoctorSelect} onBack={handleBackToSpecialty} />;
      case 'confirmation':
        return patientData && selectedDoctor && (
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
      case 'specialty':
        return 'AI Symptom Analysis';
      case 'doctors':
        return 'Find a Specialist';
      case 'confirmation':
        return 'Confirmation & Automated Workflows';
      default:
        return 'AuraCare Assistant';
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-2 sm:p-4 lg:p-8 font-sans relative">
      <header 
        className="absolute top-0 left-0 p-4 sm:p-6 lg:p-8 flex items-center cursor-pointer group"
        onClick={handleStartOver}
        role="button"
        aria-label="Go to homepage"
      >
        <AuraCareLogo className="w-10 h-10 text-cyan-400 transition-all duration-300 group-hover:text-cyan-300" style={{ filter: `drop-shadow(0 0 10px #06b6d4)` }} />
        <h1 className="ml-3 text-2xl font-bold text-slate-100 transition-all duration-300 group-hover:text-white" style={{ textShadow: 'var(--text-glow-cyan)' }}>
            AuraCare Assistant
        </h1>
      </header>

      {/* Active Step Container */}
      <div className="z-10 w-full max-w-2xl animate-fade-in mt-16 sm:mt-0">
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

export default App;
