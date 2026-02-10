
import { Message } from '@/types';

interface OpenRouterRequest {
    model: string;
    messages: Array<{ role: string; content: string }>;
    stream?: boolean;
}

interface OpenRouterResponse {
    choices: Array<{
        message?: { content: string };
        delta?: { content: string };
        finish_reason: string;
    }>;
}

export class OpenRouterService {
    private static instance: OpenRouterService;
    private apiKey: string;
    // Use the free model as requested
    private model = "google/gemma-3-12b-it:free";
    private baseUrl = "https://openrouter.ai/api/v1/chat/completions";

    private constructor() {
        const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_GEMMA_3_12B_API_KEY;
        if (!apiKey) {
            console.warn('OpenRouter API key is missing. Check .env.local');
        }
        this.apiKey = apiKey || '';
    }

    static getInstance(): OpenRouterService {
        if (!OpenRouterService.instance) {
            OpenRouterService.instance = new OpenRouterService();
        }
        return OpenRouterService.instance;
    }

    private async callOpenRouter(messages: Array<{ role: string; content: string }>): Promise<string> {
        if (!this.apiKey) {
            throw new Error('OpenRouter API key is missing');
        }

        try {
            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
                    'X-Title': 'Dia Chat',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    stream: false
                } as OpenRouterRequest)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json() as OpenRouterResponse;
            const content = data.choices[0]?.message?.content;

            if (!content) {
                throw new Error('Empty response from OpenRouter');
            }

            return content.trim();
        } catch (error) {
            console.error('Failed to call OpenRouter:', error);
            throw error;
        }
    }

    private formatMessagesForPrompt(messages: any[]): string {
        return messages
            .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
            .join('\n');
    }

    async summarize(messages: Array<{ role: string; content: string }>): Promise<string> {
        const prompt = `You are a conversation summarizer. Summarize the following conversation concisely, capturing:
- Key topics discussed
- User's emotional state and concerns
- Important context and facts mentioned
- Any requests or preferences expressed

Conversation:
${this.formatMessagesForPrompt(messages)}

Provide a concise summary (max 2 paragraphs) that would help an AI assistant understand this conversation's context.`;

        return this.callOpenRouter([{ role: 'user', content: prompt }]);
    }

    async mergeSummary(oldSummary: string, newMessages: Array<{ role: string; content: string }>): Promise<string> {
        const prompt = `You are a conversation summarizer. Merge the previous summary with the new messages into a single, comprehensive summary.

Previous conversation summary:
${oldSummary}

New messages:
${this.formatMessagesForPrompt(newMessages)}

Create a concise, comprehensive summary that captures all key points, emotions, topics discussed, and important context from both the previous summary and the new messages. The summary should help an AI assistant understand the full conversation history.`;

        return this.callOpenRouter([{ role: 'user', content: prompt }]);
    }

    async generateChatTitle(messages: Array<{ role: string; content: string }>): Promise<string> {
        // Fallback for very short conversations
        if (!messages || messages.length === 0) return 'New Chat';
        if (messages.length === 1) {
            const content = messages[0].content;
            return content.slice(0, 40) + (content.length > 40 ? '...' : '');
        }

        const prompt = `Based on this conversation, create a short, descriptive title (3-6 words maximum).
Rules:
1. Focus on the main topic or request.
2. Be specific but concise.
3. No quotes, no "Title:" prefix, no punctuation.
4. Just the raw title text.

Conversation:
${this.formatMessagesForPrompt(messages)}

Examples:
- Career Change Advice
- Dealing with Anxiety
- Weekend Food Plans
- Recipe Ideas Discussion`;

        try {
            const title = await this.callOpenRouter([{ role: 'user', content: prompt }]);

            // Clean up
            return title
                .replace(/^(Title:|Here is a title:|Sure,|Okay,)/i, '')
                .replace(/["'`]/g, '')
                .replace(/[.!?]+$/g, '')
                .trim()
                .slice(0, 60) || 'Chat';
        } catch (error) {
            console.error('Title generation failed, using fallback');
            const firstUserMsg = messages.find(m => m.role === 'user');
            if (firstUserMsg) {
                const content = firstUserMsg.content;
                return content.slice(0, 40) + (content.length > 40 ? '...' : '');
            }
            return 'New Chat';
        }
    }
}
