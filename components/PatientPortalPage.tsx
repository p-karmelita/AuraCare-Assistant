
import React, { useState, useMemo } from 'react';
import { Appointment, Doctor } from '../types';
import * as authService from '../services/authService';
import PaymentModal from './PaymentModal';
import { CalendarIcon } from './icons/CalendarIcon';
import { ClockIcon } from './icons/ClockIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { HeartStethoscopeIcon } from './icons/HeartStethoscopeIcon';
import { useTranslations } from '../hooks/useTranslations';

const mockDoctor1: Doctor = {
    name: 'Dr. Anna Kowalska',
    specialty: 'Cardiology',
    clinicName: 'AuraCare Central Clinic',
    address: '123 Health St, Warsaw, Poland',
    rating: 4.8,
    photoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026702d'
};

const mockDoctor2: Doctor = {
    name: 'Dr. Jan Nowak',
    specialty: 'Dermatology',
    clinicName: 'Skin Health Associates',
    address: '456 Wellness Ave, Krakow, Poland',
    rating: 4.9,
    photoUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026703d'
};

const mockAppointments: Appointment[] = [
    {
        id: '1',
        doctor: mockDoctor1,
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        time: '10:30 AM',
        status: 'Upcoming',
        cost: 250,
    },
    {
        id: '2',
        doctor: mockDoctor2,
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        time: '02:00 PM',
        status: 'Payment Due',
        cost: 300,
    },
    {
        id: '3',
        doctor: mockDoctor1,
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        time: '09:00 AM',
        status: 'Completed',
        cost: 250,
    },
    {
        id: '4',
        doctor: mockDoctor2,
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        time: '11:00 AM',
        status: 'Upcoming',
        cost: 300,
    },
];

const PatientPortalPage: React.FC = () => {
    const { t } = useTranslations();
    const user = authService.getCurrentUser();
    const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    const { upcoming, past } = useMemo(() => {
        const now = new Date();
        const upcoming: Appointment[] = [];
        const past: Appointment[] = [];
        appointments.forEach(appt => {
            if (new Date(appt.date) >= now) {
                upcoming.push(appt);
            } else {
                past.push(appt);
            }
        });
        return {
            upcoming: upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
            past: past.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        };
    }, [appointments]);

    const handlePaymentSuccess = (appointmentId: string) => {
        setAppointments(prev =>
            prev.map(appt =>
                appt.id === appointmentId ? { ...appt, status: 'Completed' } : appt
            )
        );
        setSelectedAppointment(null);
    };
    
    const getStatusChipStyle = (status: Appointment['status']): string => {
        switch (status) {
            case 'Upcoming':
                return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-400/50';
            case 'Completed':
                return 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-400/50';
            case 'Cancelled':
                return 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-400/50';
            case 'Payment Due':
                return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-400/50';
            default:
                return 'bg-slate-500/20 text-slate-700 dark:text-slate-300 border-slate-400/50';
        }
    };
    
    const AppointmentCard: React.FC<{ appt: Appointment }> = ({ appt }) => (
        <div className="bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-lg p-4 flex flex-col sm:flex-row gap-4 transition-all hover:border-cyan-400/70 hover:shadow-lg">
            <div className="flex-shrink-0">
                 <img src={appt.doctor.photoUrl} alt={appt.doctor.name} className="w-20 h-20 rounded-full object-cover border-2 border-slate-300 dark:border-slate-600 mx-auto" />
            </div>
            <div className="flex-grow text-center sm:text-left">
                <div className="flex flex-col sm:flex-row justify-between items-start">
                    <div>
                        <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">{appt.doctor.name}</h4>
                        <p className="text-sm text-cyan-600 dark:text-cyan-400 flex items-center justify-center sm:justify-start gap-1.5"><HeartStethoscopeIcon className="w-4 h-4" />{appt.doctor.specialty}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusChipStyle(appt.status)} mt-2 sm:mt-0`}>
                        {t(appt.status.replace(' ', '').toLowerCase() as any)}
                    </span>
                </div>
                <div className="mt-3 text-sm space-y-2 border-t border-slate-200 dark:border-slate-700 pt-3">
                    <p className="flex items-center gap-2 justify-center sm:justify-start text-slate-900 dark:text-slate-400"><CalendarIcon className="w-4 h-4 text-slate-500" /> {new Date(appt.date).toLocaleDateString()}</p>
                    <p className="flex items-center gap-2 justify-center sm:justify-start text-slate-900 dark:text-slate-400"><ClockIcon className="w-4 h-4 text-slate-500" /> {appt.time}</p>
                    <p className="flex items-center gap-2 justify-center sm:justify-start text-slate-900 dark:text-slate-400"><DollarSignIcon className="w-4 h-4 text-slate-500" /> {appt.cost.toFixed(2)} PLN</p>
                </div>
            </div>
             {appt.status === 'Payment Due' && (
                <div className="flex-shrink-0 flex items-center justify-center sm:justify-end mt-4 sm:mt-0">
                    <button 
                        onClick={() => setSelectedAppointment(appt)}
                        className="w-full sm:w-auto py-2 px-4 border border-yellow-500 rounded-md shadow-sm text-sm font-medium text-yellow-700 dark:text-yellow-200 bg-yellow-500/20 hover:bg-yellow-500/40 transition-all hover:shadow-[0_0_10px_rgba(234,179,8,0.4)]"
                    >
                        {t('payNow')}
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="animate-fade-in h-full flex flex-col w-full max-w-4xl">
            <h2 className="text-3xl font-bold text-cyan-500 dark:text-cyan-300" style={{ textShadow: 'var(--text-glow-cyan)' }}>
                {t('welcomePatient', { name: user?.name || t('patient') })}
            </h2>
            <p className="mt-1 text-slate-900 dark:text-slate-300">{t('portalSubtitle')}</p>
            
            <div className="flex-grow overflow-y-auto pr-2 space-y-8 mt-6">
                <section>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">{t('upcomingAppointments')}</h3>
                    <div className="space-y-4">
                        {upcoming.length > 0 ? (
                            upcoming.map(appt => <AppointmentCard key={appt.id} appt={appt} />)
                        ) : (
                            <p className="text-slate-900 dark:text-slate-500 text-center py-4">{t('noUpcomingAppointments')}</p>
                        )}
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-200 mb-4 pb-2 border-b border-slate-200 dark:border-slate-700">{t('pastAppointments')}</h3>
                    <div className="space-y-4">
                        {past.length > 0 ? (
                             past.map(appt => <AppointmentCard key={appt.id} appt={appt} />)
                        ) : (
                            <p className="text-slate-900 dark:text-slate-500 text-center py-4">{t('noPastAppointments')}</p>
                        )}
                    </div>
                </section>
            </div>
             {selectedAppointment && (
                <PaymentModal 
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                    onConfirm={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default PatientPortalPage;