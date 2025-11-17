
import React from 'react';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { UsersIcon } from './icons/UsersIcon';
import { useTranslations } from '../hooks/useTranslations';

interface AboutPageProps {
    onGetStarted: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onGetStarted }) => {
    const { t } = useTranslations();
    const featureCardStyle = "bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-lg p-6 text-center flex flex-col items-center animate-fade-in shadow-md dark:shadow-none";
    const iconContainerStyle = "flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/20 mb-4";
    const iconStyle = "h-6 w-6 text-cyan-500 dark:text-cyan-300";

    return (
        <div className="animate-fade-in h-full flex flex-col w-full max-w-4xl">
            <div className="flex-grow overflow-y-auto pr-2 space-y-8">
                <section className="text-center">
                    <h2 className="text-3xl font-bold text-cyan-500 dark:text-cyan-300" style={{ textShadow: 'var(--text-glow-cyan)' }}>
                        {t('aboutTitle')}
                    </h2>
                    <p className="mt-2 text-slate-900 dark:text-slate-300 max-w-2xl mx-auto">
                        {t('aboutSubtitle')}
                    </p>
                </section>

                <section>
                    <h3 className="text-2xl font-semibold text-center text-slate-900 dark:text-slate-200 mb-6">{t('howItWorks')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className={featureCardStyle} style={{animationDelay: '100ms'}}>
                            <div className={iconContainerStyle}><ClipboardIcon className={iconStyle} /></div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{t('feature1Title')}</h4>
                            <p className="text-sm text-slate-900 dark:text-slate-400 mt-1">{t('feature1Desc')}</p>
                        </div>
                        <div className={featureCardStyle} style={{animationDelay: '200ms'}}>
                            <div className={iconContainerStyle}><SparklesIcon className={iconStyle} /></div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{t('feature2Title')}</h4>
                            <p className="text-sm text-slate-900 dark:text-slate-400 mt-1">{t('feature2Desc')}</p>
                        </div>
                         <div className={featureCardStyle} style={{animationDelay: '300ms'}}>
                            <div className={iconContainerStyle}><UsersIcon className={iconStyle} /></div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-100">{t('feature3Title')}</h4>
                            <p className="text-sm text-slate-900 dark:text-slate-400 mt-1">{t('feature3Desc')}</p>
                        </div>
                    </div>
                </section>
                
                <section className="text-center bg-white dark:bg-slate-800/30 p-6 rounded-lg border border-slate-200 dark:border-slate-700/60">
                     <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-200">{t('ourCommitment')}</h3>
                     <p className="mt-2 text-slate-900 dark:text-slate-400 text-sm max-w-xl mx-auto">
                        {t('commitmentDesc')}
                    </p>
                </section>
            </div>
            <div className="mt-8 flex-shrink-0 text-center">
                <button 
                    onClick={onGetStarted} 
                    className="w-full max-w-xs mx-auto flex justify-center py-3 px-4 border border-cyan-500 rounded-md shadow-sm text-base font-medium text-cyan-900 dark:text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all hover:shadow-[var(--glow-cyan)]"
                >
                    {t('getStarted')}
                </button>
            </div>
        </div>
    );
};

export default AboutPage;