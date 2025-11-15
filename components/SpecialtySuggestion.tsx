
import React, { useState, useEffect } from 'react';
import { getSpecialtySuggestion } from '../services/geminiService';
import { Patient, SpecialtyResponse } from '../types';
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
  const [response, setResponse] = useState<SpecialtyResponse | null>(null);

  useEffect(() => {
    const fetchSpecialty = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getSpecialtySuggestion(patient);
        setResponse(result);
        onSpecialtyFound(result.specialty);
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
    <div className="animate-fade-in h-full flex flex-col justify-between">
      <div>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 mb-3">
            <HeartStethoscopeIcon className="h-6 w-6 text-cyan-300" aria-hidden="true" />
        </div>
        <p className="text-slate-400 text-sm">Based on our analysis, here is our assessment:</p>
        <div className="mt-2 text-left bg-slate-800/30 border border-slate-700/60 rounded-lg p-4 space-y-3 text-sm overflow-y-auto max-h-[250px] custom-scrollbar">
            <h3 className="font-semibold text-slate-300">Detailed Analysis</h3>
            <p className="text-slate-400 whitespace-pre-wrap font-light">{response?.analysis}</p>
        </div>
        <div className="mt-4 text-center">
          <p className="text-slate-400">Recommended Specialty:</p>
          <p className="mt-1 text-2xl font-extrabold text-cyan-300" style={{ textShadow: 'var(--text-glow-cyan)' }}>
            {response?.specialty}
          </p>
        </div>
      </div>
      <div className="mt-6 flex-shrink-0">
          <button onClick={onProceed} className="w-full sm:w-auto mx-auto flex justify-center py-2 px-8 border border-cyan-500 rounded-md shadow-sm text-sm font-medium text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all hover:shadow-[var(--glow-cyan)]">
              Find a Doctor
          </button>
      </div>
    </div>
  );
};

export default SpecialtySuggestion;