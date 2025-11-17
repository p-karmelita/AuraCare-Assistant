
import React, { useState, useEffect } from 'react';
import { AppPage, User } from './types';
import * as authService from './services/authService';
import { AuraCareLogo } from './components/icons/AuraCareLogo';
import Chatbot from './components/Chatbot';
import AboutPage from './components/AboutPage';
import HomePage from './components/HomePage';
import IntakePage from './components/IntakePage';
import PatientPortalPage from './components/PatientPortalPage';
import BlogPage from './components/BlogPage';
import BlogPostPage from './components/BlogPostPage';
import Footer from './components/Footer';
import AuthModal from './components/LoginPrompt';
import { UserIcon } from './components/icons/UserIcon';
import { useTheme } from './hooks/useTheme';
import ThemeToggleButton from './components/ThemeToggleButton';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslations } from './hooks/useTranslations';

const App: React.FC = () => {
  const [page, setPage] = useState<AppPage>('home');
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentBlogPostId, setCurrentBlogPostId] = useState<string | null>(null);
  const { theme } = useTheme();
  const { t } = useTranslations();

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  useEffect(() => {
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
      navigateTo('home');
    });
  };

  const navigateTo = (targetPage: AppPage) => {
    setPage(targetPage);
    setCurrentBlogPostId(null); // Reset blog post view on any main navigation
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
        return user ? <IntakePage /> : <HomePage onGetStarted={handleStartIntake} />;
      case 'about':
        return <AboutPage onGetStarted={handleStartIntake} />;
      case 'patient':
        return user ? <PatientPortalPage /> : <HomePage onGetStarted={handleStartIntake} />;
      case 'blog':
        return currentBlogPostId ? 
            <BlogPostPage postId={currentBlogPostId} onBack={() => setCurrentBlogPostId(null)} /> :
            <BlogPage onSelectPost={(id) => setCurrentBlogPostId(id)} />;
      default:
        return <HomePage onGetStarted={handleStartIntake} />;
    }
  };

  const NavLink: React.FC<{ targetPage?: AppPage; onClick?: () => void; children: React.ReactNode; isCurrent: boolean }> = ({ targetPage, onClick, children, isCurrent }) => (
    <button 
      type="button"
      onClick={onClick ? onClick : () => targetPage && navigateTo(targetPage)} 
      className={`text-slate-300 dark:text-slate-300 light:text-slate-600 hover:text-cyan-400 dark:hover:text-cyan-300 transition-colors duration-300 font-medium bg-transparent border-none p-2 rounded-md ${isCurrent ? 'text-cyan-400 dark:text-cyan-300 bg-cyan-500/10' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="min-h-screen w-full flex flex-col font-sans relative bg-slate-50 dark:bg-transparent">
      <header className="sticky top-0 z-30 p-4 sm:p-6 lg:p-4 w-full flex items-center justify-between bg-white/80 dark:bg-slate-900/50 backdrop-blur-lg border-b border-slate-300 dark:border-slate-700/50">
        <div 
            className="flex items-center cursor-pointer group"
            onClick={() => navigateTo('home')}
            role="button"
            aria-label={t('goToHomepage')}
        >
            <AuraCareLogo className="w-10 h-10 text-cyan-500 dark:text-cyan-400 transition-all duration-300 group-hover:text-cyan-400 dark:group-hover:text-cyan-300" style={{ filter: `drop-shadow(0 0 10px #06b6d4)` }} />
            <h1 className="ml-3 text-2xl font-bold text-slate-800 dark:text-slate-100 transition-all duration-300 group-hover:text-black dark:group-hover:text-white" style={{ textShadow: 'var(--text-glow-cyan)' }}>
                AuraCare Assistant
            </h1>
        </div>
        <nav className="flex items-center space-x-1 sm:space-x-2">
            <NavLink targetPage="home" isCurrent={page === 'home'}>{t('home')}</NavLink>
            <NavLink onClick={handleStartIntake} isCurrent={page === 'intake'}>{t('startIntake')}</NavLink>
            <NavLink targetPage="about" isCurrent={page === 'about'}>{t('aboutUs')}</NavLink>
            <NavLink targetPage="blog" isCurrent={page === 'blog'}>{t('blog')}</NavLink>
             <div className="border-l border-slate-300 dark:border-slate-700 h-6 mx-1 sm:mx-2"></div>
            {user ? (
                <div className="flex items-center space-x-2 sm:space-x-3">
                    <NavLink targetPage="patient" isCurrent={page === 'patient'}>{t('myPortal')}</NavLink>
                    <div className="flex items-center space-x-2">
                      <UserIcon className="w-7 h-7 text-slate-500 dark:text-slate-400 border-2 border-slate-400 dark:border-slate-600 rounded-full p-0.5" />
                      <span className="text-sm text-slate-600 dark:text-slate-300 font-medium hidden sm:inline">{user.name}</span>
                    </div>
                    <button onClick={handleLogout} className="text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm font-medium">{t('logout')}</button>
                </div>
            ) : (
                 <button onClick={() => setShowAuthModal(true)} className="text-cyan-600 dark:text-cyan-300 hover:text-cyan-500 dark:hover:text-cyan-200 transition-colors text-sm font-semibold bg-cyan-500/10 px-3 py-1.5 rounded-md">
                    {t('loginRegister')}
                </button>
            )}
            <div className="border-l border-slate-300 dark:border-slate-700 h-6 mx-1 sm:mx-2"></div>
            <LanguageSwitcher />
            <ThemeToggleButton />
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
