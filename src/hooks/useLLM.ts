'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { LLMService } from '@/services/LLMService';
import { DEFAULT_CONFIG } from '@/config/llm';
import { useAppSettings } from '@/context/AppSettingsContext';

interface UseLLMResult {
    isReady: boolean;
    isLoading: boolean;
    progress: number;
    progressText: string;
    error: string | null;
    isCached: boolean;
    activeEngine: 'webllm' | 'transformers' | null;
    initialize: () => Promise<void>;
    cancelDownload: () => void;
    sendMessage: (
        messages: Array<{ role: 'user' | 'assistant'; content: string }>,
        contextSummary: string | null,
        onToken: (token: string) => void
    ) => Promise<string>;
    stopGeneration: () => void;
    unload: () => Promise<void>;
}

export function useLLM(): UseLLMResult {
    const service = useRef(LLMService.getInstance());
    const { inferenceMode } = useAppSettings();
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressText, setProgressText] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isCached, setIsCached] = useState(false);
    const [activeEngine, setActiveEngine] = useState<'webllm' | 'transformers' | null>(null);

    // Check if model is cached on mount and auto-initialize if cached
    useEffect(() => {
        let mounted = true;

        const checkCacheAndInit = async () => {
            try {
                // Determine which engine we will be using (for UI feedback)
                const backend = await service.current.getPreferredBackend();

                // If the active engine is different from preferred, unload the old one
                if (service.current.getActiveEngine() && service.current.getActiveEngine() !== backend) {
                    console.log(`Switching engine from ${service.current.getActiveEngine()} to ${backend}`);
                    await service.current.unload();
                    if (mounted) {
                        setIsReady(false);
                        setIsCached(false);
                        setActiveEngine(null);
                    }
                }

                if (mounted) {
                    setActiveEngine(backend);
                }

                // If already initialized with correct engine, update state
                if (service.current.isReady() && service.current.getActiveEngine() === backend) {
                    if (mounted) {
                        setIsReady(true);
                        setIsCached(true);
                        console.log('Model already initialized and ready');
                    }
                    return;
                }

                const cached = await service.current.isModelCached(backend);
                if (mounted) {
                    setIsCached(cached);
                }

                // Auto-initialize in background if cached
                if (cached && !service.current.isReady() && mounted) {
                    console.log('Model is cached, auto-initializing in background...');
                    setIsLoading(true);
                    setError(null);

                    try {
                        // Pass explicit engine config or rely on detectBestBackend which now respects inferenceMode
                        const config = { ...DEFAULT_CONFIG, engine: backend };

                        await service.current.initialize(config, (progressInfo) => {
                            if (mounted) {
                                setProgress(progressInfo.progress);
                                setProgressText(progressInfo.text);
                            }
                        });

                        if (mounted) {
                            setIsReady(true);
                            setIsLoading(false);
                            console.log('Model initialized successfully from cache');
                        }
                    } catch (err) {
                        console.error('Failed to auto-initialize cached model:', err);
                        if (mounted) {
                            setIsLoading(false);
                            setError(err instanceof Error ? err.message : 'Failed to initialize');
                            // Don't set isCached to false - it's still cached, just failed to load
                        }
                    }
                }
            } catch (err) {
                console.error('Failed to check cache:', err);
                if (mounted) {
                    setError(err instanceof Error ? err.message : 'Failed to check cache');
                }
            }
        };

        checkCacheAndInit();

        return () => {
            mounted = false;
        };
    }, [inferenceMode]); // Re-run when inferenceMode changes

    const initialize = useCallback(async () => {
        if (service.current.isReady()) {
            setIsReady(true);
            return;
        }

        // Reset any previous failed initialization (if method exists)
        if (typeof service.current.resetInitialization === 'function') {
            service.current.resetInitialization();
        }

        try {
            setIsLoading(true);
            setError(null);
            setProgress(0);
            setProgressText('Initializing...');

            await service.current.initialize(DEFAULT_CONFIG, (progressInfo) => {
                setProgress(progressInfo.progress);
                setProgressText(progressInfo.text);
            });

            setIsReady(true);
            setIsCached(true);
            setActiveEngine(service.current.getActiveEngine());
            setProgress(100);
            setProgressText('Ready!');
        } catch (err: unknown) {
            console.error('Failed to initialize LLM:', err);
            const errorMessage = err instanceof Error ? err.message : 'Failed to initialize model';
            setError(errorMessage);
            setIsReady(false);
            setIsLoading(false);
        }
    }, []);

    const sendMessage = useCallback(
        async (
            messages: Array<{ role: 'user' | 'assistant'; content: string }>,
            contextSummary: string | null,
            onToken: (token: string) => void
        ): Promise<string> => {
            if (!isReady) {
                throw new Error('Model not ready');
            }

            try {
                setError(null);

                // Build messages array with system prompt and context
                let systemContent = DEFAULT_CONFIG.systemPrompt;

                // Add context summary if available
                if (contextSummary) {
                    systemContent += `\n\nPrevious conversation summary for context: ${contextSummary}`;
                }

                const systemMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
                    { role: 'system', content: systemContent },
                ];

                // Add recent messages (last 10 for context window management)
                const recentMessages = messages.slice(-10).map((m) => ({
                    role: m.role as 'user' | 'assistant',
                    content: m.content,
                }));

                const allMessages = [...systemMessages, ...recentMessages];

                const startTime = performance.now();
                let tokenCount = 0;

                const response = await service.current.generateResponse(allMessages, (token) => {
                    tokenCount++;
                    onToken(token);
                });

                const endTime = performance.now();
                const duration = (endTime - startTime) / 1000;
                const tokensPerSec = tokenCount / duration;

                console.log(`tokens/sec: ${tokensPerSec.toFixed(2)}, Assistant: ${response}`);
                console.log(allMessages);

                return response;
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to generate response';
                if (errorMessage !== 'Generation aborted') {
                    console.error('Error generating response:', err);
                    setError(errorMessage);
                }
                throw err;
            }
        },
        [isReady]
    );

    const stopGeneration = useCallback(() => {
        service.current.stopGeneration();
    }, []);

    const cancelDownload = useCallback(() => {
        service.current.cancelInitialization();
        setIsLoading(false);
        setProgress(0);
        setProgressText('');
        setError('Download cancelled');
    }, []);

    const unload = useCallback(async () => {
        service.current.cancelInitialization();
        await service.current.unload();
        setIsReady(false);
        setIsLoading(false);
        setProgress(0);
        setProgressText('');
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Only unload if actually unmounting the provider, not just remounting components
            // For now, we keep the model loaded in the service singleton
            // but we cancel any active generation or downloads
            service.current.stopGeneration();
            service.current.cancelInitialization();
        };
    }, []);

    return {
        isReady,
        isLoading,
        progress,
        progressText,
        error,
        isCached,
        initialize,
        cancelDownload,
        sendMessage,
        stopGeneration,
        unload,
        activeEngine,
    };
}
