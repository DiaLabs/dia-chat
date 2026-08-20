'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight } from 'lucide-react';

const perks = [
  'Unlimited conversations',
  'Zero data harvesting',
  'Runs entirely on-device',
  'No hidden fees. Seriously.',
];

export default function PricingGag() {
  const { signInWithGoogle } = useAuth();

  return (
    <section id="pricing" className="relative px-4 sm:px-6 lg:px-8 py-24 sm:py-32 bg-[#F0A955] overflow-hidden border-b border-[#e09844]">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-bold uppercase tracking-[0.25em] text-neutral-900/60 mb-4">
            Pricing
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-3">
            We tried to charge you.
          </h2>
          <p className="text-lg sm:text-xl text-neutral-800/70 max-w-xl mx-auto">
            We really did. Spent three days building a paywall. Then remembered we liked you.
          </p>
        </motion.div>

        {/* Price + Features row */}
        <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-8">
          
          {/* Price card */}
          <motion.div
            className="flex-1 bg-[#FBF9F4] rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center text-center border border-[#e09844]/40 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-widest mb-4">Every single plan</p>
            <div className="flex items-baseline justify-center gap-1 mb-2">
              <span className="text-8xl font-bold text-neutral-900 leading-none">$0</span>
            </div>
            <p className="text-neutral-500 text-lg font-medium mb-6">/ forever</p>
            <button
              onClick={signInWithGoogle}
              className="group inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary hover:bg-primary-hover text-neutral-900 font-bold text-base transition-all hover:scale-105 shadow-sm border border-primary/20"
            >
              Get started free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Perks list */}
          <motion.div
            className="flex-1 bg-neutral-900 rounded-3xl p-8 sm:p-10 flex flex-col justify-center shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
          >
            <p className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-6">What you get</p>
            <div className="space-y-4">
              {perks.map((perk, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  </div>
                  <span className="text-neutral-100 font-medium">{perk}</span>
                </motion.div>
              ))}
            </div>
            <p className="mt-8 text-xs text-neutral-500 italic leading-relaxed">
              We thought about adding a $99/mo plan that just gives you a cooler font. We decided against it.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
