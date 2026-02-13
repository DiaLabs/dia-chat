'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Menu as MenuIcon, X, Square } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLLM } from '@/hooks/useLLM';
import Logo from './Logo';
import ModelSelector from './ModelSelector';
import UserAvatar from './UserAvatar';
import type { Message } from '@/types';
import clsx from 'clsx';

interface ChatInterfaceProps {
  messages: Message[];
  latestSummary: string | null;
  onAddMessage: (role: 'user' | 'assistant', content: string) => Promise<Message>;
  onUpdateMessage: (messageId: string, content: string) => Promise<void>;
  onToggleSidebar: () => void;
}

export default function ChatInterface({
  messages,
  latestSummary,
  onAddMessage,
  onUpdateMessage,
  onToggleSidebar,
}: ChatInterfaceProps) {
  const { user } = useAuth();
  const {
    isReady: isModelReady,
    isLoading: isModelLoading,
    progress: modelProgress,
    progressText,
    error: modelError,
    isCached,
    initialize: initializeModel,
    cancelDownload,
    sendMessage: sendToLLM,
    stopGeneration,
    activeEngine,
  } = useLLM();

  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const [queuedMessage, setQueuedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  // Send queued message when model becomes ready
  useEffect(() => {
    if (isModelReady && queuedMessage && !isSending) {
      const messageToSend = queuedMessage;
      setQueuedMessage(null);
      // Trigger the send by setting input and simulating the action
      (async () => {
        await handleSendMessage(messageToSend);
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isModelReady, queuedMessage, isSending]);

  const handleSendMessage = async (contentOverride?: string) => {
    const textToSend = contentOverride || input;
    if (!textToSend.trim()) return;

    // If assistant is currently replying, stop generation before sending new message
    if (isSending) {
      stopGeneration();
      setIsSending(false);
      setStreamingMessageId(null);
      // Small delay to ensure cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Check if model is ready
    if (!isModelReady) {
      // Queue the message to be sent when model is ready
      setQueuedMessage(textToSend.trim());
      setInput('');
      return;
    }

    // Add user message
    const userMessage = await onAddMessage('user', textToSend.trim());
    setInput('');
    setIsSending(true);

    try {
      // Create empty assistant message for streaming
      const assistantMessage = await onAddMessage('assistant', '');
      setStreamingMessageId(assistantMessage.id);

      // Build conversation history for context
      const conversationHistory = messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      // Add the new user message
      conversationHistory.push({
        role: 'user',
        content: textToSend.trim(),
      });

      // Stream response from LLM
      let fullResponse = '';
      let updateCount = 0;
      await sendToLLM(conversationHistory, latestSummary, (token) => {
        fullResponse += token;
        updateCount++;
        // Update message content as tokens arrive
        onUpdateMessage(assistantMessage.id, fullResponse);
      });
      
      // Ensure final update is saved
      if (fullResponse) {
        await onUpdateMessage(assistantMessage.id, fullResponse);
      }

      setStreamingMessageId(null);
    } catch (error: unknown) {
      console.error('Failed to send message:', error);

      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Don't show error if it was aborted (user stopped it)
      if (errorMessage === 'Generation aborted') {
        console.log('Generation was stopped by user');
      } else {
        // Show error to user
        await onAddMessage(
          'assistant',
          `Sorry, I encountered an error: ${errorMessage}. Please try again.`
        );
      }

      setStreamingMessageId(null);
    } finally {
      setIsSending(false);
    }
  };

  const handleStopGeneration = () => {
    stopGeneration();
    setIsSending(false);
    setStreamingMessageId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedTopics = [
    { title: "I'm feeling stressed", prompt: "I'm feeling really stressed lately and could use someone to talk to." },
    { title: 'Need motivation', prompt: "I'm struggling to find motivation. Any advice?" },
    { title: 'Just want to chat', prompt: 'Hey, I just want to have a casual conversation.' },
    { title: 'Feeling anxious', prompt: "I've been feeling anxious about some things in my life." },
  ];

  const handleSuggestedTopic = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Floating Header - pill shaped */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-5 py-3 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 shadow-lg relative">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Mobile Menu */}
            <button
              onClick={onToggleSidebar}
              className="md:hidden p-1.5 -ml-1 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              aria-label="Open sidebar"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            {/* Desktop Header Content: Logo + Title + Version */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Logo className="w-6 h-6 text-[rgb(var(--primary))]" />
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  Dia Chat
                </span>

                {/* Version Badge - Desktop */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10 dark:bg-green-900/30 border border-green-500/20 text-xs font-medium text-green-700 dark:text-green-400 ml-1">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  <span>v{process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Center: Logo + Title + Version */}
          <div className="md:hidden absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <Logo className="w-6 h-6 text-[rgb(var(--primary))]" />
            <span className="font-bold text-neutral-900 dark:text-white text-lg">Dia Chat</span>
            <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full border border-green-500/20">
              v{process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'}
            </span>
          </div>

          {/* Right Section - Model Selector */}
          <div className="flex items-center gap-3">
            {/* Desktop: Full Selector */}
            <div className="hidden md:block">
              <ModelSelector
                isLoading={isModelLoading}
                isReady={isModelReady}
                isCached={isCached}
                progress={modelProgress}
                progressText={progressText}
                onDownload={initializeModel}
                onCancel={cancelDownload}
                activeEngine={activeEngine}
              />
            </div>

            {/* Mobile: Compact Selector */}
            <div className="md:hidden">
              <ModelSelector
                compact
                isLoading={isModelLoading}
                isReady={isModelReady}
                isCached={isCached}
                progress={modelProgress}
                progressText={progressText}
                onDownload={initializeModel}
                onCancel={cancelDownload}
                activeEngine={activeEngine}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-24">
        {messages.length === 0 ? (
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

            {/* Download Model Prompt - Only show if model is NOT cached */}
            {!isCached && !isModelLoading && (
              <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl max-w-md">
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                  👋 First time here? Download the AI model to start chatting!
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Click the download button in the top-right corner.
                </p>
              </div>
            )}

            {/* Model Loading from Cache */}
            {isCached && isModelLoading && !isModelReady && (
              <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl max-w-md backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[rgb(var(--primary))]" />
                    <span className="text-sm font-medium text-neutral-900 dark:text-white">Loading AI Model...</span>
                  </div>
                  <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">{Math.round(modelProgress)}%</span>
                </div>
                {/* Subtle progress bar */}
                <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[rgb(var(--primary))] transition-all duration-300 ease-out"
                    style={{ width: `${Math.max(5, modelProgress)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Model Error - Show with retry button */}
            {modelError && !isModelLoading && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl max-w-md">
                <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                  Failed to load model: {modelError}
                </p>
                <button
                  onClick={initializeModel}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors cursor-pointer"
                >
                  Retry Initialization
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
              {suggestedTopics.map((topic, i) => (
                <button
                  key={i}
                  disabled={!isModelReady}
                  onClick={() => handleSuggestedTopic(topic.prompt)}
                  className={clsx(
                    'px-4 py-3 rounded-full text-center bg-white/80 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm transition-colors backdrop-blur-sm shadow-sm',
                    isModelReady
                      ? 'hover:bg-[rgb(var(--primary))]/5 dark:hover:bg-[rgb(var(--primary))]/20 hover:border-[rgb(var(--primary))]/50 dark:hover:border-[rgb(var(--primary))]/50 cursor-pointer'
                      : 'opacity-50 cursor-not-allowed'
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
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={clsx(
                  'flex gap-2.5',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-[rgb(var(--primary))]/10 dark:bg-[rgb(var(--primary))]/20 flex items-center justify-center">
                    <Logo className="w-5 h-5 text-[rgb(var(--primary-hover))] dark:text-[rgb(var(--primary))]" />
                  </div>
                )}
                <div
                  className={clsx(
                    'max-w-[85%] px-4 py-2.5 rounded-3xl backdrop-blur-sm shadow-sm',
                    message.role === 'user'
                      ? 'bg-[rgb(var(--primary))] text-neutral-900'
                      : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-white border border-neutral-200/50 dark:border-neutral-700/50'
                  )}
                >
                  <p className="whitespace-pre-wrap">
                    {message.content || (streamingMessageId === message.id && (
                      <span className="inline-flex items-center gap-1">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-neutral-500">Thinking...</span>
                      </span>
                    ))}
                  </p>
                </div>
                {message.role === 'user' && <UserAvatar user={user} size="sm" showRing />}
              </motion.div>
            ))}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Floating Input - pill shaped and frosty */}
      <div className="p-4 z-20 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-700/50 shadow-md transition-all focus-within:border-neutral-200/50 dark:focus-within:border-neutral-700/50">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                queuedMessage
                  ? 'Message queued - waiting for model...'
                  : isModelReady
                  ? 'Message Dia...'
                  : isModelLoading
                  ? isCached
                    ? 'Loading model from cache...'
                    : 'Downloading model...'
                  : 'Click download to start chatting...'
              }
              rows={1}
              style={{ outline: 'none', boxShadow: 'none' }}
              className="flex-1 px-2 py-1 bg-transparent text-neutral-900 dark:text-white placeholder-neutral-500 resize-none !outline-none !ring-0 !border-0 focus:!outline-none focus:!ring-0 focus:!border-0 focus-visible:!outline-none focus-visible:!ring-0"
            />
            {isSending || queuedMessage ? (
              <button
                onClick={() => {
                  if (isSending) {
                    handleStopGeneration();
                  }
                }}
                className="p-2 rounded-full transition-all bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-200 cursor-pointer"
                title={isSending ? "Stop generating" : "Waiting for model..."}
              >
                <div className="relative">
                  {isSending ? (
                    <>
                      <Square className="w-4 h-4 fill-current" />
                      <span className="absolute inset-0 animate-ping opacity-20 bg-current rounded-sm"></span>
                    </>
                  ) : (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                </div>
              </button>
            ) : (
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim()}
                className={clsx(
                  'p-2 rounded-full transition-all flex items-center justify-center',
                  input.trim()
                    ? 'text-[rgb(var(--primary))] hover:bg-[rgb(var(--primary))]/10 cursor-pointer scale-100 opacity-100'
                    : 'text-neutral-300 dark:text-neutral-600 cursor-not-allowed scale-95 opacity-50'
                )}
                title={isModelReady ? "Send message" : "Send (will queue until model loads)"}
              >
                <Send className={clsx("w-5 h-5", input.trim() && "fill-current")} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
