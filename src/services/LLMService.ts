import { CreateMLCEngine, MLCEngineInterface, ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import { LLMConfig, DEFAULT_CONFIG } from '@/config/llm';

interface ProgressInfo {
    progress: number;
    text: string;
}

export class LLMService {
    private static instance: LLMService;
    private engine: MLCEngineInterface | null = null;
    private isInitialized = false;
    private initPromise: Promise<void> | null = null;
    private abortController: AbortController | null = null;
    private cancelInitAbortController: AbortController | null = null;

    private constructor() { }

    static getInstance(): LLMService {
        if (!LLMService.instance) {
            LLMService.instance = new LLMService();
        }
        return LLMService.instance;
    }

    /**
     * Check if model is cached in browser
     */
    async isModelCached(): Promise<boolean> {
        // If already initialized, it's definitely available
        if (this.isInitialized && this.engine) {
            return true;
        }

        // Check if the model's cache exists in browser storage
        try {
            // Check Cache API
            const caches = await window.caches.keys();
            const hasCacheAPI = caches.some(key => key.includes('webllm') || key.includes('mlc'));

            // Check IndexedDB for model weights
            const databases = await window.indexedDB.databases();
            const hasIndexedDB = databases.some(db =>
                db.name && (db.name.includes('webllm') || db.name.includes('mlc'))
            );

            const isCached = hasCacheAPI || hasIndexedDB;
            console.log(`Model cache check: CacheAPI=${hasCacheAPI}, IndexedDB=${hasIndexedDB}, Result=${isCached}`);

            return isCached;
        } catch (error) {
            console.warn('Failed to check model cache:', error);
            return false;
        }
    }

    /**
     * Initialize the LLM engine with the specified model
     */
    async initialize(
        config: LLMConfig = DEFAULT_CONFIG,
        onProgress?: (progress: ProgressInfo) => void
    ): Promise<void> {
        // If already initialized with same model, just return
        if (this.isInitialized && this.engine) {
            onProgress?.({ progress: 100, text: 'Ready!' });
            return;
        }

        // If initialization is in progress, wait for it
        if (this.initPromise) {
            return this.initPromise;
        }

        // Ensure previous engine is cleaned up if it exists but in bad state
        if (this.engine) {
            console.log('Cleaning up previous engine instance...');
            await this.unload();
        }

        this.initPromise = this.doInitialize(config, onProgress);
        return this.initPromise;
    }

    /**
     * Cancel ongoing model initialization/download
     */
    cancelInitialization(): void {
        if (this.cancelInitAbortController) {
            this.cancelInitAbortController.abort();
        }
        this.cancelInitAbortController = null;
        this.initPromise = null;
    }

    /**
     * Reset initialization state to allow retry after error
     */
    resetInitialization(): void {
        this.initPromise = null;
        this.cancelInitAbortController = null;
    }

    private async doInitialize(
        config: LLMConfig,
        onProgress?: (progress: ProgressInfo) => void
    ): Promise<void> {
        this.cancelInitAbortController = new AbortController();

        try {
            onProgress?.({ progress: 0, text: 'Initializing...' });

            this.engine = await CreateMLCEngine(config.modelId, {
                initProgressCallback: (report) => {
                    // Check if cancelled
                    if (this.cancelInitAbortController?.signal.aborted) {
                        throw new Error('Download cancelled');
                    }

                    if (onProgress) {
                        onProgress({
                            progress: report.progress * 100,
                            text: report.text,
                        });
                    }
                },
            });

            this.isInitialized = true;
            this.cancelInitAbortController = null;
            onProgress?.({ progress: 100, text: 'Ready!' });
        } catch (error) {
            this.initPromise = null;
            this.cancelInitAbortController = null;
            console.error('Failed to initialize LLM:', error);
            throw error;
        }
    }

    /**
     * Generate a response with streaming
     */
    async generateResponse(
        messages: ChatCompletionMessageParam[],
        onToken?: (token: string) => void
    ): Promise<string> {
        if (!this.engine) {
            throw new Error('Engine not initialized. Call initialize() first.');
        }

        this.abortController = new AbortController();
        let fullResponse = '';

        try {


            const completion = await this.engine.chat.completions.create({
                messages,
                stream: true,
                temperature: DEFAULT_CONFIG.temperature,
                top_p: DEFAULT_CONFIG.topP,
                max_tokens: DEFAULT_CONFIG.maxTokens,
            });


            let tokenCount = 0;

            for await (const chunk of completion) {
                if (this.abortController?.signal.aborted) {
                    console.log('Generation aborted by user');
                    break;
                }

                const token = chunk.choices[0]?.delta?.content || '';
                if (token) {
                    tokenCount++;
                    fullResponse += token;
                    onToken?.(token);
                }
            }



            if (fullResponse.length === 0) {
                console.warn('Warning: Model generated empty response');
            }

            return fullResponse;
        } catch (error) {
            if (this.abortController?.signal.aborted) {
                throw new Error('Generation aborted');
            }
            console.error('Error during generation:', error);
            throw error;
        } finally {
            this.abortController = null;
        }
    }

    /**
     * Stop the current generation
     */
    stopGeneration(): void {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    /**
     * Check if the engine is ready
     */
    isReady(): boolean {
        return this.isInitialized && this.engine !== null;
    }

    /**
     * Unload the model and free memory
     */
    async unload(): Promise<void> {
        if (this.engine) {
            await this.engine.unload();
            this.engine = null;
            this.isInitialized = false;
            this.initPromise = null;
        }
    }

    /**
     * Clear the model cache from browser storage
     */
    async clearCache(): Promise<void> {
        try {
            // First unload current engine
            await this.unload();

            // Clear Cache API (WebLLM/MLC caches)
            const cacheNames = await window.caches.keys();
            for (const name of cacheNames) {
                if (name.includes('webllm') || name.includes('mlc') || name.includes('web-llm')) {
                    await window.caches.delete(name);
                    console.log(`Deleted cache: ${name}`);
                }
            }

            // Clear IndexedDB databases (where model weights are stored)
            const databases = await window.indexedDB.databases();
            for (const db of databases) {
                if (db.name && (db.name.includes('webllm') || db.name.includes('mlc') || db.name.includes('web-llm'))) {
                    window.indexedDB.deleteDatabase(db.name);
                    console.log(`Deleted IndexedDB: ${db.name}`);
                }
            }

            console.log('Model cache cleared successfully');
        } catch (error) {
            console.error('Failed to clear cache:', error);
            throw error;
        }
    }
}
