'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MOOD_TAGS = [
  { id: 'stressed', label: "I'm feeling stressed", response: "I hear you. Take a slow, deep breath with me. What's weighing on your mind right now?" },
  { id: 'motivation', label: "Need motivation", response: "Small steps count. You don't have to figure out everything today. What's one tiny thing you can tackle right now?" },
  { id: 'chat', label: "Just want to chat", response: "I'm right here with you. What's been on your mind lately? Speak freely." },
];

export default function ProductShowcase() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (textToSend: string, moodId?: string) => {
    if (!textToSend.trim() || isLoading || isLimitReached) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      let botResponse = "I'm listening. Tell me more about what you're experiencing.";
      if (moodId) {
        const found = MOOD_TAGS.find(t => t.id === moodId);
        if (found) botResponse = found.response;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
      setIsLoading(false);

      if (messages.length >= 4) {
        setIsLimitReached(true);
      }
    }, 1000);
  };

  const handleTagClick = (tagId: string, label: string) => {
    handleSend(label, tagId);
  };

  // Reusable Screen Content inside both Mobile Phone and Desktop Laptop
  const renderScreenContent = (isMobile: boolean = false) => (
    <div className="flex-1 flex flex-col relative bg-white dark:bg-[#1C1B18] w-full justify-between transition-colors duration-300">
      
      {/* Header inside chat */}
      <div className="h-12 sm:h-14 flex items-center justify-center border-b border-[#E5E0D8] dark:border-[#2C2924] bg-white dark:bg-[#1A1916] px-4 shrink-0">
        <div className="px-3 py-0.5 sm:py-1 rounded-full bg-white/80 dark:bg-[#25221D] border border-[#E5E0D8] dark:border-[#332F28] shadow-xs flex items-center gap-2">
          <span className="font-semibold text-xs text-neutral-800 dark:text-white">Dia</span>
          <span className="text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-950/60 px-2 py-0.5 rounded-full uppercase tracking-wider">Demo</span>
        </div>
      </div>

      {/* Chat Area Body — Fitted, No Internal Scrollbar */}
      <div className="flex-1 p-3 sm:p-6 flex flex-col justify-center overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-3 sm:space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
              <Logo className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white mb-1">Hi there!</h3>
              <p className="text-neutral-600 dark:text-neutral-300 text-xs sm:text-sm">
                I am Dia, your empathetic AI companion. How are you feeling today?
              </p>
            </div>

            <div className="w-full flex flex-col gap-1.5 sm:gap-2 pt-1 sm:pt-2">
              {MOOD_TAGS.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleTagClick(tag.id, tag.label)}
                  className="w-full px-3.5 py-2 sm:py-2.5 rounded-xl border border-[#E5E0D8] dark:border-[#332F28] bg-[#FFFDF8] dark:bg-[#25221D] text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:border-primary dark:hover:border-primary transition-all text-center"
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4 max-w-xl mx-auto w-full">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-[#F2EFE9] dark:bg-[#2C2924] border border-[#E5E0D8] dark:border-[#3A362E] text-neutral-900 dark:text-white rounded-tr-xs'
                      : 'bg-white dark:bg-[#25221D] border border-[#E5E0D8] dark:border-[#332F28] text-neutral-800 dark:text-neutral-200 rounded-tl-xs'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white dark:bg-[#25221D] border border-[#E5E0D8] dark:border-[#332F28] rounded-xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-1.5">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-neutral-400 rounded-full" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endOfMessagesRef} />
          </div>
        )}
      </div>

      {/* Chat Input Area */}
      <div className="p-3 sm:p-4 bg-[#F5F2EC] dark:bg-[#151412] border-t border-[#E5E0D8] dark:border-[#2C2924] shrink-0">
        <div className="max-w-xl mx-auto w-full">
          {isLimitReached ? (
            <div className="flex flex-col items-center justify-center p-3 bg-[#F2EFE9] dark:bg-[#22201C] rounded-xl border border-[#E5E0D8] dark:border-[#332F28] text-center">
              <p className="text-neutral-700 dark:text-neutral-300 text-xs font-medium mb-2">
                You have reached the end of the demo.
              </p>
              <Link href="/chat" className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-primary text-neutral-900 font-semibold shadow-xs hover:bg-primary-hover transition-all text-xs">
                Sign in to continue
              </Link>
            </div>
          ) : (
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className={`relative flex items-center bg-white dark:bg-[#22201C] border border-[#E5E0D8] dark:border-[#332F28] rounded-full overflow-hidden shadow-xs transition-shadow focus-within:ring-2 focus-within:ring-primary/30 ${messages.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a response..."
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-transparent border-none text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none pr-10"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1.5 p-1.5 rounded-full bg-primary text-neutral-900 disabled:opacity-40 hover:bg-primary-hover transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );

  return (
    <section id="demo" className="sticky top-0 z-10 w-full px-4 sm:px-6 lg:px-8 py-24 sm:py-32 bg-[#FBF9F4] dark:bg-[#161513] transition-colors duration-300 overflow-hidden min-h-screen flex flex-col justify-center">
      <div className="max-w-5xl mx-auto relative w-full">
        
        {/* Section Header */}
        <motion.div
          className="text-center mb-10 sm:mb-16 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-[#F5F2EC] mb-3">
            See Dia <span className="italic font-serif font-medium text-neutral-500 dark:text-neutral-400">in action</span>
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Pick a mood. Start a conversation. Feel the difference.
          </p>
        </motion.div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (Smartphone Mockup Frame) — Visible only on mobile screens */}
        {/* ========================================================================= */}
        <div className="block md:hidden mx-auto w-full max-w-[320px]">
          <div className="relative rounded-[3rem] p-3 bg-[#1F1E1B] border-4 border-[#3D3A35] shadow-2xl">
            {/* Phone Speaker / Dynamic Pill Notch */}
            <div className="w-24 h-4 bg-[#121110] rounded-full mx-auto mb-2 flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#1A1916] border border-[#2D2A26]" />
            </div>

            {/* Mobile Screen Container */}
            <div className="rounded-[2.2rem] overflow-hidden bg-[#FBF9F4] dark:bg-[#1A1916] h-[520px] flex flex-col border border-[#E5E0D8] dark:border-[#2C2924]">
              {renderScreenContent(true)}
            </div>

            {/* Phone Home Bar */}
            <div className="w-28 h-1 bg-white/30 rounded-full mx-auto mt-2" />
          </div>
        </div>


        {/* ========================================================================= */}
        {/* DESKTOP VIEW (Silver Metallic Laptop Frame) — Visible on tablet & desktop */}
        {/* ========================================================================= */}
        <motion.div
          className="hidden md:block relative mx-auto w-full max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          
          {/* Silver Laptop Lid / Screen Bezel Chassis */}
          <div className="relative bg-gradient-to-b from-[#E5E7EB] via-[#D1D5DB] to-[#9CA3AF] dark:from-[#D1D5DB] dark:via-[#9CA3AF] dark:to-[#6B7280] rounded-t-2xl p-3 pb-0 border-t-2 border-l-2 border-r-2 border-white/60 dark:border-white/30 shadow-2xl transition-colors duration-300">
            
            {/* Laptop Camera Dot */}
            <div className="flex items-center justify-center gap-1 pb-2 pt-0.5">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1F1E1B] border border-slate-400 flex items-center justify-center">
                <div className="w-0.5 h-0.5 rounded-full bg-blue-400/80" />
              </div>
            </div>

            {/* Laptop Screen Window */}
            <div className="rounded-t-lg overflow-hidden bg-[#FBF9F4] dark:bg-[#1A1916] h-[480px] flex flex-row border border-[#E5E0D8] dark:border-[#2C2924]">
              
              {/* Sidebar Mock */}
              <div className="flex flex-col w-64 border-r border-[#E5E0D8] dark:border-[#2C2924] bg-[#F5F2EC] dark:bg-[#151412] p-4 shrink-0 justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-6 mt-1 px-2">
                    <Logo className="w-7 h-7 text-primary" />
                    <span className="font-bold text-lg text-neutral-900 dark:text-white">Dia Chat</span>
                  </div>

                  <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-primary text-neutral-900 font-semibold shadow-sm hover:bg-primary-hover transition-colors mb-6">
                    <Plus className="w-4 h-4" />
                    New Chat
                  </button>

                  <div className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider px-2 mb-2">
                    Recent Chats
                  </div>
                  <div className="text-xs text-neutral-400 dark:text-neutral-500 px-2 italic">
                    No previous chats
                  </div>
                </div>

                <div className="p-2 text-xs text-neutral-400 dark:text-neutral-500 border-t border-[#E5E0D8] dark:border-[#2C2924] pt-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>On-device processing</span>
                </div>
              </div>

              {/* Main Chat Content */}
              {renderScreenContent(false)}

            </div>
          </div>

          {/* Silver Laptop Base Keyboard Deck & Opening Thumb Notch */}
          <div className="relative h-7 sm:h-8 bg-gradient-to-b from-[#F3F4F6] via-[#D1D5DB] to-[#9CA3AF] dark:from-[#E5E7EB] dark:via-[#9CA3AF] dark:to-[#4B5563] rounded-b-2xl border-t border-slate-400 dark:border-slate-500 shadow-2xl flex items-center justify-center">
            {/* Center Thumb Opening Notch */}
            <div className="w-32 h-2.5 bg-[#6B7280] dark:bg-[#374151] rounded-b-md shadow-inner" />
          </div>

        </motion.div>

      </div>
    </section>
  );
}
