
import { pipeline, env } from '@huggingface/transformers';

console.log('Transformers worker script loaded.');

// Global error handlers
self.onerror = (event: any, source?: string, lineno?: number, colno?: number, error?: Error) => {
    console.error('Worker global error:', event, error);
    self.postMessage({
        type: 'error',
        error: error ? error.message : (typeof event === 'string' ? event : 'Unknown worker error')
    });
};

self.onunhandledrejection = (event: any) => {
    console.error('Worker unhandled rejection:', event.reason);
    self.postMessage({
        type: 'error',
        error: event.reason instanceof Error ? event.reason.message : 'Unhandled rejection in worker'
    });
};

// Configuration to force browser cache usage and remote models
env.allowLocalModels = false;
env.useBrowserCache = true;
// EXTREMELY IMPORTANT: Set the path to the WASM file via CDN to avoid bundler issues
// Using version 1.24.1 to match package.json dependency
env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.24.1/dist/';
// Disable multi-threading to avoid blob worker issues
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.proxy = false;

// Singleton to hold the pipeline instance
class PipelineSingleton {
    static task = 'text-generation';
    static model = 'onnx-community/Llama-3.2-1B-Instruct';
    static instance: any = null;

    static async getInstance(progress_callback: any = null) {
        if (this.instance === null) {
            try {
                console.log('Worker: Creating pipeline...');
                this.instance = await pipeline(this.task, this.model, {
                    dtype: 'q4', // 4-bit quantization
                    device: 'wasm',
                    progress_callback,
                } as any);
                console.log('Worker: Pipeline created successfully.');
            } catch (err: any) {
                console.error('Worker: Failed to create pipeline:', err);
                throw err;
            }
        }
        return this.instance;
    }
}

let isInterrupted = false;

self.addEventListener('message', async (event: MessageEvent) => {
    const { type, data } = event.data;

    if (type === 'init') {
        try {
            await PipelineSingleton.getInstance((progress: any) => {
                self.postMessage({ type: 'progress', data: progress });
            });
            self.postMessage({ type: 'ready' });
        } catch (error: any) {
            self.postMessage({ type: 'error', error: error.message });
        }
    } else if (type === 'generate') {
        try {
            console.log('Worker: Received generate request');
            const { messages, max_new_tokens = 1024, temperature = 0.7 } = data;
            console.log('Worker: Messages:', JSON.stringify(messages));

            const generator = await PipelineSingleton.getInstance();
            isInterrupted = false;

            console.log('Worker: Starting generation with max_new_tokens:', max_new_tokens);

            // Simple stopping criteria using callback
            const callback_function = (beams: any[]) => {
                // console.log('Worker: Callback triggered'); // Uncomment for very verbose logging
                if (isInterrupted) {
                    return true;
                }

                try {
                    // Decode the current output to send updates
                    const decodedText = generator.tokenizer.decode(beams[0].output_token_ids, {
                        skip_special_tokens: true,
                    });

                    self.postMessage({ type: 'update', data: decodedText });
                } catch (e) {
                    console.error('Worker: Error in callback:', e);
                }
            };

            const output = await generator(messages, {
                max_new_tokens,
                temperature,
                do_sample: true,
                callback_function,
            });

            console.log('Worker: Generation complete');

            if (!isInterrupted) {
                const finalText = output[0].generated_text;
                // If it's an array of messages (chat format), extraction might be needed differently depending on library version
                // but usually it returns the full text or the messages. 
                // Let's assume text-generation returns the full string or array of messages.
                // For 'text-generation' task with chat input, it usually returns the new message or full conversation.
                // We'll send whatever we got.

                // If the output is a list of messages (chat template used internally?), handling might differ.
                // But normally pipeline returns valid object.

                // For now, assume simple text or messages structure
                // Logic: if output is array of objects with generated_text

                let resultText = '';
                if (Array.isArray(output) && output[0]?.generated_text) {
                    resultText = output[0].generated_text;
                    // If result is the *list* of messages (as some chat pipelines do), getting the last one:
                    if (Array.isArray(resultText)) {
                        // @ts-ignore
                        resultText = resultText[resultText.length - 1].content;
                    }
                }

                self.postMessage({ type: 'complete', data: resultText });
            } else {
                self.postMessage({ type: 'interrupted' });
            }

        } catch (error: any) {
            console.error('Worker: Generation error:', error);
            self.postMessage({ type: 'error', error: error.message });
        }
    } else if (type === 'interrupt') {
        isInterrupted = true;
        self.postMessage({ type: 'interrupted_request_received' });
    }
});
