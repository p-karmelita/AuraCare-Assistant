
import React, { useState } from 'react';
import * as authService from '../services/authService';
import { User } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { useTranslations } from '../hooks/useTranslations';

interface AuthModalProps {
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

const LoginPrompt: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
    const { t } = useTranslations();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            let user: User | null;
            if (isRegistering) {
                user = authService.register(email, password);
            } else {
                user = authService.login(email, password);
            }
            if (user) {
                onLoginSuccess(user);
            }
        } catch (err: any) {
            if (err.message.includes("already exists")) {
                 setError(t('errorUserExists'));
            } else if (err.message.includes("Invalid")) {
                 setError(t('errorInvalidCredentials'));
            } else {
                 setError(err.message);
            }
        }
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white/5 dark:bg-white/5 border border-slate-400 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 dark:focus:bg-white/10 sm:text-sm transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-500";
    const labelStyle = "block text-xs font-medium text-slate-600 dark:text-slate-400 text-left";

    return (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xl flex items-center justify-center z-50 p-4 animate-fade-in" aria-modal="true">
            <div className="relative bg-white/80 dark:bg-black/40 border border-cyan-400/30 dark:border-cyan-400/50 w-full max-w-sm rounded-2xl shadow-2xl p-8 text-center dark:shadow-[var(--glow-cyan)]">
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{isRegistering ? t('createAccount') : t('signIn')}</h2>
                <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">
                    {isRegistering ? t('joinAuraCare') : t('signInToContinue')}
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div>
                        <label htmlFor="email" className={labelStyle}>{t('email')}</label>
                        <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputStyle} placeholder="you@example.com" />
                    </div>
                    <div>
                        <label htmlFor="password" className={labelStyle}>{t('password')}</label>
                        <input type="password" name="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputStyle} placeholder="••••••••" />
                    </div>
                    {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
                    <div className="pt-2">
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-cyan-500 rounded-md shadow-sm text-sm font-medium text-cyan-700 dark:text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all hover:shadow-[var(--glow-cyan)]">
                            {isRegistering ? t('register') : t('signIn')}
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-sm">
                    <button onClick={() => { setIsRegistering(!isRegistering); setError(null); }} className="font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300">
                        {isRegistering ? t('alreadyHaveAccount') : t('dontHaveAccount')}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginPrompt;
