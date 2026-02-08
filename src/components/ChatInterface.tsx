'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Menu as MenuIcon, Cpu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLLM } from '@/hooks/useLLM';
import Logo from './Logo';
import ModelSelector from './ModelSelector';
import type { Chat, Message } from '@/types';
import clsx from 'clsx';
import { useAppSettings } from '@/context/AppSettingsContext';
import ConsentModal from './ConsentModal';

interface ChatInterfaceProps {
  chat: Chat | null;
  onUpdateMessages: (messages: Message[]) => void;
  onToggleSidebar: () => void;
}

export default function ChatInterface({
  chat,
  onUpdateMessages,
  onToggleSidebar,
}: ChatInterfaceProps) {
  // Integrate LLM Hook
  const { 
    isReady: isModelReady, 
    isLoading: isModelLoading, 
    progress: modelProgress, 
    initialize: initializeModel, 
    sendMessage,
    error: modelError,
    cancelDownload
  } = useLLM();

  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false); // Local sending state
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { cacheDuration } = useAppSettings();
  const [showConsent, setShowConsent] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const { checkCache } = useLLM();

  // Check cache on mount
  useEffect(() => {
    let mounted = true;
    
    const checkModelCache = async () => {
      // If already ready, don't check
      if (isModelReady) {
        setInitialCheckDone(true);
        return;
      }

      // Check if we have valid cache
      const hasCache = await checkCache(cacheDuration);
      
      if (mounted) {
        if (hasCache) {
          // If cached, initialize silently
          initializeModel();
        } else {
          // If not cached, show consent
          setShowConsent(true);
        }
        setInitialCheckDone(true);
      }
    };

    checkModelCache();

    return () => { mounted = false; };
  }, [cacheDuration, checkCache, initializeModel, isModelReady]);

  const handleConsentConfirm = () => {
    setShowConsent(false);
    initializeModel();
  };

  const handleConsentCancel = () => {
    setShowConsent(false);
    // Optional: Show a message that model is required
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  const handleSendMessage = async (contentOverride?: string) => {
    const textToSend = contentOverride || input;
    if (!textToSend.trim() || isSending || !isModelReady || !chat) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: textToSend.trim(),
      timestamp: Date.now(),
    };

    // 1. Add User Message immediately
    const newMessages = [...(chat.messages || []), userMessage];
    onUpdateMessages(newMessages);
    setInput('');
    setIsSending(true);

    try {
      // 2. Add placeholder assistant message (empty content)
      const assistantMessageId = crypto.randomUUID();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '', 
        timestamp: Date.now(),
      };
      
      const messagesWithAssistant = [...newMessages, assistantMessage];
      onUpdateMessages(messagesWithAssistant);

      // 3. Stream response
      let fullResponse = '';
      await sendMessage(userMessage.content, (token) => {
        fullResponse += token;
        
        // Update the last message (assistant) with accumulated text
        const updatedMessages = [...newMessages, {
            ...assistantMessage,
            content: fullResponse
        }];
        onUpdateMessages(updatedMessages);
      });

    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };



  const getPlaceholderResponse = (userInput: string): string => {
    const responses = [
      "I hear you. It sounds like you're going through something, and I'm here to listen. What's on your mind?",
      "That's really valid. Sometimes it helps to just talk things through. Tell me more?",
      "I appreciate you sharing that with me. How does that make you feel?",
      "It takes courage to open up. I'm here for you, no judgment. What else is going on?",
      "That sounds challenging. Remember, it's okay to not have all the answers right now.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const suggestedTopics = [
    { title: "I'm feeling stressed", prompt: "I'm feeling really stressed lately and could use someone to talk to." },
    { title: "Need motivation", prompt: "I'm struggling to find motivation. Any advice?" },
    { title: "Just want to chat", prompt: "Hey, I just want to have a casual conversation." },
    { title: "Feeling anxious", prompt: "I've been feeling anxious about some things in my life." },
  ];

  const handleSuggestedTopic = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full relative">
      <ConsentModal 
        isOpen={showConsent}
        onConfirm={handleConsentConfirm}
        onCancel={handleConsentCancel}
        cacheDuration={cacheDuration}
      />
      {/* Floating Header - pill shaped */}
      <div className="absolute top-4 left-4 right-4 z-20 space-y-2">
        {/* Model Loading Progress - Only show if loading */}
        {isModelLoading && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-neutral-200/50 dark:border-neutral-800/50 flex items-center gap-3">
              <Loader2 className="w-4 h-4 text-[rgb(var(--primary))] animate-spin" />
              <div className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[rgb(var(--primary))] transition-all duration-300 ease-out"
                  style={{ width: `${Math.max(5, modelProgress)}%` }}
                />
              </div>
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 w-8 text-right">
                {Math.round(modelProgress)}%
              </span>
              <button 
                onClick={cancelDownload}
                className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-neutral-400 hover:text-red-500 transition-colors"
                title="Cancel Download"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-6 py-4 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 shadow-lg relative">
            
            {/* Left Section */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu */}
              <button
                onClick={onToggleSidebar}
                className="md:hidden p-1.5 -ml-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                aria-label="Open sidebar"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              
              {/* Desktop Header Content: Logo + Title + Version + ModelSelector */}
              <div className="hidden md:flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Logo className="w-6 h-6 text-[rgb(var(--primary))]" />
                  <span className="text-lg font-bold text-neutral-900 dark:text-white">Dia Chat</span>
                  
                  {/* Version Badge - Desktop */}
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 dark:bg-green-900/30 border border-green-500/20 text-xs font-medium text-green-700 dark:text-green-400 ml-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span>v0.1.0</span>
                  </div>
                  </div>
                </div>
              </div>

            {/* Mobile Center: Logo + Title + Version */}
            <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
              <Logo className="w-6 h-6 text-[rgb(var(--primary))]" />
              <span className="font-bold text-neutral-900 dark:text-white text-lg">Dia Chat</span>
              <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full border border-green-500/20">v0.1.0</span>
            </div>

            {/* Right Section (Display ModelSelector on both Desktop and Mobile) */}
            <div className="flex items-center gap-3">
               {/* Desktop: Full Selector */}
               <div className="hidden md:block">
                  <ModelSelector />
               </div>
               
               {/* Mobile: Compact Selector */}
               <div className="md:hidden">
                  <ModelSelector compact />
               </div>
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-24 pb-32">
        {!chat || chat.messages.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto text-center"
          >
            <Logo className="w-16 h-16 text-[rgb(var(--primary))] mb-6" />
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              Hi{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}! 👋
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-8">
              I&apos;m Dia, your empathetic AI companion. How are you feeling today?
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {suggestedTopics.map((topic, i) => (
                <button
                  key={i}
                  disabled={!isModelReady}
                  onClick={() => handleSuggestedTopic(topic.prompt)}
                  className={clsx(
                    "px-4 py-3 rounded-full text-center bg-white/80 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm transition-colors backdrop-blur-sm shadow-sm",
                    isModelReady 
                      ? "hover:bg-[rgb(var(--primary))]/5 dark:hover:bg-[rgb(var(--primary))]/20 hover:border-[rgb(var(--primary))]/50 dark:hover:border-[rgb(var(--primary))]/50 cursor-pointer" 
                      : "opacity-50 cursor-wait"
                  )}
                >
                  {topic.title}
                </button>
              ))}
            </div>
            <p className="mt-8 text-xs text-center text-neutral-400 max-w-md mx-auto px-4">
              Dia is an AI companion. Responses are generated on your device for privacy.
            </p>
          </motion.div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {chat.messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={clsx(
                  'flex gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--primary))]/10 dark:bg-[rgb(var(--primary))]/20 flex items-center justify-center">
                    <Logo className="w-5 h-5 text-[rgb(var(--primary-hover))] dark:text-[rgb(var(--primary))]" />
                  </div>
                )}
                <div
                  className={clsx(
                    'max-w-[80%] px-5 py-3.5 rounded-3xl backdrop-blur-sm shadow-sm',
                    message.role === 'user'
                      ? 'bg-[rgb(var(--primary))] text-neutral-900'
                      : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-white border border-neutral-200/50 dark:border-neutral-700/50'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-medium">
                        {user?.displayName?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
            
            {isSending && !chat?.messages.some(m => m.role === 'assistant' && m.content === '') && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 justify-start"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--primary))]/10 dark:bg-[rgb(var(--primary))]/20 flex items-center justify-center">
                  <Logo className="w-5 h-5 text-[rgb(var(--primary-hover))] dark:text-[rgb(var(--primary))]" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Generating response...</span>
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Input - pill shaped and frosty */}
      <div className="absolute bottom-4 left-4 right-4 z-20">
        <div className="max-w-3xl mx-auto">
            {modelError && (
              <div className="absolute -top-12 left-0 right-0 px-4 flex justify-center">
                 <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs px-3 py-2 rounded-lg flex items-center gap-2 border border-red-200 dark:border-red-800 backdrop-blur-md shadow-sm">
                    <span>{modelError}</span>
                    <button 
                      onClick={() => initializeModel()}
                      className="underline font-semibold hover:text-red-800 dark:hover:text-red-300"
                    >
                      Retry
                    </button>
                 </div>
              </div>
            )}
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-700/50 shadow-lg transition-all">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Dia..."
              rows={1}
              className="flex-1 px-2 py-1 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 resize-none focus:outline-none focus:ring-0 border-none"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!input.trim() || isSending || !isModelReady}
              className={clsx(
                'p-2.5 rounded-full transition-all',
                input.trim() && !isSending && isModelReady
                  ? 'bg-[rgb(var(--primary))] hover:bg-[rgb(var(--primary-hover))] text-neutral-900 shadow-sm'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
              )}
            >
              {isSending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
