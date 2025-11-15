
import React from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { UsersIcon } from './icons/UsersIcon';

interface AboutPageProps {
    onGetStarted: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onGetStarted }) => {
    const featureCardStyle = "bg-slate-800/40 border border-slate-700/60 rounded-lg p-6 text-center flex flex-col items-center animate-fade-in";
    const iconContainerStyle = "flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 mb-4";
    const iconStyle = "h-6 w-6 text-cyan-300";

    return (
        <div className="animate-fade-in h-full flex flex-col text-slate-300 w-full max-w-4xl">
            <div className="flex-grow overflow-y-auto pr-2 space-y-8">
                <section className="text-center">
                    <h2 className="text-3xl font-bold text-cyan-300" style={{ textShadow: 'var(--text-glow-cyan)' }}>
                        Humanizing Healthcare Administration
                    </h2>
                    <p className="mt-2 text-slate-400 max-w-2xl mx-auto">
                        AuraCare Assistant is an AI-powered platform designed to streamline the patient experience, from intake to appointment setting, making healthcare more accessible and efficient for everyone.
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-semibold text-center text-slate-200 mb-6">How It Works</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={featureCardStyle} style={{animationDelay: '100ms'}}>
                            <div className={iconContainerStyle}><ClipboardIcon className={iconStyle} /></div>
                            <h4 className="font-bold text-slate-100">1. Smart Intake</h4>
                            <p className="text-sm text-slate-400 mt-1">Provide your details and symptoms through our simple, secure form or our intuitive voice assistant.</p>
                        </div>
                        <div className={featureCardStyle} style={{animationDelay: '200ms'}}>
                            <div className={iconContainerStyle}><SparklesIcon className={iconStyle} /></div>
                            <h4 className="font-bold text-slate-100">2. AI Analysis</h4>
                            <p className="text-sm text-slate-400 mt-1">Our advanced AI analyzes your information to recommend the most appropriate medical specialty for your needs.</p>
                        </div>
                         <div className={featureCardStyle} style={{animationDelay: '300ms'}}>
                            <div className={iconContainerStyle}><UsersIcon className={iconStyle} /></div>
                            <h4 className="font-bold text-slate-100">3. Find a Doctor</h4>
                            <p className="text-sm text-slate-400 mt-1">We use Google Maps to find real, highly-rated specialists near you, complete with bios and clinic details.</p>
                        </div>
                    </div>
                </section>
                
                <section className="text-center bg-slate-800/30 p-6 rounded-lg border border-slate-700/60">
                     <h3 className="text-lg font-semibold text-slate-200">Our Commitment to You</h3>
                     <p className="mt-2 text-slate-400 text-sm max-w-xl mx-auto">
                        We leverage cutting-edge AI to assist, not replace, the crucial role of healthcare professionals. Your data is handled with the utmost security and privacy. Our goal is to empower you to find the care you need, quickly and confidently.
                    </p>
                </section>
            </div>
            <div className="mt-8 flex-shrink-0 text-center">
                <button 
                    onClick={onGetStarted} 
                    className="w-full max-w-xs mx-auto flex justify-center py-3 px-4 border border-cyan-500 rounded-md shadow-sm text-base font-medium text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all hover:shadow-[var(--glow-cyan)]"
                >
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default AboutPage;