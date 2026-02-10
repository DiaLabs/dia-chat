export interface LLMConfig {
    modelId: string;
    systemPrompt: string;
    temperature: number;
    topP: number;
    maxTokens: number;
}

export interface ModelDetails {
    id: string;
    name: string;
    version?: string;
    size?: string;
    quantization?: string;
    description: string;
    status: 'available' | 'coming_soon';
    cached?: boolean; // For UI state
}

export const MODELS: ModelDetails[] = [
    {
        id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
        name: 'Dia GenZ 1B',
        version: 'v0.1',
        size: '~1.1GB',
        quantization: 'q4f16_1',
        description: 'Fast & Efficient on-device model',
        status: 'available'
    },
    {
        id: 'dia-v1.0',
        name: 'Dia v1.0',
        description: 'Coming Soon',
        status: 'coming_soon'
    }
];

// For backward compatibility and ease of use in Settings
export const ACTIVE_MODEL = MODELS[0];

export const DEFAULT_CONFIG: LLMConfig = {
    // Llama-3.2-1B - Much faster and lightweight (~1.1GB)
    // Using q4f16_1 quantization for best balance of speed/quality on consumer hardware
    modelId: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',

    systemPrompt: `Your name is Dia and you are a warm, emotionally intelligent, Gen-Z style friend, created by DiaLabs. Respond with GenZ terms, some emojis,bit of humor, reassurance, and a calm conversational tone. Keep replies short, human, and supportive. 2 paragraphs max.`,

    temperature: 0.7, // Lower temperature for more stable, focused responses
    topP: 0.9,
    maxTokens: 1024, // Reduced max tokens to prevent runaway generation
};
