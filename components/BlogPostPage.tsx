
import React, { useState, useEffect } from 'react';
import { getBlogPostById } from '../services/blogService';
import { BlogPost } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import LoadingSpinner from './LoadingSpinner';
import CommentSection from './CommentSection';

interface BlogPostPageProps {
    postId: string;
    onBack: () => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ postId, onBack }) => {
    const { t } = useTranslations();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const fetchedPost = await getBlogPostById(postId);
                if (fetchedPost) {
                    setPost(fetchedPost);
                } else {
                    setError('Blog post not found.');
                }
            } catch (err) {
                setError('Failed to load blog post.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    if (loading) {
        return <div className="flex-grow flex items-center justify-center"><LoadingSpinner /></div>;
    }

    if (error || !post) {
        return <p className="text-center text-red-500">{error || 'Post not available.'}</p>;
    }

    return (
        <div className="animate-fade-in h-full w-full max-w-4xl flex flex-col">
            <div className="flex-shrink-0 mb-6">
                <button onClick={onBack} className="text-sm font-semibold text-cyan-600 dark:text-cyan-300 hover:text-cyan-500 dark:hover:text-cyan-200 transition-colors">
                    &larr; {t('backToBlog')}
                </button>
            </div>
            
            <div className="flex-grow overflow-y-auto pr-2 bg-white/60 dark:bg-black/20 backdrop-blur-lg border border-slate-200 dark:border-slate-700/50 rounded-lg">
                <img src={post.imageUrl} alt={t(post.titleKey)} className="w-full h-64 object-cover rounded-t-lg" />
                <article className="p-8">
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">{t(post.titleKey)}</h1>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        {t('postedBy', { author: post.author, date: new Date(post.date).toLocaleDateString() })}
                    </p>
                    <div 
                        className="prose dark:prose-invert prose-slate max-w-none text-slate-800 dark:text-slate-300 whitespace-pre-line"
                    >
                        {t(post.contentKey)}
                    </div>
                </article>
                 <div className="p-8 mt-8 border-t border-slate-300 dark:border-slate-700">
                    <CommentSection postId={post.id} />
                </div>
            </div>
        </div>
    );
};

export default BlogPostPage;
