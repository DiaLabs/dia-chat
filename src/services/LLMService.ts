import { CreateMLCEngine, MLCEngineInterface, ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import { LLMConfig, DEFAULT_CONFIG } from '@/config/llm';
import { LLMEngine, Message, ProgressInfo } from './engines/LLMEngine';
import { WebLLMEngine } from './engines/WebLLMEngine';
import { TransformersEngine } from './engines/TransformersEngine';

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
     * Note: This check logic might need updates for Transformers.js cache
     */
    async isModelCached(): Promise<boolean> {
        // If already initialized, it's definitely available
        if (this.isInitialized && this.engine) {
            return true;
        }

        // Check if the model's cache exists in browser storage
        // This primarily checks WebLLM cache for now
        // TODO: Add Transformers check
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
     * Detect best available backend
     */
    private async detectBestBackend(): Promise<'webllm' | 'transformers'> {
        // Check for preferred engine in config if we store it there dynamically
        // But mainly check hardware

        // Debug: Allow forcing CPU via URL param (useful for testing fallback)
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.get('cpu') === 'true' || params.get('forceCPU') === 'true') {
                console.log('CPU mode forced via URL parameter.');
                return 'transformers';
            }
        }

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
            const engineType = config.engine || await this.detectBestBackend();
            this.activeEngineType = engineType;

            if (engineType === 'webllm') {
                this.engine = new WebLLMEngine();
            } else {
                this.engine = new TransformersEngine();
            }

            console.log(`Initializing ${engineType} engine...`);

            await this.engine.initialize(config, onProgress);

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
