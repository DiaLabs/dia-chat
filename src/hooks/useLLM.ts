import { useState, useCallback, useRef, useEffect } from 'react';
import { LLMService } from '@/services/LLMService';
import { DEFAULT_CONFIG } from '@/config/llm';

interface UseLLMResult {
    isReady: boolean;
    isLoading: boolean;
    progress: number;
    error: string | null;
    initialize: () => Promise<void>;
    checkCache: (durationDays: number) => Promise<boolean>;
    sendMessage: (prompt: string, onToken: (token: string) => void) => Promise<string>;
    unload: () => void;
    cancelDownload: () => void;
}

export function useLLM(): UseLLMResult {
    const [isReady, setIsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const service = useRef(LLMService.getInstance());

    // Check if already ready on mount
    useEffect(() => {
        if (service.current.isReady()) {
            setIsReady(true);
        }
    }, []);

    const cancelDownload = useCallback(() => {
        service.current.cancelDownload();
        setIsLoading(false);
        setError('Download Cancelled');
        setProgress(0);
    }, []);

    const initialize = useCallback(async () => {
        if (isReady || isLoading) return;

        setIsLoading(true);
        setError(null);
        setProgress(0);

        try {
            await service.current.initialize(DEFAULT_CONFIG, (p) => {
                setProgress(p);
            });
            setIsReady(true);
        } catch (err: any) {
            if (err.name === 'AbortError') {
                setError('Download Cancelled');
            } else {
                setError(err.message || 'Failed to initialize LLM');
                console.error(err);
            }
        } finally {
            setIsLoading(false);
        }
    }, [isReady, isLoading]);

    // ... sendMessage, checkCache, unload ...

    const sendMessage = useCallback(async (
        prompt: string,
        onToken: (token: string) => void
    ): Promise<string> => {
        if (!isReady) {
            throw new Error('LLM not ready');
        }

        try {
            // Format prompt with system instruction if needed or raw
            // For Gemma IT models, standard chat format is:
            // <start_of_turn>user\n{prompt}<end_of_turn>\n<start_of_turn>model\n
            // But standard text generation might just take raw prompt.
            // We'll wrap it in chat format for better results.

            const formattedPrompt = `<start_of_turn>user\n${DEFAULT_CONFIG.systemPrompt}\n\n${prompt}<end_of_turn>\n<start_of_turn>model\n`;

            return await service.current.generateResponse(formattedPrompt, onToken);
        } catch (err: any) {
            setError(err.message || 'Failed to generate response');
            throw err;
        }
    }, [isReady]);

    const checkCache = useCallback(async (durationDays: number): Promise<boolean> => {
        return service.current.checkCache(durationDays);
    }, []);

    const unload = useCallback(() => {
        service.current.unload();
        setIsReady(false);
        setProgress(0);
    }, []);

    return {
        isReady,
        isLoading,
        progress,
        error,
        initialize,
        checkCache,
        sendMessage,
        unload,
        cancelDownload
    };
}
