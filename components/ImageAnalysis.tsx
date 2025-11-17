
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { analyzeImage } from '../services/geminiService';
import { UploadIcon } from './icons/UploadIcon';
import LoadingSpinner from './LoadingSpinner';
import { useTranslations } from '../hooks/useTranslations';

interface ImageAnalysisProps {
    onBack: () => void;
    onAnalysisComplete: (text: string) => void;
}

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ onBack, onAnalysisComplete }) => {
    const { t } = useTranslations();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState(t('imageAnalysisDefaultPrompt'));
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError(null);
            setAnalysisResult(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.webp'] },
        multiple: false,
    });
    
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const result = (reader.result as string).split(',')[1];
                resolve(result);
            };
            reader.onerror = error => reject(error);
        });
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError(t('errorUploadImageFirst'));
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        try {
            const base64Image = await fileToBase64(file);
            const result = await analyzeImage(prompt, base64Image, file.type);
            setAnalysisResult(result);
        } catch (err) {
            setError(t('errorAnalyzeImage'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const useResult = () => {
        if (analysisResult) {
            onAnalysisComplete(analysisResult);
        }
    };

    return (
        <div className="animate-fade-in h-full flex flex-col">
            <div className="flex-grow overflow-y-auto pr-2 space-y-4">
                <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                        ${isDragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-slate-400 dark:border-slate-600 hover:border-cyan-500'}`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center">
                        <UploadIcon className="w-10 h-10 text-slate-500 mb-2" />
                        {preview ? (
                            <p className="text-sm text-slate-600 dark:text-slate-300">{t('imageSelected')}</p>
                        ) : (
                            isDragActive ?
                            <p className="text-sm text-slate-600 dark:text-slate-300">{t('imageDropHere')}</p> :
                            <p className="text-sm text-slate-600 dark:text-slate-300">{t('imageDragDrop')}</p>
                        )}
                    </div>
                </div>

                {preview && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-cyan-600 dark:text-cyan-300 mb-2">{t('imagePreview')}</h4>
                        <img src={preview} alt="Preview" className="max-h-48 w-full object-contain rounded-lg bg-black/5 dark:bg-black/20" />
                    </div>
                )}
                
                {preview && (
                    <div className="mt-4">
                         <label htmlFor="prompt" className="block text-xs font-medium text-slate-600 dark:text-slate-400">{t('analysisPrompt')}</label>
                         <textarea 
                            id="prompt" 
                            rows={3}
                            value={prompt} 
                            onChange={(e) => setPrompt(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white/5 dark:bg-white/5 border border-slate-400 dark:border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 sm:text-sm text-slate-800 dark:text-slate-200"
                         />
                    </div>
                )}

                {isLoading && (
                    <div className="flex flex-col items-center justify-center text-center mt-4">
                        <LoadingSpinner />
                        <p className="mt-2 text-slate-600 dark:text-slate-400">{t('analyzingImage')}</p>
                    </div>
                )}
                
                {error && <p className="text-sm text-red-500 mt-4 text-center">{error}</p>}
                
                {analysisResult && (
                    <div className="mt-4">
                        <h4 className="text-sm font-semibold text-cyan-600 dark:text-cyan-300 mb-2">{t('aiAnalysisResult')}</h4>
                        <div className="bg-slate-100 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-700/60 rounded-lg p-3 space-y-3 text-sm overflow-y-auto max-h-[150px]">
                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{analysisResult}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-300 dark:border-slate-700/50 flex-shrink-0 flex items-center justify-between">
                <button onClick={onBack} className="text-sm text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors font-medium">
                    &larr; {t('backToForm')}
                </button>
                {analysisResult ? (
                    <button onClick={useResult} className="py-2 px-4 border border-green-500 rounded-md shadow-sm text-sm font-medium text-green-700 dark:text-green-200 bg-green-500/20 hover:bg-green-500/40 transition-all">
                        {t('useAnalysis')}
                    </button>
                ) : (
                    <button onClick={handleAnalyze} disabled={!file || isLoading} className="py-2 px-6 border border-cyan-500 rounded-md shadow-sm text-sm font-medium text-cyan-700 dark:text-cyan-200 bg-cyan-500/20 hover:bg-cyan-500/40 disabled:bg-slate-200 dark:disabled:bg-slate-700 disabled:border-slate-300 dark:disabled:border-slate-600 disabled:text-slate-400 dark:disabled:text-slate-400 disabled:cursor-not-allowed transition-all">
                        {isLoading ? t('analyzing') : t('analyze')}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ImageAnalysis;
