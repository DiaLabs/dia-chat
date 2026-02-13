import { pipeline, env } from '@huggingface/transformers';

// Hack to fix TS errors with web worker types
const ctx: any = self;

// Only log critical startup info
console.log('Transformers worker script loaded.');

// Global error handlers
ctx.onerror = (event: any, source?: string, lineno?: number, colno?: number, error?: Error) => {
    console.error('Worker global error:', event, error);
    ctx.postMessage({
        type: 'error',
        error: error ? error.message : (typeof event === 'string' ? event : 'Unknown worker error')
    });
};

ctx.onunhandledrejection = (event: any) => {
    console.error('Worker unhandled rejection:', event.reason);
    ctx.postMessage({
        type: 'error',
        error: event.reason instanceof Error ? event.reason.message : 'Unhandled rejection in worker'
    });
};

// Configuration to force browser cache usage and remote models
env.allowLocalModels = false;
env.useBrowserCache = true;
// EXTREMELY IMPORTANT: Set the path to the WASM file via CDN to avoid bundler issues
// Using version 1.20.1 - known stable version for Transformers.js v3
env.backends.onnx.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.20.1/dist/';
// Disable multi-threading to avoid blob worker issues without COEP headers
// Use max available threads for best CPU performance
// If navigator.hardwareConcurrency is available, use it. Otherwise default to 4.
const maxThreads = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : 4;
env.backends.onnx.wasm.numThreads = maxThreads;
env.backends.onnx.wasm.proxy = true;

// Singleton to hold the pipeline instance
class PipelineSingleton {
    static task = 'text-generation';
    static model = 'onnx-community/Llama-3.2-1B-Instruct-q4f16';
    static instance: any = null;

    static async getInstance(progress_callback: any = null) {
        if (this.instance === null) {
            try {
                // console.log('Worker: Creating pipeline...'); // Verbose
                this.instance = await pipeline(this.task, this.model, {
                    dtype: 'q4', // 4-bit quantization
                    device: 'wasm',
                    progress_callback,
                } as any);
                console.log('Worker: Pipeline initialized.');
            } catch (err: any) {
                console.error('Worker: Pipeline creation failed:', err);
                throw err;
            }
        }
        return this.instance;
    }
}

let isInterrupted = false;

ctx.addEventListener('message', async (event: MessageEvent) => {
    const { type, data } = event.data;

    if (type === 'init') {
        try {
            await PipelineSingleton.getInstance((progress: any) => {
                ctx.postMessage({ type: 'progress', data: progress });
            });
            ctx.postMessage({ type: 'ready' });
        } catch (error: any) {
            ctx.postMessage({ type: 'error', error: error.message });
        }
    } else if (type === 'generate') {
        try {
            // console.log('Worker: Received generate request'); // Verbose
            const { messages, max_new_tokens = 1024, temperature = 0.7 } = data;
            // console.log('Worker: Messages:', JSON.stringify(messages));

            const generator = await PipelineSingleton.getInstance();
            isInterrupted = false;

            // Apply chat template silently
            let prompt = messages;

            // If the model supports chat templates, apply it. Most instruct models do.
            if (generator.tokenizer && generator.tokenizer.chat_template) {
                prompt = generator.tokenizer.apply_chat_template(messages, {
                    tokenize: false,
                    add_generation_prompt: true,
                });
            } else {
                // console.warn('Worker: No chat template found, using raw messages (might fail)'); // Verbose
            }

            // console.log('Worker: Starting generation with max_new_tokens:', max_new_tokens); // Verbose

            // Simple stopping criteria using callback
            const callback_function = (beams: any[]) => {
                if (isInterrupted) return true;

                try {
                    // Decode the current output to send updates
                    const decodedText = generator.tokenizer.decode(beams[0].output_token_ids, {
                        skip_special_tokens: true,
                    });

                    ctx.postMessage({ type: 'update', data: decodedText });
                } catch (e) {
                    // console.error('Worker: Error in callback:', e); // Silent catch
                }
            };

            const output = await generator(prompt, {
                max_new_tokens,
                temperature,
                do_sample: true,
                callback_function,
            });

            // console.log('Worker: Generation complete'); // Verbose

            if (!isInterrupted) {
                let resultText = '';
                // Handle different output formats
                if (Array.isArray(output)) {
                    const lastItem = output[output.length - 1];
                    if (typeof lastItem === 'object' && lastItem.generated_text) {
                        resultText = lastItem.generated_text;
                    } else if (typeof lastItem === 'string') {
                        resultText = lastItem;
                    }
                } else if (typeof output === 'object' && output.generated_text) {
                    resultText = output.generated_text;
                }

                ctx.postMessage({ type: 'complete', data: resultText });
            } else {
                ctx.postMessage({ type: 'interrupted' });
            }

        } catch (error: any) {
            console.error('Worker: Generation error:', error);
            ctx.postMessage({ type: 'error', error: error.message });
        }
    } else if (type === 'interrupt') {
        isInterrupted = true;
        ctx.postMessage({ type: 'interrupted_request_received' });
    }
});
