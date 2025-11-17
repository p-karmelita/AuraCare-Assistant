

import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import { BayerLogo } from './icons/partner-logos/BayerLogo';
import { GedeonRichterLogo } from './icons/partner-logos/GedeonRichterLogo';
import { NovartisLogo } from './icons/partner-logos/NovartisLogo';
import { PfizerLogo } from './icons/partner-logos/PfizerLogo';
import { PolpharmaLogo } from './icons/partner-logos/PolpharmaLogo';
import { RocheLogo } from './icons/partner-logos/RocheLogo';
import { SanofiLogo } from './icons/partner-logos/SanofiLogo';
import { ZdrovitLogo } from './icons/partner-logos/ZdrovitLogo';
import { useTranslations } from '../hooks/useTranslations';
import { getMedicalEvents } from '../services/geminiService';
import { MedicalEvent, GroundingSource } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { CalendarDaysIcon } from './icons/CalendarDaysIcon';
import { MapPinIcon } from './icons/MapPinIcon';

interface HomePageProps {
    onGetStarted: () => void;
}

const placeholderImages = [
    'https://images.pexels.com/photos/3992933/pexels-photo-3992933.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
];

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
    const { t } = useTranslations();
    const [events, setEvents] = useState<MedicalEvent[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventsError, setEventsError] = useState<string | null>(null);
    const [eventSources, setEventSources] = useState<GroundingSource[]>([]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setEventsLoading(true);
                setEventsError(null);
                const { events: fetchedEvents, sources } = await getMedicalEvents();
                setEvents(fetchedEvents.slice(0, 3)); // Ensure only 3 events are shown
                setEventSources(sources);
            } catch (error) {
                console.error(error);
                setEventsError(t('errorEvents'));
            } finally {
                setEventsLoading(false);
            }
        };
        fetchEvents();
    }, [t]);


    const testimonials = [
        {
            name: 'Alice Nowak',
            avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
            rating: 5,
            comment: t('testimonial1'),
        },
        {
            name: 'Mark Wisniewski',
            avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
            rating: 5,
            comment: t('testimonial2'),
        },
        {
            name: 'Eve Zielinska',
            avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
            rating: 4,
            comment: t('testimonial3'),
        },
        {
            name: 'Peter Szymanski',
            avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
            rating: 5,
            comment: t('testimonial4'),
        },
         {
            name: 'Caroline Jankowska',
            avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026708d',
            rating: 5,
            comment: t('testimonial5'),
        }
    ];

    const partners = [
        { name: 'Zdrovit', Logo: ZdrovitLogo },
        { name: 'Pfizer', Logo: PfizerLogo },
        { name: 'Bayer', Logo: BayerLogo },
        { name: 'Roche', Logo: RocheLogo },
        { name: 'Polpharma', Logo: PolpharmaLogo },
        { name: 'Sanofi', Logo: SanofiLogo },
        { name: 'Gedeon Richter', Logo: GedeonRichterLogo },
        { name: 'Novartis', Logo: NovartisLogo }
    ];

    return (
        <div className="animate-fade-in flex flex-col items-center justify-center w-full">
            <div className="text-center w-full max-w-3xl">
                <div className="relative">
                    <div className="absolute -inset-2 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
                    <h1 
                        className="relative text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight"
                        style={{ textShadow: '0 0 25px rgba(165, 243, 252, 0.6), 0 0 10px rgba(6, 182, 212, 0.8)' }}
                    >
                        {t('homeTitle')}
                    </h1>
                </div>

                <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    {t('homeSubtitle')}
                </p>

                <div className="mt-10">
                    <button 
                        onClick={onGetStarted} 
                        className="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-cyan-600/80 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 hover:bg-cyan-500/80 hover:shadow-[var(--glow-cyan)] animate-pulse-border"
                        role="button"
                    >
                        {t('getStartedNow')}
                    </button>
                </div>
            </div>

            <section className="mt-20 w-full max-w-6xl">
                <h2 className="text-3xl font-bold text-center text-cyan-500 dark:text-cyan-300 mb-8" style={{ textShadow: 'var(--text-glow-cyan)' }}>
                    {t('whatPatientsSay')}
                </h2>
                <div className="flex space-x-6 pb-6 overflow-x-auto testimonial-scroll">
                    <style>{`
                        .testimonial-scroll {
                            scrollbar-width: none;
                            -ms-overflow-style: none;
                        }
                        .testimonial-scroll::-webkit-scrollbar {
                            display: none;
                        }
                    `}</style>
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="flex-shrink-0 w-80 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 rounded-lg p-6 flex flex-col shadow-md dark:shadow-none" style={{ minWidth: '320px' }}>
                            <div className="flex items-center mb-4">
                                <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                                <div className="ml-4">
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{testimonial.name}</h4>
                                    <StarRating rating={testimonial.rating} />
                                </div>
                            </div>
                            <p className="text-sm text-slate-900 dark:text-slate-300 italic">"{testimonial.comment}"</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-20 w-full">
                <h2 className="text-3xl font-bold text-center text-cyan-500 dark:text-cyan-300 mb-12" style={{ textShadow: 'var(--text-glow-cyan)' }}>
                    {t('trustedBy')}
                </h2>
                <div 
                    className="relative w-full overflow-hidden"
                    style={{ maskImage: "linear-gradient(to right, transparent, white 10%, white 90%, transparent)" }}
                >
                    <div className="flex animate-infinite-scroll">
                        {partners.map(({ name, Logo }, index) => (
                            <div key={`${name}-${index}`} className="flex-shrink-0 w-48 flex items-center justify-center mx-8 h-16" title={name}>
                                <Logo className="h-8 text-slate-600 dark:text-slate-400 transition-colors duration-300 hover:text-slate-800 dark:hover:text-slate-200" />
                            </div>
                        ))}
                        {partners.map(({ name, Logo }, index) => (
                            <div key={`duplicate-${name}-${index}`} className="flex-shrink-0 w-48 flex items-center justify-center mx-8 h-16" title={name} aria-hidden="true">
                                 <Logo className="h-8 text-slate-600 dark:text-slate-400 transition-colors duration-300 hover:text-slate-800 dark:hover:text-slate-200" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mt-20 w-full max-w-6xl">
                <h2 className="text-3xl font-bold text-center text-cyan-500 dark:text-cyan-300 mb-12" style={{ textShadow: 'var(--text-glow-cyan)' }}>
                    {t('latestEventsTitle')}
                </h2>
                {eventsLoading && (
                    <div className="flex flex-col items-center justify-center text-center">
                        <LoadingSpinner />
                        <p className="mt-4 text-slate-600 dark:text-slate-400">{t('loadingEvents')}</p>
                    </div>
                )}
                {eventsError && (
                     <div className="text-center text-red-500 dark:text-red-400">
                        <p>{eventsError}</p>
                    </div>
                )}
                {!eventsLoading && !eventsError && events.length > 0 && (
                    <div className="animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {events.map((event, index) => (
                                <div key={index} className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-cyan-400/30 dark:border-cyan-400/50 rounded-lg shadow-lg dark:shadow-[0_0_20px_rgba(6,182,212,0.2)] flex flex-col transition-all duration-300 hover:shadow-cyan-400/30 hover:scale-[1.02] overflow-hidden">
                                    <img src={placeholderImages[index % placeholderImages.length]} alt={event.name} className="w-full h-40 object-cover" />
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{event.name}</h3>
                                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-1">
                                            <CalendarDaysIcon className="w-4 h-4 rtl:ml-2 ltr:mr-2 flex-shrink-0" />
                                            <span>{event.date}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-4">
                                            <MapPinIcon className="w-4 h-4 rtl:ml-2 ltr:mr-2 flex-shrink-0" />
                                            <span>{event.location}</span>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 flex-grow mb-4">{event.description}</p>
                                        <a 
                                            href={event.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="mt-auto text-sm font-semibold text-cyan-600 dark:text-cyan-300 hover:text-cyan-500 dark:hover:text-cyan-200 transition-colors self-start"
                                        >
                                            {t('learnMore')} &rarr;
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                         {eventSources.length > 0 && (
                            <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
                                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">{t('eventSources')}</h4>
                                <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                                    {eventSources.map((source, index) => (
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
                )}
            </section>
        </div>
    );
};

export default HomePage;