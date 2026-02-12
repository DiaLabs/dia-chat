
declare module '@huggingface/transformers' {
    export interface PipelineOptions {
        quantized?: boolean;
        progress_callback?: (data: any) => void;
        device?: string;
        revision?: string;
    }

    export function pipeline(
        task: string,
        model: string,
        options?: PipelineOptions
    ): Promise<any>;

    export const env: {
        allowLocalModels: boolean;
        useBrowserCache: boolean;
        [key: string]: any;
    };
}
