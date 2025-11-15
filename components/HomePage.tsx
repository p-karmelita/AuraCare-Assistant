
import React from 'react';

interface HomePageProps {
    onGetStarted: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
    return (
        <div className="animate-fade-in text-center flex flex-col items-center justify-center w-full max-w-3xl">
            <div className="relative">
                <div className="absolute -inset-2 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
                <h1 
                    className="relative text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-100 tracking-tight"
                    style={{ textShadow: '0 0 25px rgba(165, 243, 252, 0.6), 0 0 10px rgba(6, 182, 212, 0.8)' }}
                >
                    A New Era of Patient Care
                </h1>
            </div>

            <p className="mt-6 text-lg text-slate-300 max-w-2xl">
                AuraCare Assistant simplifies your healthcare journey. Our intelligent platform streamlines intake, finds the right specialist, and automates administrative tasks, so you can focus on what matters most—your health.
            </p>

            <div className="mt-10">
                <button 
                    onClick={onGetStarted} 
                    className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-cyan-600/80 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 hover:bg-cyan-500/80 hover:shadow-[var(--glow-cyan)] animate-pulse-border"
                    role="button"
                >
                    Get Started Now
                </button>
            </div>
        </div>
    );
};

export default HomePage;
