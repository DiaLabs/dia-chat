'use client';

import { motion } from 'framer-motion';

export default function QuoteSection() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center justify-center bg-transparent z-10 border-b border-[#E5E0D8]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.p
            className="text-3xl sm:text-4xl md:text-5xl font-serif text-neutral-800 leading-tight md:leading-tight mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            "The greatest illusion of communication is the illusion that it has taken place."
          </motion.p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-12 bg-[#F0A955]"></div>
            <p className="text-lg font-semibold tracking-wide text-neutral-600 uppercase">
              George Bernard Shaw
            </p>
            <div className="h-px w-12 bg-[#F0A955]"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
