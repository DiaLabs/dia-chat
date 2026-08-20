'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
 onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
 const [isVisible, setIsVisible] = useState(true);

 useEffect(() => {
 // Suppress native scrollbars and Lenis scrolling during intro
 document.documentElement.classList.add('lenis-stopped');
 document.body.style.overflow = 'hidden';

 // 800ms for drawing + 200ms pause, then start slide out
 const timer = setTimeout(() => {
 setIsVisible(false);
 }, 1200);

 return () => {
 clearTimeout(timer);
 // Restore scrolling when preloader finishes
 document.documentElement.classList.remove('lenis-stopped');
 document.body.style.overflow = '';
 };
 }, []);

 return (
 <AnimatePresence onExitComplete={onComplete}>
 {isVisible && (
 <motion.div
 initial={{ y: 0 }}
 exit={{ y: '-100%' }}
 transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
 className="fixed inset-0 z-[9999] bg-primary flex flex-col items-center justify-center select-none"
 >
 {/* Logo container (Enlarged) */}
 <div className="w-36 h-36 sm:w-48 sm:h-48 text-white">
 <svg
 viewBox="0 0 40 40"
 fill="none"
 xmlns="http://www.w3.org/2000/svg"
 className="w-full h-full"
 >
 {/* Friendly chat bubble path */}
 <motion.path
 d="M8 12C8 8.68629 10.6863 6 14 6H26C29.3137 6 32 8.68629 32 12V22C32 25.3137 29.3137 28 26 28H22L16 34V28H14C10.6863 28 8 25.3137 8 22V12Z"
 stroke="currentColor"
 strokeWidth="2.5"
 strokeLinecap="round"
 strokeLinejoin="round"
 initial={{ pathLength: 0 }}
 animate={{ pathLength: 1 }}
 transition={{ duration: 0.8, ease: 'easeInOut' }}
 />
 {/* Heart inside bubble path (Outlined then Filled white) */}
 <motion.path
 d="M20 22C20 22 24 18.5 24 16C24 14.3431 22.6569 13 21 13C20.2316 13 19.5308 13.3374 19 13.8906C18.4692 13.3374 17.7684 13 17 13C15.3431 13 14 14.3431 14 16C14 18.5 18 22 20 22Z"
 stroke="currentColor"
 strokeWidth="2"
 strokeLinecap="round"
 strokeLinejoin="round"
 initial={{ pathLength: 0, fill: "rgba(255, 255, 255, 0)" }}
 animate={{ pathLength: 1, fill: "rgba(255, 255, 255, 1)" }}
 transition={{
 pathLength: { duration: 0.6, delay: 0.25, ease: 'easeInOut' },
 fill: { duration: 0.4, delay: 0.65, ease: 'easeOut' }
 }}
 />
 </svg>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
