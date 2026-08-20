'use client';

import { useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'Is Dia really free?',
    a: 'Yes! The core conversational experience is completely free to use.',
  },
  {
    q: 'How does it stay private?',
    a: "Dia processes your conversations on your own device. Your intimate thoughts never hit our servers.",
  },
  {
    q: 'Can it replace a therapist?',
    a: 'No. Dia is an AI companion for emotional support, not a replacement for professional clinical care.',
  },
  {
    q: 'What devices are supported?',
    a: 'Dia runs in your modern web browser on both desktop and mobile devices.',
  },
  {
    q: 'Is it always available?',
    a: 'Yes — since it runs locally, you can even chat with Dia when you are offline.',
  },
];

export default function FAQSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHovering = useRef(false);

  // Wheel handler: while hovering, redirect vertical scroll to horizontal
  // and prevent page scrolling until we hit the start or end of the track
  const handleWheel = useCallback((e: WheelEvent) => {
    const el = scrollRef.current;
    if (!el || !isHovering.current) return;

    const atStart = el.scrollLeft <= 0;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;

    // Allow page scroll only when at boundary and scrolling in that direction
    if ((atStart && e.deltaY < 0) || (atEnd && e.deltaY > 0)) return;

    e.preventDefault();
    el.scrollLeft += e.deltaY * 1.5;
  }, []);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  return (
    <section
      className="relative py-24 sm:py-32 bg-white border-b border-[#E5E0D8]"
      onMouseEnter={() => { isHovering.current = true; }}
      onMouseLeave={() => { isHovering.current = false; }}
    >
      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-2">
          Frequently asked{' '}
          <span className="italic font-serif font-medium text-neutral-500">questions</span>
        </h2>
        <p className="text-sm text-neutral-400">Hover and scroll to explore &rarr;</p>
      </motion.div>

      {/* Horizontally scrollable strip — no scrollbar visible */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto pl-4 sm:pl-8 pr-4 sm:pr-8 pb-4 cursor-grab active:cursor-grabbing select-none"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {/* Hide webkit scrollbar */}
        <style>{`.faq-scroll::-webkit-scrollbar { display: none; }`}</style>

        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.06 }}
            className="shrink-0 w-[280px] sm:w-[360px] p-7 rounded-3xl bg-[#FBF9F4] border border-[#E5E0D8]"
          >
            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-3">{faq.q}</h3>
            <p className="text-neutral-600 leading-relaxed text-sm sm:text-base">{faq.a}</p>
          </motion.div>
        ))}

        {/* End spacer */}
        <div className="shrink-0 w-4 sm:w-8" />
      </div>
    </section>
  );
}
