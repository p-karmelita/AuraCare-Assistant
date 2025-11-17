
import React, { useState, useEffect } from 'react';
import { getDoctorSuggestions } from '../services/geminiService';
import { Doctor, GroundingSource } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { BuildingIcon } from './icons/BuildingIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { DoctorPlaceholderIcon } from './icons/DoctorPlaceholderIcon';
import { useTranslations } from '../hooks/useTranslations';

interface DoctorClinicSelectorProps {
  specialty: string;
  onSelect: (doctor: Doctor) => void;
  onBack: () => void;
}

const StarIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.215-.662 1.536 0l1.822 3.754 4.143.602c.73.106 1.02.998.494 1.512l-2.996 2.92.707 4.126c.125.728-.638 1.283-1.29.942L10 15.158l-3.707 1.948c-.652.34-1.415-.214-1.29-.942l.707-4.126-2.996-2.92c-.527-.514-.236-1.406.494-1.512l4.143-.602 1.822-3.754z" clipRule="evenodd" />
    </svg>
  );

const DoctorClinicSelector: React.FC<DoctorClinicSelectorProps> = ({ specialty, onSelect, onBack }) => {
  const { t } = useTranslations();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [sources, setSources] = useState<GroundingSource[]>([]);
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>(t('locationRequesting'));

  useEffect(() => {
    setLocationStatus(t('locationRequesting'));
    if (!navigator.geolocation) {
      setError(t('locationNotSupported'));
      setLocationStatus(t('locationNotSupported'));
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationStatus(t('locationFound'));
      },
      () => {
        setError(t('locationDenied'));
        setLocationStatus(t('locationDenied'));
        setLoading(false);
      }
    );
  }, [t]);

  useEffect(() => {
    if (!location) {
      return;
    }

    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const { doctors: result, sources: foundSources } = await getDoctorSuggestions(specialty, location.latitude, location.longitude);
        setDoctors(result);
        setSources(foundSources);
      } catch (err) {
        setError(t('errorFindDoctors'));
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialty, location, t]);

  if (!location && loading) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <LoadingSpinner />
            <p className="mt-4 text-slate-600 dark:text-slate-400">{locationStatus}</p>
        </div>
    );
  }

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <LoadingSpinner />
            <p className="mt-4 text-slate-600 dark:text-slate-400">{t('loadingFindingSpecialists')}</p>
        </div>
    );
  }

  if (error) {
     return (
        <div className="flex flex-col items-center justify-center h-full text-center text-red-500 dark:text-red-400">
            <p>{error}</p>
            <button onClick={onBack} className="mt-4 text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors font-medium">
             &larr; {t('goBack')}
          </button>
        </div>
    );
  }

  return (
    <div className="animate-fade-in h-full flex flex-col">
        <div className="flex-shrink-0 mb-4 flex items-center justify-between">
          <p className="text-slate-600 dark:text-slate-400 text-sm">{t('recommendedSpecialistsIn', { specialty })}</p>
          <button onClick={onBack} className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors font-medium">
             &larr; {t('back')}
          </button>
      </div>
        <div className="flex-grow overflow-y-auto pr-2 space-y-4">
            {doctors.map((doctor, index) => (
                <div key={index} className="bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/60 rounded-lg p-4 flex flex-col hover:bg-cyan-500/5 dark:hover:bg-cyan-500/10 hover:border-cyan-400/70 dark:hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.25)] transition-all duration-300">
                    <div className="flex-grow flex flex-col sm:flex-row items-start gap-4">
                        {doctor.photoUrl ? (
                          <img src={doctor.photoUrl} alt={doctor.name} className="w-24 h-24 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600 flex-shrink-0 mx-auto sm:mx-0" />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
                              <DoctorPlaceholderIcon className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                          </div>
                        )}
                        <div className="flex-grow text-center sm:text-left">
                            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{doctor.name}</h3>
                            <div className="mt-1 flex items-center justify-center sm:justify-start">
                                <BuildingIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2 flex-shrink-0" />
                                <p className="text-sm text-slate-600 dark:text-slate-300">{doctor.clinicName}</p>
                            </div>
                            <div className="mt-1 flex items-center justify-center sm:justify-start">
                               <StarIcon className="w-5 h-5 text-amber-400"/>
                               <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold ml-1">{doctor.rating.toFixed(1)}</span>
                            </div>
                            {doctor.bio && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 border-l-2 border-slate-300 dark:border-slate-700 pl-3">{doctor.bio}</p>
                            )}
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{doctor.address}</p>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/50 flex-shrink-0">
                        <button onClick={() => onSelect(doctor)} className="w-full sm:w-auto sm:float-right py-2 px-6 border border-cyan-500 rounded-md shadow-sm text-sm font-medium text-cyan-700 dark:text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all">
                            {t('selectAndProceed')}
                        </button>
                    </div>
                </div>
            ))}
        </div>
        {sources.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
                <h4 className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center">
                  <MapPinIcon className="w-4 h-4 mr-1.5"/> 
                  {t('dataSources')}
                </h4>
                <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside max-h-24 overflow-y-auto pr-2">
                    {sources.map((source, index) => (
                        <li key={index}>
                           <a href={source.uri} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors hover:underline">
                                {source.title}
                           </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
  );
};

export default DoctorClinicSelector;
