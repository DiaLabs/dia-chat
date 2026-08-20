'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  const { signInWithGoogle } = useAuth();

  return (
    <section className="relative z-20 px-4 sm:px-6 lg:px-8 py-32 sm:py-48 bg-[#FBF9F4] dark:bg-[#121110] transition-colors duration-300 overflow-hidden flex flex-col items-center justify-center text-center border-t border-[#E5E0D8] dark:border-[#262320] min-h-screen">
      
      {/* Soft amber blur glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F0A955]/10 dark:bg-[#F0A955]/15 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        className="max-w-4xl mx-auto relative z-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.15 } }
        }}
      >
        <motion.h2
          className="text-5xl sm:text-7xl font-bold text-neutral-900 dark:text-[#F5F2EC] tracking-tight mb-8 leading-tight"
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
        >
          Ready to feel a <br className="hidden sm:block" /> little lighter?
        </motion.h2>
        <motion.p
          className="text-xl sm:text-2xl text-neutral-600 dark:text-neutral-400 font-medium max-w-2xl mx-auto mb-12"
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
        >
          Join a completely private space where you can just be yourself. No judgment, no data tracking.
        </motion.p>
        
        <motion.button
          onClick={signInWithGoogle}
          className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 sm:px-12 sm:py-6 rounded-full bg-primary hover:bg-primary-hover text-neutral-900 text-xl sm:text-2xl font-bold transition-all duration-300 hover:scale-105 shadow-lg border border-primary/20"
          variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}
        >
          <span>Start chatting now</span>
          <ArrowRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
        </motion.button>
      </motion.div>
    </section>
  );
}
