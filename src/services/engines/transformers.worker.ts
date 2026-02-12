
import { pipeline, env } from '@huggingface/transformers';

// Configuration to force browser cache usage and remote models
env.allowLocalModels = false;
env.useBrowserCache = true;

// Singleton to hold the pipeline instance
class PipelineSingleton {
    static task = 'text-generation';
    static model = 'onnx-community/Llama-3.2-1B-Instruct';
    static instance: any = null;

    static async getInstance(progress_callback: any = null) {
        if (this.instance === null) {
            this.instance = await pipeline(this.task, this.model, {
                dtype: 'q4', // 4-bit quantization
                device: 'wasm',
                progress_callback,
            } as any);
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
            const { messages, max_new_tokens = 1024, temperature = 0.7 } = data;

            const generator = await PipelineSingleton.getInstance();
            isInterrupted = false;

            // Simple stopping criteria using callback
            const callback_function = (beams: any[]) => {
                if (isInterrupted) {
                    // Start stopping generation by returning true or manipulating beams if supported
                    // Transformers.js allows returning `true` to stop generation in many versions.
                    return true;
                }

                // Decode the current output to send updates
                const decodedText = generator.tokenizer.decode(beams[0].output_token_ids, {
                    skip_special_tokens: true,
                });

                self.postMessage({ type: 'update', data: decodedText });
            };

            const output = await generator(messages, {
                max_new_tokens,
                temperature,
                do_sample: true,
                callback_function,
            });

            if (!isInterrupted) {
                self.postMessage({ type: 'complete', data: output[0].generated_text });
            } else {
                self.postMessage({ type: 'interrupted' });
            }

        } catch (error: any) {
            self.postMessage({ type: 'error', error: error.message });
        }
    } else if (type === 'interrupt') {
        isInterrupted = true;
        self.postMessage({ type: 'interrupted_request_received' });
    }
});
