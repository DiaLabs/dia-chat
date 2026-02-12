
// Type definitions for WebGPU
// Expanded to cover basic usage in LLMService

interface Navigator {
    readonly gpu?: GPU;
}

interface GPU {
    requestAdapter(options?: GPURequestAdapterOptions): Promise<GPUAdapter | null>;
}

interface GPUAdapter {
    readonly features: GPUSupportedFeatures;
    readonly limits: GPUSupportedLimits;
    readonly isFallbackAdapter: boolean;
}

interface GPURequestAdapterOptions {
    powerPreference?: GPUPowerPreference;
    forceFallbackAdapter?: boolean;
}

type GPUPowerPreference = 'low-power' | 'high-performance';

interface GPUSupportedFeatures {
    has(feature: string): boolean;
}

interface GPUSupportedLimits {
    [key: string]: number;
}
