// TypeScript types for Dia Chat

export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface Chat {
    id: string;
    title: string;
    messages: Message[];
    createdAt: number;
    updatedAt: number;
}

export type Theme = 'system' | 'light' | 'dark';
export type AccentColor = 'yellow' | 'blue' | 'green' | 'pink' | 'orange';
export type FontSize = 'small' | 'medium' | 'large';
