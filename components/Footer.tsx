
import React, { useState } from 'react';
import { AppPage } from '../types';
import { TwitterIcon } from './icons/TwitterIcon';
import { LinkedInIcon } from './icons/LinkedInIcon';
import { FacebookIcon } from './icons/FacebookIcon';

interface FooterProps {
    onNavigate: (page: AppPage) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically integrate with an email service
        console.log(`Subscribing ${email}`);
        setSubscribed(true);
        setEmail('');
        setTimeout(() => setSubscribed(false), 3000); // Reset after 3s
    };
    
    const NavLink: React.FC<{ targetPage: AppPage; children: React.ReactNode }> = ({ targetPage, children }) => (
        <li>
            <button 
                onClick={() => onNavigate(targetPage)}
                className="text-slate-400 hover:text-cyan-300 transition-colors duration-200"
            >
                {children}
            </button>
        </li>
    );

    return (
        <footer className="w-full bg-slate-900/50 backdrop-blur-lg border-t border-slate-700/50 text-slate-400 p-8 z-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* About Section */}
                <div className="md:col-span-2">
                    <h3 className="text-lg font-bold text-cyan-300">AuraCare Assistant</h3>
                    <p className="mt-2 text-sm">
                        Streamlining healthcare administration with the power of AI to create a smoother, more human experience for patients and providers.
                    </p>
                    <div className="flex space-x-4 mt-4">
                        <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors"><TwitterIcon className="w-6 h-6" /></a>
                        <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors"><LinkedInIcon className="w-6 h-6" /></a>
                        <a href="#" className="text-slate-400 hover:text-cyan-400 transition-colors"><FacebookIcon className="w-6 h-6" /></a>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-semibold text-slate-200">Quick Links</h4>
                    <ul className="mt-2 space-y-2 text-sm">
                        <NavLink targetPage="home">Home</NavLink>
                        <NavLink targetPage="intake">Start Intake</NavLink>
                        <NavLink targetPage="about">About Us</NavLink>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="font-semibold text-slate-200">Join Our Newsletter</h4>
                    <p className="mt-2 text-sm">Get the latest updates on our platform and AI in healthcare.</p>
                    <form onSubmit={handleSubscribe} className="mt-3">
                        <div className="flex items-center gap-2">
                           <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="flex-grow w-full px-3 py-2 bg-white/5 border border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm text-slate-200 placeholder:text-slate-500"
                            required
                           />
                           <button type="submit" className="px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm font-semibold hover:bg-cyan-500 transition-colors">Go</button>
                        </div>
                         {subscribed && <p className="text-xs text-green-400 mt-2">Thank you for subscribing!</p>}
                    </form>
                </div>
            </div>
            <div className="mt-8 pt-4 border-t border-slate-700/50 text-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} AuraCare. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
