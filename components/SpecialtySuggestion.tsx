
import React, { useState, useEffect } from 'react';
import { getSpecialtySuggestion } from '../services/geminiService';
import { Patient } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { HeartStethoscopeIcon } from './icons/HeartStethoscopeIcon';

interface SpecialtySuggestionProps {
  patient: Patient;
  onSpecialtyFound: (specialty: string) => void;
  onProceed: () => void;
}

const SpecialtySuggestion: React.FC<SpecialtySuggestionProps> = ({ patient, onSpecialtyFound, onProceed }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [specialty, setSpecialty] = useState<string>('');

  useEffect(() => {
    const fetchSpecialty = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getSpecialtySuggestion(patient);
        setSpecialty(result);
        onSpecialtyFound(result);
      } catch (err) {
        setError('Could not get AI suggestion. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSpecialty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient]);

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <LoadingSpinner />
            <p className="mt-4 text-slate-400">Our AI is analyzing your symptoms and medical history...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-400">
            <p>{error}</p>
        </div>
    );
  }

  return (
    <div className="text-center animate-fade-in h-full flex flex-col justify-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20">
            <HeartStethoscopeIcon className="h-6 w-6 text-cyan-300" aria-hidden="true" />
        </div>
        <p className="mt-4 text-slate-400">Based on your symptoms and history, we recommend consulting a specialist in:</p>
        <p className="mt-2 text-3xl font-extrabold text-cyan-300" style={{ textShadow: 'var(--text-glow-cyan)' }}>{specialty}</p>
        <div className="mt-6">
            <button onClick={onProceed} className="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-cyan-500 rounded-md shadow-sm text-sm font-medium text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all hover:shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                Find a Doctor
            </button>
        </div>
    </div>
  );
};

export default SpecialtySuggestion;