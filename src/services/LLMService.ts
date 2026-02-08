import { FilesetResolver, LlmInference } from '@mediapipe/tasks-genai';
import { LLMConfig } from '@/config/llm';

export class LLMService {
    private static instance: LLMService;
    private llm: LlmInference | null = null;
    private isInitializing = false;
    private modelBlobUrl: string | null = null;
    private abortController: AbortController | null = null;

    private constructor() { }

    static getInstance(): LLMService {
        if (!LLMService.instance) {
            LLMService.instance = new LLMService();
        }
        return LLMService.instance;
    }

    /**
     * Cancels the current model download/initialization.
     */
    cancelDownload() {
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
            this.isInitializing = false;
            console.log('Download cancelled by user');
        }
    }

    async initialize(
        config: LLMConfig,
        onProgress?: (progress: number) => void
    ): Promise<void> {
        if (this.llm) return;
        if (this.isInitializing) {
            // If already initializing, we might want to let it continue or restart.
            // For now, let's assume valid state.
            // But if we want to support forceful restart, we must check.
        }

        this.isInitializing = true;
        this.abortController = new AbortController();

        try {
            // 1. Download/Load Model
            await this.downloadModel(config.modelUrl, onProgress, this.abortController.signal);

            if (!this.modelBlobUrl) {
                // If cancelled, we might reach here with no blob if we handled error silently?
                // No, abort throws.
                throw new Error('Failed to load model file');
            }

            // 2. Initialize MediaPipe GenAI
            const genaiFileset = await FilesetResolver.forGenAiTasks(
                '/wasm'
            );

            this.llm = await LlmInference.createFromOptions(genaiFileset, {
                baseOptions: {
                    modelAssetPath: this.modelBlobUrl,
                },
                maxTokens: config.maxTokens,
                temperature: config.temperature,
                topK: config.topK,
                randomSeed: config.randomSeed,
            });

            // Update last accessed time
            localStorage.setItem('llm-model-last-accessed', Date.now().toString());
            console.log('LLM Initialized successfully');
        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('LLM initialization aborted');
                throw error;
            } else {
                console.error('Failed to initialize LLM:', error);
                throw error;
            }
        } finally {
            this.isInitializing = false;
            this.abortController = null;
        }
    }

    /**
     * Downloads the model file via Cache API if available, or fetches from network.
     */
    private async downloadModel(url: string, onProgress?: (progress: number) => void, signal?: AbortSignal): Promise<void> {
        if (this.modelBlobUrl) return;

        const CACHE_NAME = 'llm-model-v1';

        try {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(url);

            if (cachedResponse) {
                console.log('Loading model from cache...');
                const blob = await cachedResponse.blob();
                this.modelBlobUrl = URL.createObjectURL(blob);
                if (onProgress) onProgress(100);
                return;
            }

            console.log('Downloading model from network...');
            const headers: HeadersInit = {};
            const token = process.env.NEXT_PUBLIC_HF_TOKEN;
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, { headers, signal });
            if (!response.body) throw new Error('ReadableStream not supported');

            const contentLength = response.headers.get('Content-Length');
            const total = contentLength ? parseInt(contentLength, 10) : 0;
            let loaded = 0;

            const reader = response.body.getReader();
            const chunks: Uint8Array[] = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                chunks.push(value);
                loaded += value.length;

                if (total && onProgress) {
                    onProgress((loaded / total) * 100);
                }
            }

            const blob = new Blob(chunks as BlobPart[], { type: 'application/octet-stream' });

            // Store in cache
            try {
                const cacheResponse = new Response(blob, {
                    headers: { 'Content-Type': 'application/octet-stream' }
                });
                await cache.put(url, cacheResponse);
                localStorage.setItem('llm-model-last-accessed', Date.now().toString());
            } catch (cacheError) {
                console.warn('Failed to cache model:', cacheError);
            }

            this.modelBlobUrl = URL.createObjectURL(blob);

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
                throw error; // Re-throw to be caught by initialize
            }
            console.error('Model download failed:', error);
            throw error;
        }
    }

    /**
     * Checks if the model is cached and valid based on expiration duration.
     * @param durationDays Number of days the cache is valid for.
     */
    async checkCache(durationDays: number): Promise<boolean> {
        const CACHE_NAME = 'llm-model-v1';
        try {
            // Check metadata first
            const lastAccessed = localStorage.getItem('llm-model-last-accessed');
            if (lastAccessed) {
                const lastTime = parseInt(lastAccessed, 10);
                const maxAge = durationDays * 24 * 60 * 60 * 1000;
                if (Date.now() - lastTime > maxAge) {
                    console.log('Cache expired, clearing...');
                    await this.clearCache();
                    return false;
                }
            }

            // Check if actual file exists in cache
            // We need the model URL. Since checkCache is static-like or called before config, 
            // we assume the model URL is known or passed.
            // However, this Service is singleton. We can assume the URL from config/llm.ts or pass it.
            // Since we don't have config here easily without importing default, let's just check if ANY request is in 'llm-model-v1'.

            const cache = await caches.open(CACHE_NAME);
            const keys = await cache.keys();
            return keys.length > 0;

        } catch (e) {
            console.error('Error checking cache:', e);
            return false;
        }
    }

    async clearCache(): Promise<void> {
        const CACHE_NAME = 'llm-model-v1';
        await caches.delete(CACHE_NAME);
        localStorage.removeItem('llm-model-last-accessed');
        if (this.modelBlobUrl) {
            URL.revokeObjectURL(this.modelBlobUrl);
            this.modelBlobUrl = null;
        }
    }

    /**
     * Generates a streaming response for the given prompt.
     */
    generateResponse(
        prompt: string,
        onToken: (token: string) => void
    ): Promise<string> {
        if (!this.llm) throw new Error('LLM not initialized');

        // Create a promise to handle the completion of the stream
        return new Promise((resolve, reject) => {
            try {
                let fullText = '';
                this.llm!.generateResponse(prompt, (partialResult, done) => {
                    if (partialResult) {
                        onToken(partialResult);
                        fullText += partialResult;
                    }
                    if (done) {
                        resolve(fullText);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    /**
     * Checks if the LLM is ready.
     */
    isReady(): boolean {
        return !!this.llm;
    }

    /**
     * Unloads the model and frees memory.
     */
    unload() {
        if (this.llm) {
            this.llm.close();
            this.llm = null;
        }
        if (this.modelBlobUrl) {
            URL.revokeObjectURL(this.modelBlobUrl);
            this.modelBlobUrl = null;
        }
    }
}
