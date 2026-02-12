
import { pipeline, env } from '@huggingface/transformers';
import { LLMConfig } from '@/config/llm';
import { LLMEngine, Message, ProgressInfo } from './LLMEngine';

// Configure transformers.js to use WASM
// env.allowLocalModels = false;
// env.useBrowserCache = true;

interface TransformersPipeline {
    (prompt: string, options?: any): Promise<any>;
}

export class TransformersEngine implements LLMEngine {
    private pipe: TransformersPipeline | null = null;
    private isInitialized = false;
    private initPromise: Promise<void> | null = null;
    private abortController: AbortController | null = null;

    constructor() { }

    isReady(): boolean {
        return this.isInitialized && this.pipe !== null;
    }

    async initialize(
        config: LLMConfig,
        onProgress?: (progress: ProgressInfo) => void
    ): Promise<void> {
        if (this.isInitialized && this.pipe) {
            onProgress?.({ progress: 100, text: 'Ready!' });
            return;
        }

        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = this.doInitialize(config, onProgress);
        return this.initPromise;
    }

    private async doInitialize(
        config: LLMConfig,
        onProgress?: (progress: ProgressInfo) => void
    ): Promise<void> {
        try {
            onProgress?.({ progress: 10, text: 'Loading Transformers engine...' });

            // Use the fallback model ID from config, or default if not set
            const modelId = config.fallbackModelId || 'onnx-community/Llama-3.2-1B-Instruct';

            console.log(`Initializing Transformers engine with model: ${modelId}`);

            this.pipe = await pipeline('text-generation', modelId, {
                device: 'wasm',
                quantized: true, // Uses q8 by default or whatever is available
                progress_callback: (data: any) => {
                    if (data.status === 'progress' && onProgress) {
                        // Map 0-100 based on file downloads
                        // This is rough as there are multiple files
                        onProgress({
                            progress: data.progress || 50,
                            text: `Downloading ${data.file}...`
                        });
                    }
                }
            });

            this.isInitialized = true;
            onProgress?.({ progress: 100, text: 'Ready!' });
        } catch (error) {
            this.initPromise = null;
            console.error('Failed to initialize Transformers engine:', error);
            throw error;
        }
    }

    async generateResponse(
        messages: Message[],
        onToken: (token: string) => void
    ): Promise<string> {
        if (!this.pipe) {
            throw new Error('Engine not initialized');
        }

        this.abortController = new AbortController();
        let fullResponse = '';

        // Simple prompt construction for now - ideally use chat template
        // Using a basic Llama 3 format manually if tokenizer doesn't apply chat template automatically
        // Transformers.js pipeline usually handles chat if passed correctly, but often expects single string for text-generation

        // Simplified chat template application:
        const prompt = messages.map(m =>
            `<|start_header_id|>${m.role}<|end_header_id|>\n\n${m.content}<|eot_id|>`
        ).join('') + '<|start_header_id|>assistant<|end_header_id|>\n\n';

        try {
            const output = await this.pipe(prompt, {
                max_new_tokens: 256, // Limit for CPU speed
                temperature: 0.7,
                do_sample: true,
                top_k: 50,
                callback_function: (beams: any[]) => {
                    if (this.abortController?.signal.aborted) {
                        return; // Stop generation logic if possible
                    }

                    const decodedText = beams[0].output_token_ids;
                    // Note: Transformers.js streaming callback implementation varies
                    // The 'callback_function' gives tokens. Decoding inside loop is inefficient.
                    // A better approach specifically for Transformers.js text-generation streamer:
                }
            });

            // Re-implementing with streamer if available in version, otherwise standard await
            // For now, implementing standard await then returning result as we refine streaming for CPU

            // Actually, let's use the Streamer pattern if supported
            // const streamer = new TextStreamer(this.pipe.tokenizer, {
            //    callback_function: onToken
            // });

            // Fallback for standard implementation:
            // Since CPU is slow, full generation wait is acceptable for MVP, but streaming is better.
            // Let's assume standard output for now and improve streaming in next iteration.

            const generatedText = output[0].generated_text;
            // Strip prompt
            const response = generatedText.slice(prompt.length);

            // Emit all at once for now (MVP for CPU)
            onToken(response);
            return response;

        } catch (error) {
            if (this.abortController?.signal.aborted) {
                throw new Error('Generation aborted');
            }
            throw error;
        } finally {
            this.abortController = null;
        }
    }

    stop(): void {
        if (this.abortController) {
            this.abortController.abort();
        }
    }

    async unload(): Promise<void> {
        // Transformers.js pipeline disposal
        if (this.pipe) {
            // pipeline.dispose() if available
            this.pipe = null;
        }
        this.isInitialized = false;
        this.initPromise = null;
    }
}
