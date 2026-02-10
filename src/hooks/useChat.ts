'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { IndexedDBService } from '@/services/IndexedDBService';
import { OpenRouterService } from '@/services/OpenRouterService';
import type { Chat, Message, Summary } from '@/types';

interface UseChatResult {
    chats: Chat[];
    currentChat: Chat | null;
    messages: Message[];
    latestSummary: Summary | null;
    isLoading: boolean;
    createNewChat: () => Promise<void>;
    selectChat: (chatId: string) => Promise<void>;
    addMessage: (role: 'user' | 'assistant', content: string) => Promise<Message>;
    updateMessage: (messageId: string, content: string) => Promise<void>;
    deleteChat: (chatId: string) => Promise<void>;
    refreshChats: () => Promise<void>;
}

const SUMMARIZE_THRESHOLD = 10;

export function useChat(): UseChatResult {
    const { user } = useAuth();
    const [chats, setChats] = useState<Chat[]>([]);
    const [currentChat, setCurrentChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [latestSummary, setLatestSummary] = useState<Summary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const dbService = useRef(IndexedDBService.getInstance());
    const openRouterService = useRef(OpenRouterService.getInstance());
    const initialized = useRef(false);
    const activeChatRef = useRef<Chat | null>(null);

    // Keep ref in sync with state
    useEffect(() => {
        activeChatRef.current = currentChat;
    }, [currentChat]);

    // Initialize database and load user data
    useEffect(() => {
        if (!user || initialized.current) return;

        const init = async () => {
            try {
                setIsLoading(true);
                await dbService.current.init();

                // Ensure user exists in DB
                const existingUser = await dbService.current.getUser(user.uid);
                if (!existingUser) {
                    await dbService.current.saveUser({
                        uid: user.uid,
                        email: user.email || '',
                        displayName: user.displayName || 'User',
                        photoURL: user.photoURL,
                        createdAt: Date.now(),
                        lastActiveAt: Date.now(),
                    });
                } else {
                    await dbService.current.updateUserLastActive(user.uid);
                }

                // Load user's chats
                const userChats = await dbService.current.getUserChats(user.uid);
                setChats(userChats);

                initialized.current = true;
            } catch (error) {
                console.error('Failed to initialize chat:', error);
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [user]);

    // Reset state when user changes
    useEffect(() => {
        if (!user) {
            setChats([]);
            setCurrentChat(null);
            setMessages([]);
            setLatestSummary(null);
            initialized.current = false;
        }
    }, [user]);

    const refreshChats = useCallback(async () => {
        if (!user) return;
        const userChats = await dbService.current.getUserChats(user.uid);
        setChats(userChats);

        // If current chat is not in the new list (e.g. deleted), reset state
        if (currentChat && !userChats.find(c => c.id === currentChat.id)) {
            setCurrentChat(null);
            activeChatRef.current = null;
            setMessages([]);
            setLatestSummary(null);
        }
    }, [user, currentChat]);

    const createNewChat = useCallback(async (): Promise<void> => {
        if (!user) throw new Error('User not authenticated');

        setCurrentChat(null);
        activeChatRef.current = null;
        setMessages([]);
        setLatestSummary(null);
    }, [user]);

    const selectChat = useCallback(async (chatId: string) => {
        const chat = await dbService.current.getChat(chatId);
        if (!chat) {
            console.error('Chat not found:', chatId);
            return;
        }

        // Update last visited
        await dbService.current.updateChatLastVisited(chatId);
        chat.lastVisitedAt = Date.now();

        // Load messages
        const chatMessages = await dbService.current.getChatMessages(chatId);

        // Load latest summary
        const summary = await dbService.current.getLatestSummary(chatId);

        setCurrentChat(chat);
        activeChatRef.current = chat;
        setMessages(chatMessages);
        setLatestSummary(summary || null);
    }, []);

    const addMessage = useCallback(
        async (role: 'user' | 'assistant', content: string): Promise<Message> => {
            if (!user) throw new Error('User not authenticated');

            // Use ref to get the absolute latest chat state, handling rapid sequential calls
            let targetChat = activeChatRef.current;
            let isNewChat = false;

            // If no active chat, create one now (Ghost chat handling)
            if (!targetChat) {
                targetChat = {
                    id: crypto.randomUUID(),
                    userId: user.uid,
                    title: role === 'user' ? content.slice(0, 50) + (content.length > 50 ? '...' : '') : 'New Chat',
                    createdAt: Date.now(),
                    lastVisitedAt: Date.now(),
                    messageCount: 0,
                };
                isNewChat = true;
                // Immediately update ref so subsequent calls (like assistant response) see this chat
                activeChatRef.current = targetChat;
            }

            const message: Message = {
                id: crypto.randomUUID(),
                chatId: targetChat.id,
                role,
                content,
                timestamp: Date.now(),
            };

            // Save message to DB
            await dbService.current.saveMessage(message);

            // Update local state
            setMessages((prev) => [...prev, message]);

            // Update chat metadata
            const updatedChat: Chat = {
                ...targetChat,
                messageCount: targetChat.messageCount + 1,
                lastVisitedAt: Date.now(),
                // Set title from first user message if creation didn't catch it (e.g. creating via assistant message?)
                // Or if it was New Chat
                title:
                    (targetChat.messageCount === 0 && role === 'user')
                        ? content.slice(0, 50) + (content.length > 50 ? '...' : '')
                        : targetChat.title,
            };

            await dbService.current.saveChat(updatedChat);
            setCurrentChat(updatedChat);
            activeChatRef.current = updatedChat;

            // Update chats list
            setChats((prev) => {
                const filtered = prev.filter((c) => c.id !== updatedChat.id);
                return [updatedChat, ...filtered];
            });

            // Check if we need to summarize (every SUMMARIZE_THRESHOLD messages)
            if (updatedChat.messageCount % SUMMARIZE_THRESHOLD === 0 && updatedChat.messageCount > 0) {
                // Summarize in background - don't await
                summarizeChat(updatedChat.id, updatedChat.messageCount);
            }

            // Generate/update chat title at strategic points
            // - After 3 messages (initial title based on early conversation)
            // - Every 5 messages after that (to keep title relevant as conversation evolves)
            if (updatedChat.messageCount === 3 || (updatedChat.messageCount > 3 && updatedChat.messageCount % 5 === 0)) {
                // Update title in background - don't await
                updateChatTitle(updatedChat.id);
            }

            return message;
        },
        [user] // Removing currentChat dependency as we use ref
    );

    const updateChatTitle = async (chatId: string) => {
        try {
            const chatMessages = await dbService.current.getChatMessages(chatId);

            // Use last 6 messages for title generation (more recent context)
            const recentMessages = chatMessages.slice(-6).map((m) => ({
                role: m.role,
                content: m.content,
            }));

            if (recentMessages.length === 0) return;

            const newTitle = await openRouterService.current.generateChatTitle(recentMessages);

            // Update chat title in DB
            const chat = await dbService.current.getChat(chatId);
            if (chat) {
                const updatedChat = { ...chat, title: newTitle };
                await dbService.current.saveChat(updatedChat);

                // Update local state
                setCurrentChat((prev) => prev?.id === chatId ? updatedChat : prev);
                setChats((prev) =>
                    prev.map((c) => (c.id === chatId ? updatedChat : c))
                );

                console.log(`Chat title updated: "${newTitle}"`);
            }
        } catch (error) {
            console.error('Failed to update chat title:', error);
            // Don't throw - title generation is non-critical
        }
    };

    const summarizeChat = async (chatId: string, messageCount: number) => {
        try {
            const chatMessages = await dbService.current.getChatMessages(chatId);
            const existingSummary = await dbService.current.getLatestSummary(chatId);

            // Get last 10 messages for summarization
            const last10Messages = chatMessages.slice(-SUMMARIZE_THRESHOLD);
            const messagesToSummarize = last10Messages.map((m) => ({
                role: m.role,
                content: m.content,
            }));

            let summaryContent: string;

            if (!existingSummary) {
                // First summary
                summaryContent = await openRouterService.current.summarize(messagesToSummarize);
            } else {
                // Merge with previous summary
                summaryContent = await openRouterService.current.mergeSummary(
                    existingSummary.content,
                    messagesToSummarize
                );
            }

            // Save new summary
            const newSummary: Summary = {
                id: crypto.randomUUID(),
                chatId,
                messageRange: {
                    start: existingSummary ? existingSummary.messageRange.end + 1 : 1,
                    end: messageCount,
                },
                content: summaryContent,
                createdAt: Date.now(),
            };

            await dbService.current.saveSummary(newSummary);
            setLatestSummary(newSummary);

            console.log('Chat summarized successfully:', newSummary);
        } catch (error) {
            console.error('Failed to summarize chat:', error);
            // Don't throw - summarization is non-critical
        }
    };

    const updateMessage = useCallback(
        async (messageId: string, content: string) => {


            // Use functional update to get the latest messages
            setMessages((prevMessages) => {
                const message = prevMessages.find((m) => m.id === messageId);
                if (!message) {
                    console.warn('updateMessage: Message not found:', messageId);
                    console.log('Available message IDs:', prevMessages.map(m => m.id));
                    return prevMessages;
                }

                const updatedMessage = { ...message, content };

                // Save to DB asynchronously (don't await to avoid blocking UI)
                dbService.current.saveMessage(updatedMessage);

                return prevMessages.map((m) => (m.id === messageId ? updatedMessage : m));
            });
        },
        [] // No dependencies needed with functional update
    );

    const deleteChat = useCallback(
        async (chatId: string) => {
            await dbService.current.deleteChat(chatId);
            setChats((prev) => prev.filter((c) => c.id !== chatId));

            if (currentChat?.id === chatId) {
                setCurrentChat(null);
                activeChatRef.current = null;
                setMessages([]);
                setLatestSummary(null);
            }
        },
        [currentChat]
    );

    return {
        chats,
        currentChat,
        messages,
        latestSummary,
        isLoading,
        createNewChat,
        selectChat,
        addMessage,
        updateMessage,
        deleteChat,
        refreshChats,
    };
}
