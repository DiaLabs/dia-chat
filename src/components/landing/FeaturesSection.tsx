'use client';

import { motion } from 'framer-motion';

interface IconProps {
  color: string;
}

// Custom Hand-drawn SVG doodle icons that draw their outlines first, then fill in fully
const HandDrawnHeart = ({ color }: IconProps) => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Main Heart Path - Animates outline first, then fills completely */}
    <motion.path
      d="M50 82 C25 65, 10 45, 12 30 C14 15, 30 12, 42 22 C47 26, 50 30, 50 30 C50 30, 53 26, 58 22 C70 12, 86 15, 88 30 C90 45, 75 65, 50 82 Z"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, fill: 'transparent', fillOpacity: 0 }}
      whileInView={{ 
        pathLength: 1, 
        fill: color,
        fillOpacity: 0.18 
      }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        pathLength: { duration: 1.2, ease: "easeOut" },
        fill: { duration: 0.8, delay: 0.8 },
        fillOpacity: { duration: 0.8, delay: 0.8 }
      }}
    />
    {/* Secondary Imperfect Sketchy Outline for hand-drawn look */}
    <motion.path
      d="M51 80 C27 63, 13 46, 15 32 C17 18, 31 14, 43 23 C48 27, 50 30, 50 30 C50 30, 52 27, 57 23 C68 14, 84 17, 86 32 C88 46, 73 63, 51 80 Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.5"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 0.95 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.4, delay: 0.1, ease: "easeOut" }}
    />
  </svg>
);

const HandDrawnChat = ({ color }: IconProps) => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Main Chat Bubble - Animates outline first, then fills completely */}
    <motion.path
      d="M18 45 C15 25, 35 15, 52 16 C70 17, 86 28, 84 48 C82 66, 64 74, 46 72 C38 71, 30 76, 22 81 C25 73, 23 66, 19 60 C15 55, 18 48, 18 45 Z"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, fill: 'transparent', fillOpacity: 0 }}
      whileInView={{ 
        pathLength: 1, 
        fill: color,
        fillOpacity: 0.18 
      }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        pathLength: { duration: 1.2, ease: "easeOut" },
        fill: { duration: 0.8, delay: 0.8 },
        fillOpacity: { duration: 0.8, delay: 0.8 }
      }}
    />
    {/* Secondary Imperfect Sketchy Outline */}
    <motion.path
      d="M20 46 C17 27, 36 17, 53 18 C71 19, 84 30, 82 49 C80 65, 63 72, 47 71 C39 70, 31 75, 23 80 C26 73, 24 67, 20 60 Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.5"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 0.95 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.4, delay: 0.1, ease: "easeOut" }}
    />
    <motion.path 
      d="M36 46 H44 M52 46 H64" 
      stroke={color} 
      strokeWidth="3" 
      strokeLinecap="round" 
      opacity="0.8" 
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: 0.6 }}
    />
  </svg>
);

const HandDrawnLock = ({ color }: IconProps) => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Lock Body - Animates outline first, then fills completely */}
    <motion.rect
      x="22"
      y="42"
      width="56"
      height="44"
      rx="8"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0, fill: 'transparent', fillOpacity: 0 }}
      whileInView={{ 
        pathLength: 1, 
        fill: color,
        fillOpacity: 0.18 
      }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ 
        pathLength: { duration: 1.1, ease: "easeOut" },
        fill: { duration: 0.8, delay: 0.8 },
        fillOpacity: { duration: 0.8, delay: 0.8 }
      }}
    />
    <motion.rect
      x="24"
      y="44"
      width="52"
      height="40"
      rx="6"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.5"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 0.95 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.3, delay: 0.1, ease: "easeOut" }}
    />
    {/* Lock Shackle */}
    <motion.path
      d="M34 42 V28 C34 18, 42 14, 50 14 C58 14, 66 18, 66 28 V42"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.3, delay: 0.2, ease: "easeOut" }}
    />
    <motion.path
      d="M36 42 V29 C36 20, 43 16, 50 16 C57 16, 64 20, 64 29 V42"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.5"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 0.95 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
    />
    {/* Keyhole */}
    <motion.circle 
      cx="50" 
      cy="58" 
      r="4" 
      fill={color} 
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: 0.7 }}
    />
    <motion.path 
      d="M50 62 V70" 
      stroke={color} 
      strokeWidth="3" 
      strokeLinecap="round" 
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.8 }}
    />
  </svg>
);

const features = [
  {
    IconComponent: HandDrawnHeart,
    tag: 'NOTE 01 — EMPATHY',
    title: 'Empathetic by Design',
    description:
      'Dia goes beyond keywords. It recognizes feelings, vulnerabilities, and mood fluctuations to provide genuine support when you need it most.',
    color: '#F0A955',
    rotation: '-1.5deg',
    tapePosition: 'left',
    stickyTop: 'top-28 sm:top-36',
  },
  {
    IconComponent: HandDrawnChat,
    tag: 'NOTE 02 — FLOW',
    title: 'Conversations That Flow',
    description:
      'No robotic menus or rigid workflows. Speak your mind naturally in free text, and Dia responds with organic, flowing thoughts like a trusted friend.',
    color: '#4B5563',
    rotation: '1.5deg',
    tapePosition: 'right',
    stickyTop: 'top-32 sm:top-40',
  },
  {
    IconComponent: HandDrawnLock,
    tag: 'NOTE 03 — PRIVACY',
    title: 'Completely Private',
    description:
      "Your thoughts stay yours. With on-device generation, your most vulnerable moments are never sent to external servers. Ever.",
    color: '#059669',
    rotation: '-0.8deg',
    tapePosition: 'center',
    stickyTop: 'top-36 sm:top-44',
  },
];

export default function FeaturesSection() {
  return (
    <section 
      id="features" 
      className="relative z-20 -mt-10 sm:-mt-16 px-4 sm:px-6 lg:px-8 py-16 sm:py-32 bg-[#F3EEE6] dark:bg-[#181714] border-t border-b border-[#E0D8CC] dark:border-[#2C2924] shadow-[0_-25px_60px_rgba(0,0,0,0.06)] rounded-t-[32px] sm:rounded-t-[48px] overflow-hidden min-h-fit md:min-h-screen flex flex-col justify-center transition-colors duration-300 transform-gpu"
    >
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-[#F5F2EC] mb-4">
            A different kind of <span className="italic font-serif font-medium text-neutral-500 dark:text-neutral-400">AI companion</span>
          </h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Empathetic. Private. Designed to listen when you need it most.
          </p>
        </div>

        {/* Stacked Native Sticky Cards */}
        <div className="relative space-y-10 sm:space-y-14 pb-8 sm:pb-12">
          {features.map((feature, index) => {
            const Icon = feature.IconComponent;
            return (
              <div
                key={index}
                className={`relative md:sticky ${feature.stickyTop} z-${(index + 1) * 10} transition-transform duration-200 pt-5 transform-gpu`}
                style={{
                  transform: `rotate(${feature.rotation})`,
                }}
              >
                {/* Washi Tape */}
                <div 
                  className={`absolute top-0 ${
                    feature.tapePosition === 'left' 
                      ? 'left-8 sm:left-16 -rotate-6' 
                      : feature.tapePosition === 'right' 
                      ? 'right-8 sm:right-16 rotate-6' 
                      : 'left-1/2 -translate-x-1/2 -rotate-1'
                  } w-32 h-8 bg-[#F5DC9C]/90 dark:bg-[#7A6230]/80 border-t border-b border-[#E0C37B]/70 dark:border-[#967B40]/60 shadow-xs pointer-events-none z-30`}
                  style={{
                    clipPath: 'polygon(0% 0%, 5% 100%, 95% 100%, 100% 0%, 97% 50%, 3% 50%)',
                  }}
                />

                {/* Notebook Sheet Card */}
                <div className="relative bg-[#FFFDF8] dark:bg-[#22201C] rounded-2xl border border-[#E0D8CC] dark:border-[#2C2924] shadow-md p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8 md:gap-12 transition-colors duration-300">
                  
                  {/* Left Column: Sketch Doodles */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center relative">
                    <Icon color={feature.color} />
                  </div>

                  {/* Right Column: Ruled Line Journal Content */}
                  <div className="flex-1 space-y-4 relative pl-4 sm:pl-8 border-l border-red-200/60 dark:border-red-950/40">
                    <div className="text-[11px] font-mono tracking-widest text-[#B2A895] dark:text-[#7A7263] uppercase">
                      {feature.tag}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-800 dark:text-[#E8E2D5]">
                      {feature.title}
                    </h3>
                    
                    {/* Ruled Notebook Lines */}
                    <div className="relative py-2 leading-relaxed">
                      {/* Journal lines texture */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-50 dark:opacity-30">
                        <div className="w-full border-b border-[#E8E2D5] dark:border-[#38342E] h-7" />
                        <div className="w-full border-b border-[#E8E2D5] dark:border-[#38342E] h-7" />
                        <div className="w-full border-b border-[#E8E2D5] dark:border-[#38342E] h-7" />
                      </div>
                      
                      <p className="relative z-10 text-sm sm:text-base text-neutral-600 dark:text-[#ADA595] leading-7 font-serif italic">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
