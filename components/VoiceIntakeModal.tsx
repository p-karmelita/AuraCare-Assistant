
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, FunctionDeclaration, Type, LiveServerMessage, Modality, Blob as GenaiBlob } from "@google/genai";
import { Patient } from '../types';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { AuraCareLogo } from './icons/AuraCareLogo';
import { encode, decode, decodeAudioData } from '../utils/audio';
import { useTranslations } from '../hooks/useTranslations';

interface VoiceIntakeModalProps {
  onClose: () => void;
  onSubmit: (data: Patient) => void;
}

type ConversationTurn = {
    speaker: 'user' | 'assistant';
    text: string;
};

type Status = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'done' | 'error';

const VoiceIntakeModal: React.FC<VoiceIntakeModalProps> = ({ onClose, onSubmit }) => {
    const { t } = useTranslations();
    const [status, setStatus] = useState<Status>('idle');
    const [transcript, setTranscript] = useState<ConversationTurn[]>([]);
    const [currentInterimTranscript, setCurrentInterimTranscript] = useState('');
    const [micVolume, setMicVolume] = useState(0);
    
    const sessionPromise = useRef<Promise<any> | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const inputAudioContext = useRef<AudioContext | null>(null);
    const outputAudioContext = useRef<AudioContext | null>(null);
    const scriptProcessor = useRef<ScriptProcessorNode | null>(null);
    const mediaStreamSource = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTime = useRef(0);
    const transcriptEndRef = useRef<HTMLDivElement | null>(null);
    const micVolumeRef = useRef(0);

    const submitPatientIntakeFormDeclaration: FunctionDeclaration = {
        name: 'submitPatientIntakeForm',
        parameters: {
          type: Type.OBJECT,
          description: 'Submits the collected patient intake information.',
          properties: {
            fullName: { type: Type.STRING, description: 'The full name of the patient.' },
            dob: { type: Type.STRING, description: 'The patient\'s date of birth in YYYY-MM-DD format.' },
            contact: { type: Type.STRING, description: 'The patient\'s email address or phone number.' },
            symptoms: { type: Type.STRING, description: 'A detailed description of the patient\'s symptoms.' },
            pastConditions: { type: Type.STRING, description: 'Any past medical conditions the patient has had.' },
            surgeries: { type: Type.STRING, description: 'Any previous surgeries the patient has had.' },
            medications: { type: Type.STRING, description: 'A list of current medications the patient is taking.' },
          },
          required: ['fullName', 'dob', 'contact', 'symptoms'],
        },
    };

    const statusText: Record<Status, string> = {
        idle: t('voiceStatusIdle'),
        connecting: t('voiceStatusConnecting'),
        listening: t('voiceStatusListening'),
        thinking: t('voiceStatusThinking'),
        speaking: t('voiceStatusSpeaking'),
        done: t('voiceStatusDone'),
        error: t('voiceStatusError')
    };

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcript, currentInterimTranscript]);

    useEffect(() => {
        let animationFrameId: number;
        const updateVisualizer = () => {
            setMicVolume(micVolumeRef.current);
            animationFrameId = requestAnimationFrame(updateVisualizer);
        };

        if (status === 'listening') {
            animationFrameId = requestAnimationFrame(updateVisualizer);
        } else {
            micVolumeRef.current = 0;
            setMicVolume(0);
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [status]);

    const stopConversation = useCallback(() => {
        if (sessionPromise.current) {
            sessionPromise.current.then(session => session.close());
            sessionPromise.current = null;
        }
        if (scriptProcessor.current) {
            scriptProcessor.current.disconnect();
            scriptProcessor.current = null;
        }
        if (mediaStreamSource.current) {
            mediaStreamSource.current.disconnect();
            mediaStreamSource.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (inputAudioContext.current && inputAudioContext.current.state !== 'closed') {
            inputAudioContext.current.close();
        }
         if (outputAudioContext.current && outputAudioContext.current.state !== 'closed') {
            outputAudioContext.current.close();
        }
        setStatus('idle');
    }, []);

    useEffect(() => {
        return () => {
            stopConversation();
        };
    }, [stopConversation]);

    const startConversation = async () => {
        setStatus('connecting');
        setTranscript([]);
        setCurrentInterimTranscript('');
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            inputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTime.current = 0;

            sessionPromise.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('listening');
                        mediaStreamSource.current = inputAudioContext.current!.createMediaStreamSource(streamRef.current!);
                        scriptProcessor.current = inputAudioContext.current!.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessor.current.onaudioprocess = (audioProcessingEvent) => {
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);

                            let sumSquares = 0.0;
                            for (const sample of inputData) {
                                sumSquares += sample * sample;
                            }
                            const rms = Math.sqrt(sumSquares / inputData.length);
                            micVolumeRef.current = rms * 7; // Scale for visual sensitivity

                            const pcmBlob: GenaiBlob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.current?.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        mediaStreamSource.current.connect(scriptProcessor.current);
                        scriptProcessor.current.connect(inputAudioContext.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            setCurrentInterimTranscript(message.serverContent.inputTranscription.text);
                        }

                        if (message.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                            if(status !== 'speaking') setStatus('speaking');

                            const base64Audio = message.serverContent.modelTurn.parts[0].inlineData.data;
                            nextStartTime.current = Math.max(nextStartTime.current, outputAudioContext.current!.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext.current!, 24000, 1);
                            const source = outputAudioContext.current!.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputAudioContext.current!.destination);
                            source.start(nextStartTime.current);
                            nextStartTime.current += audioBuffer.duration;
                        }

                        if (message.serverContent?.outputTranscription) {
                           setTranscript(prev => {
                                const lastTurn = prev[prev.length - 1];
                                if (lastTurn?.speaker === 'assistant') {
                                    return [...prev.slice(0, -1), { ...lastTurn, text: message.serverContent!.outputTranscription!.text }];
                                }
                                return [...prev, { speaker: 'assistant', text: message.serverContent!.outputTranscription!.text }];
                           });
                        }

                        if (message.serverContent?.turnComplete) {
                            if (currentInterimTranscript) {
                                setTranscript(prev => [...prev, { speaker: 'user', text: currentInterimTranscript }]);
                            }
                            setCurrentInterimTranscript('');
                            setStatus('listening');
                        }
                        
                         if (message.toolCall?.functionCalls) {
                            for (const fc of message.toolCall.functionCalls) {
                                if (fc.name === 'submitPatientIntakeForm') {
                                    onSubmit(fc.args as unknown as Patient);
                                    setStatus('done');
                                    setTimeout(() => onClose(), 2000); // Close after showing done message
                                }
                            }
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live API Error:', e);
                        setStatus('error');
                        stopConversation();
                    },
                    onclose: () => {
                       // Handled by user action or error
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    tools: [{ functionDeclarations: [submitPatientIntakeFormDeclaration] }],
                    systemInstruction: t('voiceSystemInstruction')
                },
            });
        } catch (error) {
            console.error("Failed to start conversation:", error);
            setStatus('error');
        }
    };
    
    return (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-2xl flex items-center justify-center z-50 p-4 animate-fade-in" aria-modal="true">
            <div className="bg-white/80 dark:bg-black/30 border border-slate-300 dark:border-slate-700/50 w-full max-w-2xl h-[90vh] max-h-[700px] rounded-2xl shadow-2xl flex flex-col overflow-hidden dark:shadow-[var(--glow-cyan)]">
                <header className="flex items-center justify-between p-4 border-b border-slate-300 dark:border-slate-700/50 flex-shrink-0">
                    <div className="flex items-center">
                        <AuraCareLogo className="h-8 w-8 text-cyan-500 dark:text-cyan-400" />
                        <h2 className="ml-3 text-xl font-bold text-slate-800 dark:text-slate-200">{t('voiceAssistantTitle')}</h2>
                    </div>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-grow p-6 overflow-y-auto bg-slate-100/50 dark:bg-black/20">
                    <div className="space-y-4">
                        {transcript.map((turn, index) => (
                            <div key={index} className={`flex ${turn.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] px-4 py-2 rounded-xl ${turn.speaker === 'user' ? 'bg-cyan-500/60 text-white' : 'bg-slate-300 dark:bg-slate-700/50 text-slate-800 dark:text-slate-200'}`}>
                                    <p>{turn.text}</p>
                                </div>
                            </div>
                        ))}
                        {currentInterimTranscript && (
                             <div className="flex justify-end">
                                <div className="max-w-[80%] px-4 py-2 rounded-xl bg-cyan-600/40 text-white/90">
                                    <p>{currentInterimTranscript}</p>
                                </div>
                            </div>
                        )}
                        <div ref={transcriptEndRef} />
                    </div>
                </main>

                <footer className="p-4 border-t border-slate-300 dark:border-slate-700/50 flex-shrink-0 bg-white/70 dark:bg-slate-800/50">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center text-slate-700 dark:text-slate-300">
                           <div className="relative">
                                {status === 'listening' && (
                                    <div
                                        className="absolute inset-0 -m-1.5 rounded-full bg-green-400/30 -z-10"
                                        style={{
                                            transform: `scale(${1 + Math.min(micVolume, 1) * 1.5})`,
                                            transition: 'transform 75ms linear'
                                        }}
                                    />
                                )}
                               <MicrophoneIcon className={`relative w-6 h-6 transition-colors ${status === 'listening' ? 'text-green-400' : 'text-slate-500 dark:text-slate-400'}`} />
                           </div>
                           <span className="ml-3 font-medium">{statusText[status]}</span>
                        </div>
                        {status === 'idle' || status === 'error' ? (
                            <button onClick={startConversation} className="px-6 py-2 bg-cyan-600 text-white rounded-lg font-semibold hover:bg-cyan-700 transition-colors shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                                {t('startConversation')}
                            </button>
                        ) : (
                            <button onClick={() => { stopConversation(); onClose(); }} className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors shadow-[0_0_10px_rgba(220,38,38,0.4)]">
                                {t('endConversation')}
                            </button>
                        )}
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default VoiceIntakeModal;
