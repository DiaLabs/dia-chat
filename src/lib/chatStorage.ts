/**
 * Legacy chat storage using localStorage
 * NOTE: This file is kept for backwards compatibility but is no longer used.
 * The application now uses IndexedDB via IndexedDBService for chat storage.
 * @deprecated Use IndexedDBService instead
 */

// Legacy Chat type for backwards compatibility with localStorage data
interface LegacyChat {
    id: string;
    title: string;
    messages: LegacyMessage[];
    createdAt: number;
    updatedAt: number;
}

interface LegacyMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

const CHATS_KEY = 'dia-chats';

export function getChats(): LegacyChat[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(CHATS_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function saveChat(chat: LegacyChat): void {
    const chats = getChats();
    const index = chats.findIndex((c) => c.id === chat.id);
    if (index >= 0) {
        chats[index] = chat;
    } else {
        chats.unshift(chat);
    }
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

export function deleteChat(chatId: string): void {
    const chats = getChats().filter((c) => c.id !== chatId);
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
}

export function createNewChat(): LegacyChat {
    return {
        id: crypto.randomUUID(),
        title: 'New Chat',
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
}

export function generateChatTitle(messages: LegacyMessage[]): string {
    const firstUserMessage = messages.find((m) => m.role === 'user');
    if (firstUserMessage) {
        const title = firstUserMessage.content.slice(0, 30);
        return title.length < firstUserMessage.content.length ? title + '...' : title;
    }
    return 'New Chat';
}
