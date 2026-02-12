
import { CreateMLCEngine, MLCEngineInterface, ChatCompletionMessageParam } from '@mlc-ai/web-llm';
import { LLMConfig, DEFAULT_CONFIG } from '@/config/llm';
import { LLMEngine, Message, ProgressInfo } from './LLMEngine';

export class WebLLMEngine implements LLMEngine {
    private engine: MLCEngineInterface | null = null;
    private isInitialized = false;
    private initPromise: Promise<void> | null = null;
    private abortController: AbortController | null = null;
    private cancelInitAbortController: AbortController | null = null;

    constructor() { }

    isReady(): boolean {
        return this.isInitialized && this.engine !== null;
    }

    async initialize(
        config: LLMConfig = DEFAULT_CONFIG,
        onProgress?: (progress: ProgressInfo) => void
    ): Promise<void> {
        if (this.isInitialized && this.engine) {
            onProgress?.({ progress: 100, text: 'Ready!' });
            return;
        }

        if (this.initPromise) {
            return this.initPromise;
        }

        if (this.engine) {
            await this.unload();
        }

        this.initPromise = this.doInitialize(config, onProgress);
        return this.initPromise;
    }

    private async doInitialize(
        config: LLMConfig,
        onProgress?: (progress: ProgressInfo) => void
    ): Promise<void> {
        this.cancelInitAbortController = new AbortController();

        try {
            onProgress?.({ progress: 0, text: 'Initializing WebLLM...' });

            this.engine = await CreateMLCEngine(config.modelId, {
                initProgressCallback: (report) => {
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
            console.error('Failed to initialize WebLLM:', error);
            throw error;
        }
    }

    async generateResponse(
        messages: Message[],
        onToken: (token: string) => void
    ): Promise<string> {
        if (!this.engine) {
            throw new Error('Engine not initialized');
        }

        this.abortController = new AbortController();
        let fullResponse = '';

        try {
            // Convert our simplified Message interface to MLC's expected format if needed
            // (Assuming types match closely enough or casting is safe for basic roles)
            const chatMessages = messages as ChatCompletionMessageParam[];

            const completion = await this.engine.chat.completions.create({
                messages: chatMessages,
                stream: true,
                temperature: DEFAULT_CONFIG.temperature,
                top_p: DEFAULT_CONFIG.topP,
                max_tokens: DEFAULT_CONFIG.maxTokens,
            });

            for await (const chunk of completion) {
                if (this.abortController?.signal.aborted) {
                    break;
                }

                const token = chunk.choices[0]?.delta?.content || '';
                if (token) {
                    fullResponse += token;
                    onToken(token);
                }
            }

            return fullResponse;
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
        if (this.cancelInitAbortController) {
            this.cancelInitAbortController.abort();
            this.cancelInitAbortController = null;
        }

        if (this.engine) {
            await this.engine.unload();
            this.engine = null;
            this.isInitialized = false;
            this.initPromise = null;
        }
    }
}
