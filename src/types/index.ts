// Types for IndexedDB storage

// User stored in IndexedDB (includes persistence fields)
export interface User {
    uid: string;              // Firebase UID (primary key)
    email: string;
    displayName: string;
    photoURL: string | null;
    createdAt: number;
    lastActiveAt: number;
}

// Simplified User for Firebase Auth context (no persistence fields)
export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export interface Chat {
    id: string;               // UUID (primary key)
    userId: string;           // Foreign key to users.uid
    title: string;            // Auto-generated from first message
    createdAt: number;
    lastVisitedAt: number;    // For sorting in sidebar
    messageCount: number;
}

export interface Message {
    id: string;               // UUID (primary key)
    chatId: string;           // Foreign key to chats.id
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export interface Summary {
    id: string;               // UUID (primary key)
    chatId: string;           // Foreign key to chats.id
    messageRange: {
        start: number;          // Message count start
        end: number;            // Message count end
    };
    content: string;          // Summarized text
    createdAt: number;
}

// UI Settings types
export type Theme = 'light' | 'dark' | 'system';
export type AccentColor = 'yellow' | 'blue' | 'green' | 'pink' | 'orange';
export type FontSize = 'small' | 'medium' | 'large';
