
import React, { useState, useEffect } from 'react';
import { AppPage, User } from './types';
import * as authService from './services/authService';
import { AuraCareLogo } from './components/icons/AuraCareLogo';
import Chatbot from './components/Chatbot';
import AboutPage from './components/AboutPage';
import HomePage from './components/HomePage';
import IntakePage from './components/IntakePage';
import Footer from './components/Footer';
import AuthModal from './components/LoginPrompt';
import { UserIcon } from './components/icons/UserIcon';

const App: React.FC = () => {
  const [page, setPage] = useState<AppPage>('home');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check for existing user session on initial load
    const existingUser = authService.getCurrentUser();
    if (existingUser) {
      setUser(existingUser);
    }
  }, []);

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    authService.logout(() => {
      setUser(null);
      navigateTo('home'); // Go to home page on logout
    });
  };

  const navigateTo = (targetPage: AppPage) => {
    setPage(targetPage);
  };
  
  const handleStartIntake = () => {
    if (user) {
      navigateTo('intake');
    } else {
      setShowAuthModal(true);
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'home':
        return <HomePage onGetStarted={handleStartIntake} />;
      case 'intake':
        // If user is not logged in, redirect to home which will prompt login if they try again
        return user ? <IntakePage /> : <HomePage onGetStarted={handleStartIntake} />;
      case 'about':
        return <AboutPage onGetStarted={handleStartIntake} />;
      default:
        return <HomePage onGetStarted={handleStartIntake} />;
    }
  };

  const NavLink: React.FC<{ targetPage?: AppPage; onClick?: () => void; children: React.ReactNode; isCurrent: boolean }> = ({ targetPage, onClick, children, isCurrent }) => (
    <button 
      type="button"
      onClick={onClick ? onClick : () => targetPage && navigateTo(targetPage)} 
      className={`text-slate-300 hover:text-cyan-300 transition-colors duration-300 font-medium bg-transparent border-none p-2 rounded-md ${isCurrent ? 'text-cyan-300 bg-cyan-500/10' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen w-full flex flex-col font-sans relative">
      <header className="sticky top-0 z-30 p-4 sm:p-6 lg:p-4 w-full flex items-center justify-between bg-slate-900/50 backdrop-blur-lg border-b border-slate-700/50">
        <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigateTo('home')}
            role="button"
            aria-label="Go to homepage"
        >
            <AuraCareLogo className="w-10 h-10 text-cyan-400 transition-all duration-300 group-hover:text-cyan-300" style={{ filter: `drop-shadow(0 0 10px #06b6d4)` }} />
            <h1 className="ml-3 text-2xl font-bold text-slate-100 transition-all duration-300 group-hover:text-white" style={{ textShadow: 'var(--text-glow-cyan)' }}>
                AuraCare Assistant
            </h1>
        </div>
        <nav className="flex items-center space-x-2 sm:space-x-4">
            <NavLink targetPage="home" isCurrent={page === 'home'}>Home</NavLink>
            <NavLink onClick={handleStartIntake} isCurrent={page === 'intake'}>Start Intake</NavLink>
            <NavLink targetPage="about" isCurrent={page === 'about'}>About Us</NavLink>
             <div className="border-l border-slate-700 h-6 mx-2"></div>
            {user ? (
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-7 h-7 text-slate-400 border-2 border-slate-600 rounded-full p-0.5" />
                      <span className="text-sm text-slate-300 font-medium hidden sm:inline">{user.name}</span>
                    </div>
                    <button onClick={handleLogout} className="text-slate-300 hover:text-red-400 transition-colors text-sm font-medium">Logout</button>
                </div>
            ) : (
                 <button onClick={() => setShowAuthModal(true)} className="text-cyan-300 hover:text-cyan-200 transition-colors text-sm font-semibold bg-cyan-500/10 px-3 py-1.5 rounded-md">
                    Login / Register
                </button>
            )}
        </nav>
      </header>
      
      <main className="flex-grow flex flex-col items-center justify-center p-2 sm:p-4 lg:p-8">
        {renderPage()}
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLoginSuccess={handleLoginSuccess} />}

      <Footer onNavigate={navigateTo} />
      <Chatbot />
    </div>
  );
};

export default App;
