
import React, { useEffect } from 'react';
import * as authService from '../services/authService';
import { User } from '../types';
import { XMarkIcon } from './icons/XMarkIcon';
import { GoogleIcon } from './icons/GoogleIcon';

interface LoginPromptProps {
    onClose: () => void;
    onLoginSuccess: (user: User) => void;
}

const LoginPrompt: React.FC<LoginPromptProps> = ({ onClose, onLoginSuccess }) => {
    
    useEffect(() => {
        // We re-initialize here to ensure the callback is fresh,
        // and tell it to render the button in our modal.
        authService.initGoogleAuth(onLoginSuccess);
        
        // This renders the Google Sign-In button into the div with id 'google-signin-button'
        if (typeof window.google !== 'undefined') {
            window.google.accounts.id.renderButton(
                document.getElementById('google-signin-button')!,
                { theme: 'outline', size: 'large', type: 'standard', text: 'signin_with' }
            );
            window.google.accounts.id.prompt(); // Also immediately prompt the user
        }
    }, [onLoginSuccess]);

    return (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xl flex items-center justify-center z-50 p-4 animate-fade-in" aria-modal="true">
            <div className="relative bg-black/40 border border-cyan-400/50 w-full max-w-md rounded-2xl shadow-2xl p-8 text-center" style={{boxShadow: 'var(--glow-cyan)'}}>
                <button onClick={onClose} className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-700">
                    <XMarkIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-100">Access Required</h2>
                <p className="mt-2 text-slate-400">
                    Please sign in to continue with the patient intake process.
                </p>
                <div className="mt-6 flex justify-center">
                    {/* The Google button will be rendered here */}
                    <div id="google-signin-button"></div>
                </div>
                 <p className="mt-4 text-xs text-slate-500">
                    We use Google for secure and easy sign-in. We never post to your account.
                </p>
            </div>
        </div>
    );
};

export default LoginPrompt;
