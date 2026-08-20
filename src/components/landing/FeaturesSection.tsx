'use client';

import { motion } from 'framer-motion';
import { Heart, MessageSquare, Lock } from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Empathetic by Design',
    description:
      'Dia goes beyond keywords. It recognizes feelings, vulnerabilities, and mood fluctuations to provide genuine support when you need it most.',
    color: '#F0A955',
  },
  {
    icon: MessageSquare,
    title: 'Conversations That Flow',
    description:
      'No robotic menus or rigid workflows. Speak your mind naturally in free text, and Dia responds with organic, flowing thoughts like a trusted friend.',
    color: '#4B5563',
  },
  {
    icon: Lock,
    title: 'Completely Private',
    description:
      "Your thoughts stay yours. With on-device generation, your most vulnerable moments are never sent to external servers. Ever.",
    color: '#059669',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="relative px-4 sm:px-6 lg:px-8 py-24 sm:py-32 bg-[#FBF9F4] border-b border-[#E5E0D8]">
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-4">
            A different kind of{' '}
            <span className="italic font-serif font-medium text-neutral-500">AI companion</span>
          </h2>
        </motion.div>

        {/* On mobile: stacked cards. On desktop: alternating layout */}
        <div className="flex flex-col gap-12 sm:gap-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col sm:flex-row ${
                  index % 2 === 1 ? 'sm:flex-row-reverse' : ''
                } items-center gap-8 sm:gap-14`}
              >
                {/* Icon — big, naked, no box */}
                <div className="shrink-0 flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32">
                  <Icon
                    className="w-full h-full"
                    style={{ color: feature.color }}
                    strokeWidth={1.3}
                  />
                </div>

                {/* Text */}
                <div className={`text-center sm:text-left ${index % 2 === 1 ? 'sm:text-right' : ''}`}>
                  <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-md">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
