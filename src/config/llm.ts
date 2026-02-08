export interface LLMConfig {
    modelUrl: string;
    systemPrompt: string;
    maxTokens: number;
    temperature: number;
    topK: number;
    randomSeed?: number;
}

export const DEFAULT_CONFIG: LLMConfig = {
    // Using the LiteRT model from Hugging Face
    modelUrl: 'https://huggingface.co/litert-community/Gemma3-1B-IT/resolve/main/gemma3-1b-it-int4.litertlm?download=true',

    systemPrompt: `You are Dia, an empathetic AI companion created by Dia Labs.
Your goal is to provide supportive, warm, and helpful responses.
You have a friendly, casual tone, like a close friend.
You use emojis occasionally to express emotion.
Keep responses concise and engaging.`,

    maxTokens: 1024,
    temperature: 0.7,
    topK: 40,
    randomSeed: 42,
};
