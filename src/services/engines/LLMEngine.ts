
import { LLMConfig } from '@/config/llm';

export interface ProgressInfo {
    progress: number;
    text: string;
}

export interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface LLMEngine {
    /**
     * Initialize the engine with configuration
     */
    initialize(config: LLMConfig, onProgress?: (progress: ProgressInfo) => void): Promise<void>;

    /**
     * Generate a response for the given messages
     */
    generateResponse(
        messages: Message[],
        onToken: (token: string) => void
    ): Promise<string>;

    /**
     * Stop current generation
     */
    stop(): void;

    /**
     * Unload the model and free resources
     */
    unload(): Promise<void>;

    /**
     * Check if engine is ready
     */
    isReady(): boolean;
}
