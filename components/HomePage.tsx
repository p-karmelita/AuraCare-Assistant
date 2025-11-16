
import React from 'react';
import StarRating from './StarRating';

interface HomePageProps {
    onGetStarted: () => void;
}

const testimonials = [
    {
        name: 'Alicja Nowak',
        avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
        rating: 5,
        comment: 'Niesamowite, jak szybko i trafnie AuraCare zasugerowało odpowiedniego specjalistę. Cały proces był intuicyjny i bezstresowy. Gorąco polecam!',
    },
    {
        name: 'Marek Wiśniewski',
        avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d',
        rating: 5,
        comment: 'Asystent głosowy to rewolucja! W kilka minut przekazałem wszystkie informacje, bez wypełniania nudnych formularzy. Technologia w służbie pacjenta.',
    },
    {
        name: 'Ewa Zielińska',
        avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d',
        rating: 4,
        comment: 'Aplikacja jest świetnie zaprojektowana i bardzo pomocna. Znalezienie lekarza w okolicy na podstawie objawów zajęło mi chwilę. Drobne sugestie co do interfejsu, ale ogólnie super.',
    },
    {
        name: 'Piotr Szymański',
        avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d',
        rating: 5,
        comment: 'Jako osoba starsza, cenię sobie prostotę. AuraCare jest łatwa w obsłudze, a funkcja analizy symptomów dała mi spokój ducha i wskazała dalsze kroki. Dziękuję!',
    },
     {
        name: 'Karolina Jankowska',
        avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026708d',
        rating: 5,
        comment: 'Cały proces, od wprowadzenia danych po znalezienie kliniki, był płynny i zautomatyzowany. Oszczędziło mi to mnóstwo czasu i nerwów. Fantastyczne narzędzie!',
    }
];

const HomePage: React.FC<HomePageProps> = ({ onGetStarted }) => {
    return (
        <div className="animate-fade-in flex flex-col items-center justify-center w-full">
            <div className="text-center w-full max-w-3xl">
                <div className="relative">
                    <div className="absolute -inset-2 bg-cyan-500 rounded-full blur-3xl opacity-20 animate-pulse-slow"></div>
                    <h1 
                        className="relative text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-100 tracking-tight"
                        style={{ textShadow: '0 0 25px rgba(165, 243, 252, 0.6), 0 0 10px rgba(6, 182, 212, 0.8)' }}
                    >
                        A New Era of Patient Care
                    </h1>
                </div>

                <p className="mt-6 text-lg text-slate-300 max-w-2xl mx-auto">
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

            <section className="mt-20 w-full max-w-6xl">
                <h2 className="text-3xl font-bold text-center text-cyan-300 mb-8" style={{ textShadow: 'var(--text-glow-cyan)' }}>
                    What Our Patients Say
                </h2>
                {/* Fix: Replaced inline style with a class and a style tag to hide the scrollbar across browsers, resolving a TypeScript error. */}
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
                        <div key={index} className="flex-shrink-0 w-80 bg-slate-800/40 border border-slate-700/60 rounded-lg p-6 flex flex-col" style={{ minWidth: '320px' }}>
                            <div className="flex items-center mb-4">
                                <img src={testimonial.avatarUrl} alt={testimonial.name} className="w-12 h-12 rounded-full border-2 border-slate-600" />
                                <div className="ml-4">
                                    <h4 className="font-bold text-slate-100">{testimonial.name}</h4>
                                    <StarRating rating={testimonial.rating} />
                                </div>
                            </div>
                            <p className="text-sm text-slate-400 italic">"{testimonial.comment}"</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default HomePage;
