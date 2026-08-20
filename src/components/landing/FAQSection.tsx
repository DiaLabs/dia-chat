'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Washi Tape Component for FAQ Sticky Notes
const NoteTape = ({ position = 'center' }: { position?: 'left' | 'center' | 'right' }) => (
  <div 
    className={`absolute -top-3.5 ${
      position === 'left' 
        ? 'left-6 -rotate-6' 
        : position === 'right' 
        ? 'right-6 rotate-6' 
        : 'left-1/2 -translate-x-1/2 -rotate-1'
    } w-24 h-7 bg-[#F3D99E]/85 dark:bg-[#7A6230]/80 border-t border-b border-[#DFC17D]/70 dark:border-[#967B40]/60 shadow-xs pointer-events-none z-30`}
    style={{
      clipPath: 'polygon(4% 0%, 96% 0%, 100% 25%, 96% 50%, 100% 75%, 96% 100%, 0% 100%, 4% 75%, 0% 50%, 4% 25%)'
    }}
  />
);

const allFaqs = [
  {
    q: 'Is Dia really free?',
    a: 'Yes! The core conversational experience is completely free to use. No hidden paywalls or surprise subscriptions.',
    bg: 'bg-[#FEF6C6] dark:bg-[#2A2619]',
    border: 'border-[#F0E494] dark:border-[#4A432A]',
    tapePosition: 'left' as const,
    rotation: '-1.5deg',
  },
  {
    q: 'How does it stay private?',
    a: 'Dia processes your conversations on your own device. Your intimate thoughts never hit our external servers.',
    bg: 'bg-[#E2F7E1] dark:bg-[#1B2921]',
    border: 'border-[#BDEDA8] dark:border-[#2D4537]',
    tapePosition: 'center' as const,
    rotation: '1.2deg',
  },
  {
    q: 'Can it replace a therapist?',
    a: 'No. Dia is an AI companion for emotional support and reflection, not a substitute for professional clinical care.',
    bg: 'bg-[#FFECDF] dark:bg-[#2C211B]',
    border: 'border-[#F8C6A5] dark:border-[#4A372E]',
    tapePosition: 'right' as const,
    rotation: '-1.2deg',
  },
  {
    q: 'What devices are supported?',
    a: 'Dia runs in modern web browsers across desktop computers, tablets, and mobile smartphones.',
    bg: 'bg-[#E1F1FF] dark:bg-[#1B252E]',
    border: 'border-[#B2D8FC] dark:border-[#2B3B4A]',
    tapePosition: 'left' as const,
    rotation: '1.8deg',
  },
  {
    q: 'Is it always available?',
    a: 'Yes — since it runs locally inside your browser, you can chat with Dia even when you are offline.',
    bg: 'bg-[#F3E8FF] dark:bg-[#251B2E]',
    border: 'border-[#DBBBFC] dark:border-[#3E2B4A]',
    tapePosition: 'right' as const,
    rotation: '-1.5deg',
  },
  {
    q: 'How do I clear or delete my data?',
    a: 'You can clear your chat history anytime from Settings. Your data lives on your device, so clearing site storage removes everything permanently.',
    bg: 'bg-[#FFF0F5] dark:bg-[#2E1B24]',
    border: 'border-[#FFB6C1] dark:border-[#4A2B3B]',
    tapePosition: 'center' as const,
    rotation: '1.5deg',
  },
];

export default function FAQSection() {
  const [expanded, setExpanded] = useState(false);

  // Show 3 notes initially, show all 6 when expanded
  const visibleFaqs = expanded ? allFaqs : allFaqs.slice(0, 3);

  return (
    <section className="relative z-20 py-16 sm:py-32 bg-[#FBF9F4] dark:bg-[#141311] border-b border-[#E5E0D8] dark:border-[#262320] min-h-fit md:min-h-screen flex flex-col justify-center transition-colors duration-300 transform-gpu">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-[#F5F2EC] mb-3">
            Frequently asked <span className="italic font-serif font-medium text-neutral-500 dark:text-neutral-400">questions</span>
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 text-base max-w-xl mx-auto">
            Everything you need to know about Dia, privacy, and how it works.
          </p>
        </div>

        {/* Rectangular Wooden Bulletin Board */}
        <div className="relative p-6 sm:p-10 rounded-2xl bg-[#DFD3BA] dark:bg-[#26221B] border-[10px] sm:border-[12px] border-[#7F6043] dark:border-[#473B2E] shadow-[0_20px_50px_rgba(0,0,0,0.12)] overflow-hidden">
          
          {/* Wooden Frame Inner Shadow */}
          <div className="absolute inset-0 pointer-events-none shadow-[inset_0_4px_16px_rgba(0,0,0,0.22)] rounded-lg z-20" />

          {/* Smooth Warm Linen Grain Texture (No Dotted Matrix Grid) */}
          <div 
            className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-multiply rounded-lg"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />

          {/* Grid Layout of Pinned Sticky Notes — Fully Visible */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 relative z-10 pt-4 pb-4">
            <AnimatePresence initial={false}>
              {visibleFaqs.map((faq, index) => (
                <motion.div
                  key={faq.q}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="relative flex"
                  style={{
                    transform: `rotate(${faq.rotation})`,
                  }}
                >
                  {/* Washi Tape */}
                  <NoteTape position={faq.tapePosition} />

                  {/* Sticky Note */}
                  <div 
                    className={`w-full min-h-[220px] p-6 sm:p-7 rounded-sm ${faq.bg} border ${faq.border} shadow-[0_8px_20px_rgba(0,0,0,0.08)] flex flex-col justify-between hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)] transition-shadow`}
                  >
                    {/* Paper Corner Crease */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-black/5 dark:from-white/5 via-transparent to-transparent pointer-events-none" />

                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-[#F5F2EC] mb-3 font-serif leading-snug">
                        {faq.q}
                      </h3>
                      <p className="text-neutral-700 dark:text-[#C5BEB2] leading-relaxed text-sm sm:text-base">
                        {faq.a}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-black/5 dark:border-white/10 flex justify-end">
                      <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase">
                        NOTE #{index + 1}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* View More / View Less Button */}
          <div className="mt-8 pt-4 text-center relative z-30">
            <button
              onClick={() => setExpanded(!expanded)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7F6043] dark:bg-[#473B2E] hover:bg-[#6A4F35] dark:hover:bg-[#594B3B] text-white font-semibold text-sm shadow-md transition-all hover:scale-105"
            >
              <span>{expanded ? 'Show fewer questions' : 'View more questions'}</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
