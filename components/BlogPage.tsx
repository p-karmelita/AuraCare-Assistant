
import React, { useState, useEffect } from 'react';
import { getBlogPosts } from '../services/blogService';
import { BlogPost } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import LoadingSpinner from './LoadingSpinner';

interface BlogPageProps {
    onSelectPost: (postId: string) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onSelectPost }) => {
    const { t } = useTranslations();
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const fetchedPosts = await getBlogPosts();
                setPosts(fetchedPosts);
            } catch (err) {
                setError('Failed to load blog posts.');
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="animate-fade-in h-full flex flex-col w-full max-w-5xl">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold text-cyan-500 dark:text-cyan-300" style={{ textShadow: 'var(--text-glow-cyan)' }}>
                    {t('blogTitle')}
                </h1>
                <p className="mt-2 text-slate-800 dark:text-slate-300 max-w-2xl mx-auto">
                    {t('blogSubtitle')}
                </p>
            </header>
            
            {loading && (
                <div className="flex-grow flex items-center justify-center">
                    <LoadingSpinner />
                </div>
            )}

            {error && <p className="text-center text-red-500">{error}</p>}

            {!loading && !error && (
                <main className="flex-grow overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                             <div 
                                key={post.id} 
                                className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-cyan-400/30 dark:border-cyan-400/50 rounded-lg shadow-lg dark:shadow-[0_0_20px_rgba(6,182,212,0.2)] flex flex-col overflow-hidden transition-all duration-300 hover:shadow-cyan-400/30 hover:scale-[1.03]"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <img src={post.imageUrl} alt={t(post.titleKey)} className="w-full h-48 object-cover" />
                                <div className="p-6 flex flex-col flex-grow">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t(post.titleKey)}</h2>
                                    <p className="text-sm text-slate-700 dark:text-slate-400 flex-grow mb-4">{t(post.summaryKey)}</p>
                                    <button 
                                        onClick={() => onSelectPost(post.id)}
                                        className="mt-auto text-sm font-semibold text-cyan-600 dark:text-cyan-300 hover:text-cyan-500 dark:hover:text-cyan-200 transition-colors self-start"
                                    >
                                        {t('readMore')} &rarr;
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            )}
        </div>
    );
};

export default BlogPage;
