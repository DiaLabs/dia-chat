import { CreateMLCEngine, MLCEngineInterface, ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import { LLMConfig, DEFAULT_CONFIG } from '@/config/llm';
import { LLMEngine, Message, ProgressInfo } from './engines/LLMEngine';

export class LLMService {
    private static instance: LLMService;
    private engine: LLMEngine | null = null;
    private isInitialized = false;
    private initPromise: Promise<void> | null = null;

    // Track which engine type is currently active
    private activeEngineType: 'webllm' | 'transformers' | null = null;

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
    async isModelCached(engineType?: 'webllm' | 'transformers'): Promise<boolean> {
        // If already initialized, it's definitely available
        if (this.isInitialized && this.engine) {
            return true;
        }

        try {
            // Determine which engine to check
            const targetEngine = engineType || await this.detectBestBackend();
            console.log(`Checking cache for engine: ${targetEngine}`);

            // Check Cache API
            const cacheKeys = await window.caches.keys();

            if (targetEngine === 'webllm') {
                const hasWebLLMCache = cacheKeys.some(key => key.includes('webllm') || key.includes('mlc'));
                const databases = await window.indexedDB.databases();
                const hasIndexedDB = databases.some(db =>
                    db.name && (db.name.includes('webllm') || db.name.includes('mlc'))
                );
                return hasWebLLMCache || hasIndexedDB;
            } else {
                // Transformers.js cache
                // Default cache name is 'transformers-cache'
                return cacheKeys.some(key => key.includes('transformers-cache'));
            }
        } catch (error) {
            console.warn('Failed to check model cache:', error);
            return false;
        }
    }

    /**
     * Public method to get the best backend (for UI prediction)
     */
    async getPreferredBackend(): Promise<'webllm' | 'transformers'> {
        return this.detectBestBackend();
    }

    /**
     * Detect best available backend
     */
    private async detectBestBackend(): Promise<'webllm' | 'transformers'> {
        if (typeof window === 'undefined') return 'transformers';

        // 1. Check URL parameters (Highest priority for debugging)
        const params = new URLSearchParams(window.location.search);
        const urlForceCPU = params.get('cpu') === 'true' || params.get('forceCPU') === 'true';

        if (urlForceCPU) {
            console.log('CPU mode forced via URL.');
            return 'transformers';
        }

        // 2. Check persisted settings preference
        const inferenceMode = localStorage.getItem('dia-inference-mode');
        if (inferenceMode === 'cpu') {
            console.log('CPU mode enforced by settings.');
            return 'transformers';
        }

        // 3. Hardware check (Auto / GPU preference)
        try {
            if (navigator.gpu) {
                const adapter = await navigator.gpu.requestAdapter();
                if (adapter) {
                    console.log('WebGPU is available. Using WebLLM engine.');
                    return 'webllm';
                }
            }
        } catch (e) {
            console.warn('WebGPU check failed:', e);
        }

        console.log('WebGPU not available. Falling back to Transformers.js (CPU).');
        return 'transformers';
    }

    /**
     * Initialize the LLM engine with the specified model
     */
    async initialize(
        config: LLMConfig = DEFAULT_CONFIG,
        onProgress?: (progress: ProgressInfo) => void
    ): Promise<void> {
        // If already initialized with same engine type, just return
        // Note: Logic simplified; if config changes ideally we re-init
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
        this.engine?.stop(); // Or specific cancel if added to interface
        // Currently interface only has stop() and unload()
        // We might need to reject the promise manually or let the engine handle cancellation state
        this.initPromise = null;
    }

    /**
     * Reset initialization state to allow retry after error
     */
    resetInitialization(): void {
        this.initPromise = null;
    }

    private async doInitialize(
        config: LLMConfig,
        onProgress?: (progress: ProgressInfo) => void
    ): Promise<void> {
        try {
            // Detect Engine
            let engineType = config.engine || await this.detectBestBackend();
            this.activeEngineType = engineType;

            const initEngine = async (type: 'webllm' | 'transformers') => {
                if (type === 'webllm') {
                    const { WebLLMEngine } = await import('./engines/WebLLMEngine');
                    this.engine = new WebLLMEngine();
                } else {
                    const { TransformersEngine } = await import('./engines/TransformersEngine');
                    this.engine = new TransformersEngine();
                }

                console.log(`Initializing ${type} engine...`);
                if (this.engine) {
                    await this.engine.initialize(config, onProgress);
                }
            };

            try {
                await initEngine(engineType);
            } catch (initError) {
                // If WebLLM fails, try fallback to Transformers
                if (engineType === 'webllm') {
                    console.warn('WebLLM initialization failed, falling back to CPU/Transformers...', initError);

                    // Cleanup failed engine
                    this.engine = null;

                    // Switch to transformers
                    engineType = 'transformers';
                    this.activeEngineType = engineType;

                    // Retry initialization
                    await initEngine('transformers');
                } else {
                    throw initError;
                }
            }

            this.isInitialized = true;
        } catch (error) {
            this.initPromise = null;
            this.engine = null;
            console.error('Failed to initialize LLM:', error);
            throw error;
        }
    }

    /**
     * Generate a response with streaming
     */
    async generateResponse(
        messages: ChatCompletionMessageParam[], // Kept compat with UI type, logic will map if needed
        onToken?: (token: string) => void
    ): Promise<string> {
        if (!this.engine || !this.isInitialized) {
            throw new Error('Engine not initialized. Call initialize() first.');
        }

        try {
            // Map ChatCompletionMessageParam to strictly typed Message if needed
            // (They are compatible enough for 'role' and 'content')
            const engineMessages = messages.map(m => ({
                role: m.role as 'system' | 'user' | 'assistant',
                content: typeof m.content === 'string' ? m.content : '' // Handle array content if ever present
            }));

            return await this.engine.generateResponse(engineMessages, (token) => {
                onToken?.(token);
            });
        } catch (error) {
            console.error('Error during generation:', error);
            throw error;
        }
    }

    /**
     * Stop the current generation
     */
    stopGeneration(): void {
        this.engine?.stop();
    }

    /**
     * Check if the engine is ready
     */
    isReady(): boolean {
        return this.isInitialized && this.engine !== null && this.engine.isReady();
    }

    /**
     * Unload the model and free memory
     */
    async unload(): Promise<void> {
        if (this.engine) {
            await this.engine.unload();
            this.engine = null;
        }
        this.isInitialized = false;
        this.initPromise = null;
    }

    /**
     * Get the currently active engine type
     */
    getActiveEngine(): 'webllm' | 'transformers' | null {
        return this.activeEngineType;
    }

    /**
     * Clear the model cache from browser storage
     */
    async clearCache(): Promise<void> {
        try {
            await this.unload();

            // Clear WebLLM Cache
            const cacheNames = await window.caches.keys();
            for (const name of cacheNames) {
                if (name.includes('webllm') || name.includes('mlc') || name.includes('transformers')) {
                    await window.caches.delete(name);
                    console.log(`Deleted cache: ${name}`);
                }
            }

            // Clear IndexedDB databases
            const databases = await window.indexedDB.databases();
            for (const db of databases) {
                if (db.name && (db.name.includes('webllm') || db.name.includes('mlc') || db.name.includes('transformers'))) {
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
