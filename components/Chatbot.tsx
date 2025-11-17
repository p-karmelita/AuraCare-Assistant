
import React, { useState, useRef, useEffect } from 'react';
import { getChatbotResponse } from '../services/geminiService';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { useTranslations } from '../hooks/useTranslations';

type Message = {
    author: 'user' | 'bot';
    text: string;
    timestamp: string;
};

const Chatbot: React.FC = () => {
    const { t } = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        setMessages([
            { 
                author: 'bot', 
                text: t('chatbotWelcome'),
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
    }, [t]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const userMessage = inputValue.trim();
        if (!userMessage) return;

        const userTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [...prev, { author: 'user', text: userMessage, timestamp: userTimestamp }]);
        setInputValue('');
        setIsLoading(true);

        try {
            const botResponse = await getChatbotResponse(userMessage);
            const botTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [...prev, { author: 'bot', text: botResponse, timestamp: botTimestamp }]);
        } catch (error) {
            console.error(error);
            const errorTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setMessages(prev => [...prev, { author: 'bot', text: t('chatbotError'), timestamp: errorTimestamp }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-40 transition-transform duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}>
                <button
                    onClick={toggleChat}
                    className="bg-cyan-600 text-white rounded-full p-4 shadow-lg hover:bg-cyan-500 transition-all hover:shadow-[var(--glow-cyan)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                    aria-label={t('openChat')}
                >
                    <ChatBubbleIcon className="w-8 h-8" />
                </button>
            </div>

            <div className={`fixed bottom-0 right-0 sm:bottom-8 sm:right-8 z-50 w-full h-full sm:w-[400px] sm:h-[600px] sm:max-h-[80vh] transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <div className="bg-slate-100/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-cyan-400/30 dark:border-cyan-400/50 rounded-t-lg sm:rounded-lg shadow-xl dark:shadow-[0_0_30px_rgba(6,182,212,0.3)] w-full h-full flex flex-col">
                    <header className="flex items-center justify-between p-4 border-b border-cyan-300/20 flex-shrink-0">
                        <h3 className="text-lg font-bold text-cyan-600 dark:text-cyan-200">{t('chatbotHeader')}</h3>
                        <button onClick={toggleChat} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </header>
                    <div className="flex-grow p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.author === 'user' ? 'justify-end animate-sent' : 'justify-start animate-received'}`}>
                                <div className={`px-4 py-2 rounded-xl max-w-[85%] ${msg.author === 'user' ? 'bg-cyan-500/80 text-white rounded-br-none' : 'bg-white dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'}`}>
                                    <p className="text-sm break-words">{msg.text}</p>
                                    <p className={`text-xs mt-1 opacity-70 ${msg.author === 'user' ? 'text-right' : 'text-left'}`}>
                                        {msg.timestamp}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start animate-received">
                                <div className="bg-white dark:bg-slate-700/50 text-slate-800 dark:text-slate-200 rounded-xl rounded-bl-none px-4 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-0"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-cyan-300/20 flex-shrink-0 flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder={t('askQuestion')}
                            className="flex-grow px-3 py-2 bg-white/80 dark:bg-white/5 border border-slate-300 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-400 sm:text-sm transition-all text-slate-800 dark:text-slate-200 placeholder:text-slate-500"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="bg-cyan-600 text-white rounded-lg p-2 disabled:bg-slate-400 dark:disabled:bg-slate-600 disabled:cursor-not-allowed hover:bg-cyan-500 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-500"
                            disabled={isLoading || !inputValue}
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
