'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Send, Lock, Plus, History, ArrowRight, ChevronDown } from 'lucide-react';
import Logo from '@/components/Logo';

export default function HeroSection({ startAnimation = true }: { startAnimation?: boolean }) {
 const { signInWithGoogle } = useAuth();
 const [messages, setMessages] = useState<{ role: 'user' | 'dia'; content: string }[]>([]);
 const [inputValue, setInputValue] = useState('');
 const [isTyping, setIsTyping] = useState(false);
 
 const [activeMenu, setActiveMenu] = useState<'plus' | 'history' | null>(null);
 const [highlightHovered, setHighlightHovered] = useState(false);
 const [azimuth, setAzimuth] = useState(60);
 const [elevation, setElevation] = useState(38);

 const inputRef = useRef<HTMLInputElement>(null);
 const menuRef = useRef<HTMLDivElement>(null);
 
 const MAX_MESSAGES = 2;
 const isLocked = messages.length >= MAX_MESSAGES;

 // Handle click outside to close menus
 useEffect(() => {
 function handleClickOutside(event: MouseEvent) {
 if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
 setActiveMenu(null);
 }
 }
 document.addEventListener('mousedown', handleClickOutside);
 return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 useEffect(() => {
 if (startAnimation) {
 const isMobile = window.innerWidth < 768;
 if (isMobile) {
 // Auto-draw the highlight underline on mobile quickly on load
 const timer = setTimeout(() => {
 setHighlightHovered(true);
 }, 200);
 return () => clearTimeout(timer);
 }
 }
 }, [startAnimation]);

 // Slowly animate both light azimuth and elevation angles to create organic moving shadows
 useEffect(() => {
 let animationId: number;
 const startTime = Date.now();

 const animateLight = () => {
 const elapsed = (Date.now() - startTime) / 1000;
 // Oscillate azimuth smoothly between 40 and 80 degrees
 const azimuthAngle = 60 + Math.sin(elapsed * 0.35) * 20;
 // Oscillate elevation smoothly between 30 and 46 degrees
 const elevationAngle = 38 + Math.cos(elapsed * 0.45) * 8;
 
 setAzimuth(azimuthAngle);
 setElevation(elevationAngle);
 animationId = requestAnimationFrame(animateLight);
 };

 animateLight();
 return () => cancelAnimationFrame(animationId);
 }, []);

 const handleSend = () => {
 if (!inputValue.trim() || isTyping) return;

 const userMsg = inputValue;
 setInputValue('');
 setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
 setIsTyping(true);

 setTimeout(() => {
 setIsTyping(false);
 const userMsgCount = messages.filter(m => m.role === 'user').length + 1;
 
 if (userMsgCount === 1) {
 setMessages(prev => [...prev, { 
 role: 'dia', 
 content: "That sounds like a heavy load to carry. What do you feel is causing the most pressure right now?" 
 }]);
 } else if (userMsgCount >= MAX_MESSAGES) {
 setMessages(prev => [...prev, { 
 role: 'dia', 
 content: "I'd love to keep chatting and support you through this. To ensure your conversation stays secure and private, let's continue inside." 
 }]);
 }
 }, 1500);
 };

 const handleKeyDown = (e: React.KeyboardEvent) => {
 if (e.key === 'Enter') {
 e.preventDefault();
 handleSend();
 }
 };

 return (
 <section className="relative px-4 sm:px-6 lg:px-8 pt-32 sm:pt-44 pb-24 min-h-screen flex flex-col items-center justify-center border-b border-border overflow-hidden">
 {/* SVG Filters for Crumple Effect */}
 <svg className="absolute w-0 h-0">
 <filter id="paper-crumple">
 <feTurbulence type="fractalNoise" baseFrequency="0.007" numOctaves="4" result="noise" />
 <feGaussianBlur in="noise" stdDeviation="1.5" result="blurredNoise" />
 <feDiffuseLighting in="blurredNoise" lightingColor="#fff" surfaceScale="4">
 <feDistantLight azimuth={azimuth} elevation={elevation} />
 </feDiffuseLighting>
 </filter>
 </svg>

 {/* Dynamic Crumpled Paper Background */}
 <div className="absolute inset-0 pointer-events-none z-0 bg-[#FBF9F4]">
 {/* Dense Grid overlay */}
 <div className="absolute inset-0 hero-bg opacity-[0.45] mix-blend-multiply" />
 
 {/* SVG Crumple shadow texture overlay */}
 <div 
 className="absolute inset-0 opacity-[0.28] mix-blend-multiply "
 style={{
 filter: 'url(#paper-crumple)',
 background: '#fff'
 }}
 />
 
 {/* Soft amber blur glow overlay */}
 <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] max-w-[600px] max-h-[600px] rounded-full bg-primary/6 blur-[140px] sm:blur-[160px]" />
 </div>

 <div className="relative z-10 w-full max-w-5xl mx-auto text-center flex flex-col justify-center items-center">
 {/* Headline */}
 <motion.h1 
 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-neutral-900 mb-4 sm:mb-6 max-w-4xl mx-auto leading-tight"
 initial={{ opacity: 0, y: 25 }}
 animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
 transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
 >
 Your thoughts{' '}
 <span 
 className="relative inline-block px-1 cursor-pointer select-none"
 onMouseEnter={() => setHighlightHovered(true)}
 onMouseLeave={() => setHighlightHovered(false)}
 >
 <span className="italic font-serif font-medium text-neutral-500 ">don't have to</span>
 <svg 
 className={`absolute left-0 -bottom-1.5 w-full h-2 text-primary pointer-events-none transition-opacity duration-200 ${
 highlightHovered ? 'opacity-100' : 'opacity-0'
 }`}
 viewBox="0 0 100 10" 
 preserveAspectRatio="none"
 >
 <motion.path
 d="M3 5 Q 50 1 97 5"
 fill="transparent"
 stroke="currentColor"
 strokeWidth="4"
 strokeLinecap="round"
 initial={{ pathLength: 0 }}
 animate={{ pathLength: highlightHovered ? 1 : 0 }}
 transition={{ duration: 0.5, ease: "easeInOut" }}
 />
 </svg>
 </span>
 <br className="hidden sm:inline" /> stay in your head.
 </motion.h1>
 
 {/* Short, direct copy */}
 <motion.p 
 className="text-xl sm:text-2xl text-neutral-500 max-w-2xl mx-auto mb-6 sm:mb-10 leading-relaxed font-medium"
 initial={{ opacity: 0, y: 15 }}
 animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
 transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
 >
 Talk to Dia. Think out loud. Feel a little lighter.
 </motion.p>

 {/* Primary CTA (Start talking - flat, sharp styling, no glows) */}
 <motion.div 
 className="flex flex-row items-center justify-center gap-3 mb-8 sm:mb-16 w-full max-w-sm sm:max-w-none px-4"
 initial={{ opacity: 0, y: 15 }}
 animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
 transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
 >
 <button
 onClick={signInWithGoogle}
 className="w-1/2 sm:w-auto px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-primary hover:bg-primary-hover text-neutral-900 font-semibold transition-colors flex items-center justify-center gap-1.5 sm:gap-2 border border-primary text-sm sm:text-base whitespace-nowrap"
 >
 Start talking
 <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
 </button>
 
 <button
 onClick={() => {
 inputRef.current?.focus();
 inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
 }}
 className="w-1/2 sm:w-auto px-4 sm:px-8 py-2.5 sm:py-3.5 rounded-full border border-border bg-surface hover:bg-surface-secondary text-neutral-700 font-semibold transition-colors text-sm sm:text-base whitespace-nowrap"
 >
 Try preview
 </button>
 </motion.div>

 {/* Dynamic Chat & Input Container (Takes 70-75% screen width on desktop) */}
 <motion.div 
 className="max-w-4xl w-full text-left relative mt-6 sm:mt-8"
 initial={{ opacity: 0, y: 30 }}
 animate={startAnimation ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
 transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
 >
 
 {/* Conversation Window (Fades/slides down only when there are messages) */}
 <AnimatePresence>
 {messages.length > 0 && (
 <motion.div 
 initial={{ opacity: 0, height: 0 }}
 animate={{ opacity: 1, height: 'auto' }}
 exit={{ opacity: 0, height: 0 }}
 className="mb-6 rounded-2xl border border-border bg-surface/50 p-4 sm:p-6 max-h-[250px] overflow-y-auto space-y-4 custom-scrollbar"
 >
 {messages.map((msg, i) => (
 <motion.div 
 key={i}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
 >
 <div className={`max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-2.5 text-sm sm:text-base border ${
 msg.role === 'user' 
 ? 'bg-primary/10 border-primary/20 text-neutral-900 ' 
 : 'bg-surface-secondary border-border text-neutral-800 '
 }`}>
 {msg.content}
 </div>
 </motion.div>
 ))}
 
 {isTyping && (
 <div className="flex justify-start">
 <div className="bg-surface-secondary border border-border rounded-xl px-4 py-3 flex gap-1.5 items-center">
 <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
 <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
 <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
 </div>
 </div>
 )}
 </motion.div>
 )}
 </AnimatePresence>

 {/* Interactive Input Box (Mindela-inspired: simple, big, controls at bottom) */}
 <div className="relative rounded-2xl bg-surface/60 border border-border p-3 sm:p-4 shadow-md transition-all duration-300 group focus-within:border-primary/50">
 {isLocked ? (
 <motion.div 
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="flex flex-col items-center justify-center py-6 text-center"
 >
 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
 <Lock className="w-6 h-6 text-primary" />
 </div>
 <h3 className="text-lg font-medium text-neutral-900 mb-2">
 Continue chatting with Dia
 </h3>
 <p className="text-sm text-neutral-500 mb-6">
 Sign in to save your conversation and access full features.
 </p>
 <button
 onClick={signInWithGoogle}
 className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-hover text-neutral-900 font-semibold transition-colors shadow-sm"
 >
 Sign in with Google
 </button>
 </motion.div>
 ) : (
 <>
 <input
 ref={inputRef}
 type="text"
 value={inputValue}
 onChange={(e) => setInputValue(e.target.value)}
 onKeyDown={handleKeyDown}
 disabled={isTyping}
 placeholder="What's on your mind?..."
 className="w-full bg-transparent border-none text-neutral-950 placeholder:text-neutral-400 focus:ring-0 text-base sm:text-lg py-2 px-3 mb-3 outline-none"
 />
 
 {/* Actions bottom row (Uniform button sizes) */}
 <div className="flex items-center justify-between border-t border-border/60 pt-3 px-1.5 relative">
 <div className="flex items-center gap-2">
 <button 
 onClick={() => setActiveMenu(activeMenu === 'plus' ? null : 'plus')}
 className="h-10 px-5 rounded-full border border-border hover:bg-surface-secondary text-neutral-600 font-semibold text-sm transition-colors flex items-center gap-1.5"
 >
 <Plus className="w-4 h-4" />
 <span>Add</span>
 </button>
 <button 
 onClick={() => setActiveMenu(activeMenu === 'history' ? null : 'history')}
 className="h-10 px-5 rounded-full border border-border hover:bg-surface-secondary text-neutral-600 font-semibold text-sm transition-colors flex items-center gap-1.5"
 >
 <History className="w-4 h-4" />
 <span>History</span>
 </button>
 </div>
 
 <div className="flex items-center gap-2">
 <button 
 onClick={handleSend}
 disabled={!inputValue.trim() || isTyping}
 className="h-10 px-6 rounded-full bg-primary hover:bg-primary-hover text-neutral-900 font-bold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-primary/20"
 >
 Send
 </button>
 </div>
 </div>
 </>
 )}
 </div>

 {/* Floating popup sign-in menus */}
 <AnimatePresence>
 {activeMenu && (
 <motion.div 
 ref={menuRef}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: 10 }}
 className="absolute bottom-16 left-6 z-20 w-72 p-5 rounded-xl border border-border bg-surface shadow-xl flex flex-col items-center text-center space-y-4"
 >
 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
 <Lock className="w-4 h-4 text-primary" />
 </div>
 <div>
 <h4 className="text-sm font-bold text-neutral-900 ">
 {activeMenu === 'plus' ? 'Upload files to Dia' : 'Access your chat history'}
 </h4>
 <p className="text-xs text-neutral-500 mt-1">
 {activeMenu === 'plus' 
 ? 'Sign in to upload images, journals, and files.' 
 : 'Sign in to save and sync your conversations.'}
 </p>
 </div>
 <button
 onClick={signInWithGoogle}
 className="w-full h-10 rounded-full bg-primary hover:bg-primary-hover text-neutral-900 text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
 >
 Sign in with Google
 </button>
 </motion.div>
 )}
 </AnimatePresence>

 </motion.div>
 </div>

 {/* Animated Scroll Indicator (Mouse Wheel + Scroll text - hidden on mobile) */}
 <div 
 className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 cursor-pointer text-neutral-400 hover:text-neutral-600 transition-colors select-none"
 onClick={() => {
 window.scrollTo({
 top: window.innerHeight,
 behavior: 'smooth'
 });
 }}
 >
 {/* Animated Mouse Icon */}
 <div className="w-5 h-8 rounded-full border border-current flex justify-center p-1">
 <motion.div 
 className="w-1 h-1.5 rounded-full bg-current"
 animate={{ 
 y: [0, 8, 0],
 opacity: [1, 0, 1]
 }}
 transition={{ 
 duration: 1.8, 
 repeat: Infinity, 
 ease: "easeInOut" 
 }}
 />
 </div>
 <span className="text-[10px] font-bold tracking-widest uppercase font-mono">Scroll</span>
 </div>
 </section>
 );
}
