
import { BlogPost, Comment } from '../types';

const posts: BlogPost[] = [
    {
        id: '1',
        titleKey: 'blogTitle1',
        summaryKey: 'blogSummary1',
        contentKey: 'blogContent1',
        imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        author: 'Dr. Emily Carter',
        date: '2024-07-15',
    },
    {
        id: '2',
        titleKey: 'blogTitle2',
        summaryKey: 'blogSummary2',
        contentKey: 'blogContent2',
        imageUrl: 'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        author: 'John Matthews',
        date: '2024-07-10',
    },
    {
        id: '3',
        titleKey: 'blogTitle3',
        summaryKey: 'blogSummary3',
        contentKey: 'blogContent3',
        imageUrl: 'https://images.pexels.com/photos/935756/pexels-photo-935756.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        author: 'Dr. Sarah Jenkins',
        date: '2024-07-05',
    },
];

const comments: { [postId: string]: Comment[] } = {
    '1': [
        { id: 'c1-1', author: 'Alex', avatarUrl: 'https://i.pravatar.cc/150?u=alex', text: 'Great article! Very informative and easy to understand.', date: '2024-07-16' },
        { id: 'c1-2', author: 'Maria', avatarUrl: 'https://i.pravatar.cc/150?u=maria', text: 'I never thought about the colors of my food this way. Thank you for the tips!', date: '2024-07-17' },
    ],
    '2': [
        { id: 'c2-1', author: 'David', avatarUrl: 'https://i.pravatar.cc/150?u=david', text: 'The idea of "activity snacks" is brilliant. I will start incorporating them into my workday.', date: '2024-07-11' },
    ],
    '3': [],
};

// Simulate async API calls
export const getBlogPosts = async (): Promise<BlogPost[]> => {
    return new Promise(resolve => setTimeout(() => resolve(posts), 300));
};

export const getBlogPostById = async (id: string): Promise<BlogPost | undefined> => {
    return new Promise(resolve => setTimeout(() => resolve(posts.find(p => p.id === id)), 300));
};

export const getCommentsByPostId = async (postId: string): Promise<Comment[]> => {
    return new Promise(resolve => setTimeout(() => resolve(comments[postId] || []), 300));
};

export const addComment = async (postId: string, comment: { author: string; text: string }): Promise<Comment> => {
    const newComment: Comment = {
        id: `c${postId}-${Date.now()}`,
        author: comment.author,
        text: comment.text,
        avatarUrl: `https://i.pravatar.cc/150?u=${comment.author.toLowerCase()}`,
        date: new Date().toISOString().split('T')[0],
    };

    if (!comments[postId]) {
        comments[postId] = [];
    }
    comments[postId].push(newComment);

    return new Promise(resolve => setTimeout(() => resolve(newComment), 500));
};