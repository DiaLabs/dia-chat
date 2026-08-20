'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Plus, Send } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

type Message = {
 role: 'user' | 'model';
 content: string;
};

const MOOD_TAGS = [
 { id: 'feeling_stressed', label: "I'm feeling stressed" },
 { id: 'need_motivation', label: 'Need motivation' },
 { id: 'just_chat', label: 'Just want to chat' },
 { id: 'feeling_anxious', label: 'Feeling anxious' },
];

export default function ProductShowcase() {
 const [messages, setMessages] = useState<Message[]>([]);
 const [input, setInput] = useState('');
 const [isLoading, setIsLoading] = useState(false);
 const [turnCount, setTurnCount] = useState(0);
 const endOfMessagesRef = useRef<HTMLDivElement>(null);

 const isLimitReached = turnCount >= 3;

 useEffect(() => {
   endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
 }, [messages, isLoading]);

 const handleSend = async (content: string, tag: string = 'default') => {
   if (!content.trim() || isLimitReached || isLoading) return;

   const newMessages: Message[] = [...messages, { role: 'user', content }];
   setMessages(newMessages);
   setInput('');
   setIsLoading(true);
   setTurnCount(prev => prev + 1);

   try {
     const res = await fetch('/api/demo-chat', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ messages: newMessages, tag }),
     });

     if (!res.ok) throw new Error('API error');

     const data = await res.json();
     setMessages([...newMessages, { role: 'model', content: data.response }]);
   } catch (err) {
     console.error(err);
     setMessages([...newMessages, { role: 'model', content: "Oops, something went wrong connecting to Dia. Try signing in!" }]);
   } finally {
     setIsLoading(false);
   }
 };

 const handleTagClick = (tagId: string, label: string) => {
   handleSend(label, tagId);
 };

 return (
   <section id="demo" className="relative z-10 px-4 sm:px-6 lg:px-8 py-24 sm:py-32 bg-[#FBF9F4] overflow-hidden">
     <div className="max-w-5xl mx-auto relative">
       
       <motion.div
         className="text-center mb-16 relative z-10"
         initial={{ opacity: 0, y: 20 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.6 }}
       >
         <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
           See Dia <span className="italic font-serif font-medium text-neutral-500">in action</span>
         </h2>
         <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
           Pick a mood. Start a conversation. Feel the difference.
         </p>
       </motion.div>

       {/* Responsive Mockup Frame Container */}
       <motion.div
         className="relative mx-auto w-full max-w-[340px] md:max-w-4xl"
         initial={{ opacity: 0, y: 40 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true }}
         transition={{ duration: 0.7, delay: 0.1 }}
       >
         
         {/* Laptop Bezel / Phone Bezel wrapper */}
         <div className="relative bg-neutral-800 rounded-[3rem] md:rounded-t-3xl md:rounded-b-none p-3 md:p-4 shadow-2xl border-4 border-neutral-700 md:border-none">
           
           {/* Phone Notch (hidden on desktop) */}
           <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-neutral-800 rounded-full z-20 md:hidden flex items-center justify-center">
             <div className="w-12 h-1 bg-neutral-600 rounded-full"></div>
           </div>

           {/* Laptop Camera dot (hidden on mobile) */}
           <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-neutral-950 rounded-full z-20 hidden md:block"></div>

           {/* Screen content */}
           <div className="rounded-[2.2rem] md:rounded-xl overflow-hidden bg-[#FBF9F4] h-[580px] md:h-[520px] pt-8 md:pt-0 flex flex-col md:flex-row border border-[#E5E0D8]">
             
             {/* Sidebar Mock */}
             <div className="hidden md:flex flex-col w-64 border-r border-[#E5E0D8] bg-[#F5F2EC] p-4 shrink-0">
               <div className="flex items-center gap-2 mb-8 mt-2 px-2">
                 <div className="w-8 h-8 rounded-xl bg-transparent flex items-center justify-center text-primary">
                   <Logo className="w-8 h-8" />
                 </div>
                 <span className="font-bold text-lg text-neutral-900">Dia Chat</span>
               </div>

               <button className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full bg-primary text-neutral-900 font-semibold shadow-sm hover:bg-primary-hover transition-colors mb-6">
                 <Plus className="w-5 h-5" />
                 New Chat
               </button>

               <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-2 mb-3">
                 Recent Chats
               </div>
               <div className="flex-1 overflow-y-auto space-y-1">
                 <div className="flex items-center justify-center h-20 text-sm text-neutral-500 text-center px-4">
                   No chats yet.
                 </div>
               </div>
             </div>

             {/* Main Chat Area */}
             <div className="flex-1 flex flex-col relative bg-white w-full">
               
               {/* Header inside chat */}
               <div className="h-16 flex items-center justify-center border-b border-[#E5E0D8] bg-white px-4 shrink-0">
                 <div className="px-4 py-1.5 rounded-full bg-white/80 border border-[#E5E0D8] shadow-sm flex items-center gap-2">
                   <span className="font-semibold text-neutral-800">Dia</span>
                   <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Demo</span>
                 </div>
               </div>

               {/* Chat Messages */}
               <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                 {messages.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full max-w-sm mx-auto text-center space-y-6">
                     <div className="space-y-4">
                       <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-2 text-primary">
                         <Logo className="w-8 h-8" />
                       </div>
                       <h3 className="text-2xl font-bold text-neutral-900">Hi there!</h3>
                       <p className="text-neutral-600 text-sm sm:text-base px-2">
                         I am Dia, your empathetic AI companion. How are you feeling today?
                       </p>
                     </div>

                     <div className="w-full flex flex-col gap-2 mt-4">
                       {MOOD_TAGS.map(tag => (
                         <button
                           key={tag.id}
                           onClick={() => handleTagClick(tag.id, tag.label)}
                           className="w-full px-4 py-3 sm:py-3.5 rounded-2xl border border-[#E5E0D8] bg-white text-sm font-medium text-neutral-700 hover:border-primary hover:shadow-sm transition-all text-center whitespace-normal"
                         >
                           {tag.label}
                         </button>
                       ))}
                     </div>
                   </div>
                 ) : (
                   <div className="space-y-6 max-w-2xl mx-auto w-full pb-4">
                     <AnimatePresence>
                       {messages.map((msg, i) => (
                         <motion.div
                           key={i}
                           initial={{ opacity: 0, y: 10 }}
                           animate={{ opacity: 1, y: 0 }}
                           className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                         >
                           <div className={`max-w-[85%] rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 text-[14px] sm:text-[15px] leading-relaxed shadow-sm ${
                             msg.role === 'user'
                               ? 'bg-[#F2EFE9] border border-[#E5E0D8] text-neutral-900 rounded-tr-sm'
                               : 'bg-white border border-[#E5E0D8] text-neutral-800 rounded-tl-sm'
                           }`}>
                             {msg.content}
                           </div>
                         </motion.div>
                       ))}
                       {isLoading && (
                         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                           <div className="bg-white border border-[#E5E0D8] rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
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
               <div className="p-4 sm:p-5 bg-[#F5F2EC] border-t border-[#E5E0D8] shrink-0">
                 <div className="max-w-2xl mx-auto w-full">
                   {isLimitReached ? (
                     <div className="flex flex-col items-center justify-center p-4 bg-[#F2EFE9] rounded-2xl border border-[#E5E0D8] text-center">
                       <p className="text-neutral-700 text-sm sm:text-base font-medium mb-3">
                         You have reached the end of the demo.
                       </p>
                       <Link href="/chat" className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary text-neutral-900 font-semibold shadow-sm hover:bg-primary-hover transition-all text-sm sm:text-base">
                         Sign in to continue
                       </Link>
                     </div>
                   ) : (
                     <form 
                       onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
                       className={`relative flex items-center bg-white border border-[#E5E0D8] rounded-full overflow-hidden shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-primary/30 ${messages.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                     >
                       <input
                         type="text"
                         value={input}
                         onChange={(e) => setInput(e.target.value)}
                         placeholder="Type a response..."
                         disabled={isLoading || messages.length === 0}
                         className="flex-1 bg-transparent px-4 sm:px-6 py-3 sm:py-3.5 outline-none text-neutral-800 placeholder:text-neutral-400 text-sm sm:text-base"
                       />
                       <button
                         type="submit"
                         disabled={!input.trim() || isLoading || messages.length === 0}
                         className="p-2 mr-1.5 sm:mr-2 rounded-full bg-primary text-neutral-900 disabled:opacity-50 transition-colors"
                       >
                         <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                       </button>
                     </form>
                   )}
                 </div>
               </div>

             </div>
           </div>
         </div>
         
         {/* Laptop Base (hidden on mobile) */}
         <div className="relative bg-neutral-300 rounded-b-2xl h-[16px] w-[104%] left-[-2%] shadow-md border-t border-neutral-200 hidden md:flex justify-center z-10">
           <div className="w-24 h-[4px] bg-neutral-400 rounded-full mt-[2px]"></div>
         </div>

       </motion.div>

     </div>
   </section>
 );
}
