
import React, { useState } from 'react';
import { Appointment } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import LoadingSpinner from './LoadingSpinner';
import { useTranslations } from '../hooks/useTranslations';

interface PaymentModalProps {
    appointment: Appointment;
    onClose: () => void;
    onConfirm: (appointmentId: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ appointment, onClose, onConfirm }) => {
    const { t } = useTranslations();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleConfirmPayment = () => {
        setIsProcessing(true);
        // Simulate API call
        setTimeout(() => {
            onConfirm(appointment.id);
            setIsProcessing(false);
        }, 2000);
    };
    
    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white/5 dark:bg-white/5 border border-slate-400 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 dark:focus:bg-white/10 sm:text-sm transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-500";
    const labelStyle = "block text-xs font-medium text-slate-600 dark:text-slate-400 text-left";

    return (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xl flex items-center justify-center z-50 p-4 animate-fade-in" aria-modal="true">
            <div className="relative bg-white/80 dark:bg-black/40 border border-cyan-400/30 dark:border-cyan-400/50 w-full max-w-md rounded-2xl shadow-2xl p-8 dark:shadow-[var(--glow-cyan)]">
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 mb-3">
                        <CreditCardIcon className="h-6 w-6 text-cyan-500 dark:text-cyan-300" aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('confirmPayment')}</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
                        {t('paymentSubtitle', { doctorName: appointment.doctor.name })}
                    </p>
                </div>
                
                <div className="mt-4 text-left bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/60 rounded-lg p-4 text-sm">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-500 dark:text-slate-400">{t('service')}:</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{t('consultation')} - {appointment.doctor.specialty}</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                        <span className="text-slate-600 dark:text-slate-400 text-lg">{t('totalAmount')}:</span>
                        <span className="font-bold text-cyan-600 dark:text-cyan-300 text-lg">{appointment.cost.toFixed(2)} PLN</span>
                    </div>
                </div>

                {/* This is a mock form for demonstration purposes */}
                <div className="mt-6 space-y-3">
                     <div>
                        <label htmlFor="cardNumber" className={labelStyle}>{t('cardNumber')}</label>
                        <input type="text" name="cardNumber" id="cardNumber" className={inputStyle} placeholder="**** **** **** 1234" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="expiry" className={labelStyle}>{t('expiryDate')}</label>
                            <input type="text" name="expiry" id="expiry" className={inputStyle} placeholder={t('expiryPlaceholder')} />
                        </div>
                         <div>
                            <label htmlFor="cvc" className={labelStyle}>{t('cvc')}</label>
                            <input type="text" name="cvc" id="cvc" className={inputStyle} placeholder="123" />
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button 
                        onClick={handleConfirmPayment}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center py-3 px-4 border border-cyan-500 rounded-md shadow-sm text-base font-medium text-cyan-700 dark:text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all hover:shadow-[var(--glow-cyan)] disabled:bg-slate-700 disabled:cursor-not-allowed"
                    >
                        {isProcessing ? (
                            <>
                                <LoadingSpinner />
                                <span className="ml-2">{t('processing')}...</span>
                            </>
                        ) : (
                            `${t('pay')} ${appointment.cost.toFixed(2)} PLN`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
