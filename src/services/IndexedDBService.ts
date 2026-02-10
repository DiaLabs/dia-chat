import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { User, Chat, Message, Summary } from '@/types';

interface DiaChatDB extends DBSchema {
    users: {
        key: string;
        value: User;
    };
    chats: {
        key: string;
        value: Chat;
        indexes: { 'userId': string; 'lastVisitedAt': number };
    };
    messages: {
        key: string;
        value: Message;
        indexes: { 'chatId': string; 'timestamp': number };
    };
    summaries: {
        key: string;
        value: Summary;
        indexes: { 'chatId': string };
    };
}

const DB_NAME = 'dia-chat-db';
const DB_VERSION = 1;

export class IndexedDBService {
    private static instance: IndexedDBService;
    private db: IDBPDatabase<DiaChatDB> | null = null;
    private initPromise: Promise<void> | null = null;

    private constructor() { }

    static getInstance(): IndexedDBService {
        if (!IndexedDBService.instance) {
            IndexedDBService.instance = new IndexedDBService();
        }
        return IndexedDBService.instance;
    }

    async init(): Promise<void> {
        if (this.db) return;
        if (this.initPromise) return this.initPromise;

        this.initPromise = this.initDB();
        return this.initPromise;
    }

    private async initDB(): Promise<void> {
        this.db = await openDB<DiaChatDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // Users store
                if (!db.objectStoreNames.contains('users')) {
                    db.createObjectStore('users', { keyPath: 'uid' });
                }

                // Chats store
                if (!db.objectStoreNames.contains('chats')) {
                    const chatsStore = db.createObjectStore('chats', { keyPath: 'id' });
                    chatsStore.createIndex('userId', 'userId');
                    chatsStore.createIndex('lastVisitedAt', 'lastVisitedAt');
                }

                // Messages store
                if (!db.objectStoreNames.contains('messages')) {
                    const messagesStore = db.createObjectStore('messages', { keyPath: 'id' });
                    messagesStore.createIndex('chatId', 'chatId');
                    messagesStore.createIndex('timestamp', 'timestamp');
                }

                // Summaries store
                if (!db.objectStoreNames.contains('summaries')) {
                    const summariesStore = db.createObjectStore('summaries', { keyPath: 'id' });
                    summariesStore.createIndex('chatId', 'chatId');
                }
            },
        });
    }

    private ensureDB(): IDBPDatabase<DiaChatDB> {
        if (!this.db) {
            throw new Error('Database not initialized. Call init() first.');
        }
        return this.db;
    }

    // ==================== User Operations ====================

    async getUser(uid: string): Promise<User | undefined> {
        const db = this.ensureDB();
        return db.get('users', uid);
    }

    async saveUser(user: User): Promise<void> {
        const db = this.ensureDB();
        await db.put('users', user);
    }

    async updateUserLastActive(uid: string): Promise<void> {
        const db = this.ensureDB();
        const user = await db.get('users', uid);
        if (user) {
            user.lastActiveAt = Date.now();
            await db.put('users', user);
        }
    }

    // ==================== Chat Operations ====================

    async getUserChats(userId: string): Promise<Chat[]> {
        const db = this.ensureDB();
        const chats = await db.getAllFromIndex('chats', 'userId', userId);
        return chats.sort((a, b) => b.lastVisitedAt - a.lastVisitedAt);
    }

    async getAllChats(): Promise<Chat[]> {
        const db = this.ensureDB();
        return db.getAll('chats');
    }

    async getChat(chatId: string): Promise<Chat | undefined> {
        const db = this.ensureDB();
        return db.get('chats', chatId);
    }

    async saveChat(chat: Chat): Promise<void> {
        const db = this.ensureDB();
        await db.put('chats', chat);
    }

    async updateChatLastVisited(chatId: string): Promise<void> {
        const db = this.ensureDB();
        const chat = await db.get('chats', chatId);
        if (chat) {
            chat.lastVisitedAt = Date.now();
            await db.put('chats', chat);
        }
    }

    async deleteChat(chatId: string): Promise<void> {
        const db = this.ensureDB();

        // Delete chat
        await db.delete('chats', chatId);

        // Delete all messages for this chat
        const messages = await db.getAllFromIndex('messages', 'chatId', chatId);
        const tx1 = db.transaction('messages', 'readwrite');
        await Promise.all([
            ...messages.map(msg => tx1.store.delete(msg.id)),
            tx1.done
        ]);

        // Delete all summaries for this chat
        const summaries = await db.getAllFromIndex('summaries', 'chatId', chatId);
        const tx2 = db.transaction('summaries', 'readwrite');
        await Promise.all([
            ...summaries.map(sum => tx2.store.delete(sum.id)),
            tx2.done
        ]);
    }

    // ==================== Message Operations ====================

    async getChatMessages(chatId: string): Promise<Message[]> {
        const db = this.ensureDB();
        const messages = await db.getAllFromIndex('messages', 'chatId', chatId);
        return messages.sort((a, b) => a.timestamp - b.timestamp);
    }

    async saveMessage(message: Message): Promise<void> {
        const db = this.ensureDB();
        await db.put('messages', message);
    }

    async getMessageCount(chatId: string): Promise<number> {
        const db = this.ensureDB();
        const messages = await db.getAllFromIndex('messages', 'chatId', chatId);
        return messages.length;
    }

    // ==================== Summary Operations ====================

    async getLatestSummary(chatId: string): Promise<Summary | undefined> {
        const db = this.ensureDB();
        const summaries = await db.getAllFromIndex('summaries', 'chatId', chatId);
        if (summaries.length === 0) return undefined;
        return summaries.sort((a, b) => b.createdAt - a.createdAt)[0];
    }

    async saveSummary(summary: Summary): Promise<void> {
        const db = this.ensureDB();
        await db.put('summaries', summary);
    }

    async getChatSummaries(chatId: string): Promise<Summary[]> {
        const db = this.ensureDB();
        const summaries = await db.getAllFromIndex('summaries', 'chatId', chatId);
        return summaries.sort((a, b) => a.createdAt - b.createdAt);
    }

    // ==================== Utility ====================

    async clearAllData(): Promise<void> {
        const db = this.ensureDB();
        await db.clear('users');
        await db.clear('chats');
        await db.clear('messages');
        await db.clear('summaries');
    }
}
