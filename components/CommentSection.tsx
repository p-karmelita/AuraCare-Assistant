
import React, { useState, useEffect } from 'react';
import { getCommentsByPostId, addComment } from '../services/blogService';
import { Comment } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import LoadingSpinner from './LoadingSpinner';

interface CommentSectionProps {
    postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const { t } = useTranslations();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState({ author: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            const fetchedComments = await getCommentsByPostId(postId);
            setComments(fetchedComments);
            setLoading(false);
        };
        fetchComments();
    }, [postId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewComment(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.author.trim() || !newComment.text.trim()) return;

        setIsSubmitting(true);
        const addedComment = await addComment(postId, newComment);
        setComments(prev => [...prev, addedComment]);
        setNewComment({ author: '', text: '' });
        setIsSubmitting(false);
    };

    const inputStyle = "mt-1 block w-full px-3 py-2 bg-white/5 dark:bg-white/5 border border-slate-400 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 dark:focus:bg-white/10 sm:text-sm transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-500";
    const labelStyle = "block text-xs font-medium text-slate-600 dark:text-slate-400";


    return (
        <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-200 mb-6">{t('comments')} ({comments.length})</h3>
            
            {loading ? (
                <LoadingSpinner />
            ) : (
                <div className="space-y-6">
                    {comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-4">
                            <img src={comment.avatarUrl} alt={comment.author} className="w-10 h-10 rounded-full" />
                            <div className="flex-grow">
                                <div className="flex items-baseline space-x-2">
                                    <p className="font-semibold text-slate-800 dark:text-slate-100">{comment.author}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(comment.date).toLocaleDateString()}</p>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 mt-1">{comment.text}</p>
                            </div>
                        </div>
                    ))}
                    {comments.length === 0 && <p className="text-slate-500 dark:text-slate-400">{t('noComments') || 'No comments yet. Be the first to share your thoughts!'}</p>}
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-300 dark:border-slate-700">
                <h4 className="text-xl font-semibold text-slate-900 dark:text-slate-200 mb-4">{t('leaveComment')}</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="author" className={labelStyle}>{t('yourName')}</label>
                        <input type="text" id="author" name="author" value={newComment.author} onChange={handleInputChange} className={inputStyle} required />
                    </div>
                    <div>
                        <label htmlFor="text" className={labelStyle}>{t('yourComment')}</label>
                        <textarea id="text" name="text" rows={4} value={newComment.text} onChange={handleInputChange} className={inputStyle} required />
                    </div>
                    <div className="text-right">
                        <button type="submit" disabled={isSubmitting} className="inline-flex justify-center py-2 px-6 border border-cyan-500 rounded-md shadow-sm text-sm font-medium text-cyan-700 dark:text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500 transition-all disabled:opacity-50">
                            {isSubmitting ? t('submitting') || 'Submitting...' : t('submitComment')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentSection;
