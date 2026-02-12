
import { LLMEngine, Message, ProgressInfo } from './LLMEngine';
import { LLMConfig } from '@/config/llm';

export class TransformersEngine implements LLMEngine {
    private worker: Worker | null = null;
    private isInitialized = false;

    async initialize(
        config: LLMConfig,
        onProgress?: (progress: ProgressInfo) => void
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.isInitialized) {
                onProgress?.({ progress: 1, text: 'Ready!' });
                return resolve();
            }

            try {
                // Initialize the worker
                this.worker = new Worker(new URL('./transformers.worker.ts', import.meta.url), {
                    type: 'module'
                });

                this.worker.onmessage = (event) => {
                    const { type, data, error } = event.data;

                    if (type === 'progress' && onProgress) {
                        onProgress({
                            text: `Loading model... (${Math.round(data.progress || 0)}%)`,
                            progress: (data.progress || 0) / 100
                        });
                    } else if (type === 'ready') {
                        this.isInitialized = true;
                        onProgress?.({ progress: 1, text: 'Ready!' });
                        resolve();
                    } else if (type === 'error') {
                        console.error('Worker initialization error:', error);
                        reject(new Error(error));
                    }
                };

                this.worker.onerror = (errorEvent) => {
                    console.error('Worker error:', errorEvent);
                    reject(new Error(`Worker error: ${errorEvent.message}`));
                };

                this.worker.postMessage({ type: 'init', config });

            } catch (error) {
                console.error('Failed to create worker:', error);
                reject(error);
            }
        });
    }

    async generateResponse(
        messages: Message[],
        onToken: (token: string) => void
    ): Promise<string> {
        if (!this.worker || !this.isInitialized) {
            throw new Error('Engine not initialized');
        }

        return new Promise((resolve, reject) => {
            let fullText = '';
            let previousTextLength = 0;

            // Re-bind message handler for generation phase
            this.worker!.onmessage = (event) => {
                const { type, data, error } = event.data;

                if (type === 'update') {
                    // Worker sends full text so far
                    const newFullText = data;
                    if (newFullText.length > previousTextLength) {
                        const delta = newFullText.slice(previousTextLength);
                        onToken(delta);
                        previousTextLength = newFullText.length;
                        fullText = newFullText;
                    }
                } else if (type === 'complete') {
                    // Final text might be sent in complete, or we just use fullText
                    const finalText = data || fullText;
                    // Send any remaining delta if needed? 
                    // Usually complete data is the same as last update or slightly more.
                    if (finalText.length > previousTextLength) {
                        const delta = finalText.slice(previousTextLength);
                        onToken(delta);
                        fullText = finalText;
                    }
                    resolve(fullText);
                } else if (type === 'error') {
                    reject(new Error(error));
                } else if (type === 'interrupted') {
                    resolve(fullText);
                }
            };

            const formattedMessages = messages.map(m => ({
                role: m.role,
                content: m.content
            }));

            this.worker!.postMessage({
                type: 'generate',
                data: {
                    messages: formattedMessages
                }
            });
        });
    }

    stop(): void {
        if (this.worker) {
            this.worker.postMessage({ type: 'interrupt' });
        }
    }

    async unload(): Promise<void> {
        if (this.worker) {
            this.worker.terminate();
            this.worker = null;
            this.isInitialized = false;
        }
    }

    isReady(): boolean {
        return this.isInitialized;
    }
}
