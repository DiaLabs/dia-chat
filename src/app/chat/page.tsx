'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/hooks/useChat';
import ChatInterface from '@/components/ChatInterface';
import Settings from '@/components/Settings';
import type { Chat } from '@/types';
import Logo from '@/components/Logo';
import UserAvatar from '@/components/UserAvatar';
import { Plus, MessageSquare, Trash2, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export default function ChatPage() {
 const { user, logout, loading: authLoading } = useAuth();
 const router = useRouter();
 const {
 chats,
 currentChat,
 messages,
 latestSummary,
 isLoading: chatLoading,
 createNewChat,
 selectChat,
 addMessage,
 updateMessage,
 deleteChat,
 refreshChats,
 } = useChat();

 const [settingsOpen, setSettingsOpen] = useState(false);
 const [sidebarOpen, setSidebarOpen] = useState(false);

 // Auto-create/select logic removed to ensure fresh 'New Chat' state on load
 // User will see Welcome screen until they select a chat or send a message

 // Redirect if not logged in
 useEffect(() => {
 if (!authLoading && !user) {
 router.push('/');
 }
 }, [user, authLoading, router]);

 const handleNewChat = async () => {
 await createNewChat();
 setSidebarOpen(false);
 };

 const handleSelectChat = async (chat: Chat) => {
 await selectChat(chat.id);
 setSidebarOpen(false);
 };

 const handleDeleteChat = async (chatId: string) => {
 await deleteChat(chatId);
 };

 const handleAddMessage = async (role: 'user' | 'assistant', content: string) => {
 return await addMessage(role, content);
 };

 const handleUpdateMessage = async (messageId: string, content: string) => {
 await updateMessage(messageId, content);
 };

 if (authLoading || chatLoading) {
 return (
 <div className="min-h-screen flex items-center justify-center">
 <Logo className="w-32 h-32 text-amber-500 animate-pulse" />
 </div>
 );
 }

 if (!user) {
 return null;
 }

 return (
 <div className="h-full flex overflow-hidden relative">
 {/* Grid background */}
 <div className="hero-bg" aria-hidden="true" />

 <Settings 
 isOpen={settingsOpen} 
 onClose={() => setSettingsOpen(false)} 
 onRefreshChats={refreshChats}
 />

 {/* Mobile Sidebar Overlay */}
 <AnimatePresence>
 {sidebarOpen && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setSidebarOpen(false)}
 className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm md:hidden"
 />
 )}
 </AnimatePresence>

 {/* Permanent Sidebar */}
 <aside
 className={clsx(
 'flex fixed inset-y-0 left-0 z-40 w-72 flex-col bg-white/50 backdrop-blur-xl border-r border-neutral-200/30 transition-transform duration-300 ease-in-out md:translate-x-0 md:static',
 sidebarOpen ? 'translate-x-0' : '-translate-x-full'
 )}
 >
 {/* Sidebar Header */}
 <div className="flex items-center justify-center p-6">
 <Logo className="w-8 h-8 text-[rgb(var(--primary))]" />
 </div>

 {/* New Chat Button - Pill Shaped */}
 <div className="px-4 mb-6">
 <button
 onClick={handleNewChat}
 className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-linear-to-r from-[rgb(var(--primary))] to-[rgb(var(--primary-hover))] hover:from-[rgb(var(--primary-hover))] hover:to-[rgb(var(--primary-hover))] text-neutral-900 font-semibold transition-colors"
 >
 <Plus className="w-5 h-5" />
 New Chat
 </button>
 </div>

 {/* Chats List */}
 <div className="flex-1 overflow-y-auto px-4 pb-4">
 <div className="mb-3">
 <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-3">
 Recent Chats
 </h3>
 </div>
 {chats.length === 0 ? (
 <div className="text-center py-8 px-4">
 <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
 <p className="text-sm text-neutral-500 ">
 No chats yet. Start a new conversation!
 </p>
 </div>
 ) : (
 <div className="space-y-2">
 <AnimatePresence>
 {chats.map((chat, index) => (
 <motion.div
 key={chat.id}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 transition={{ delay: index * 0.05 }}
 className="group relative"
 >
 <button
 onClick={() => handleSelectChat(chat)}
 className={clsx(
 'w-full flex items-center gap-3 px-4 py-3 rounded-full text-left transition-all duration-200',
 currentChat?.id === chat.id
 ? 'bg-[rgb(var(--primary))]/10 text-neutral-900 shadow-sm ring-1 ring-[rgb(var(--primary))]/30 '
 : 'hover:bg-neutral-100/80 text-neutral-700 '
 )}
 >
 <MessageSquare
 className={clsx(
 'w-4 h-4 mt-0.5 shrink-0',
 currentChat?.id === chat.id
 ? 'text-[rgb(var(--primary-hover))] '
 : 'text-neutral-400'
 )}
 />
 <span className="text-sm font-medium line-clamp-1 flex-1 pr-6">
 {chat.title}
 </span>
 </button>
 <button
 onClick={(e: React.MouseEvent) => {
 e.stopPropagation();
 handleDeleteChat(chat.id);
 }}
 className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full opacity-0 group-hover:opacity-100 bg-white hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-all shadow-sm ring-1 ring-neutral-200 hover:ring-red-200 "
 >
 <Trash2 className="w-3.5 h-3.5" />
 </button>
 </motion.div>
 ))}
 </AnimatePresence>
 </div>
 )}
 </div>

 {/* User Profile & Actions */}
 <div className="p-4 border-t border-neutral-200/50 space-y-3">
 {/* User Info Card */}
 <div className="flex items-center gap-3 px-4 py-3 rounded-full bg-linear-to-br from-neutral-50 to-neutral-100/50 border border-neutral-200/50 ">
 <UserAvatar user={user} size="md" showRing />
 <div className="flex-1 min-w-0">
 <p className="text-sm font-semibold text-neutral-900 truncate">
 {user?.displayName || 'User'}
 </p>
 <p className="text-xs text-neutral-500 truncate">
 {user?.email}
 </p>
 </div>
 </div>

 {/* Action Buttons - Pill Shaped */}
 <div className="grid grid-cols-2 gap-2">
 <button
 onClick={() => setSettingsOpen(true)}
 className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-neutral-700 bg-neutral-100/80 hover:bg-neutral-200 transition-colors"
 >
 <SettingsIcon className="w-4 h-4" />
 Settings
 </button>
 <button
 onClick={logout}
 className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium text-neutral-700 bg-neutral-100/80 hover:bg-red-50 hover:text-red-600 hover:ring-1 hover:ring-red-200 transition-all"
 >
 <LogOut className="w-4 h-4" />
 Sign out
 </button>
 </div>
 </div>
 </aside>

 {/* Main chat interface */}
 <main className="flex-1 flex flex-col min-w-0 relative z-10">
 <ChatInterface
 messages={messages}
 latestSummary={latestSummary?.content || null}
 onAddMessage={handleAddMessage}
 onUpdateMessage={handleUpdateMessage}
 onToggleSidebar={() => setSidebarOpen(true)}
 />
 </main>
 </div>
 );
}
