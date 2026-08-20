'use client';

// Custom Hand-drawn SVG doodle icons with organic sketch lines
const HandDrawnHeart = ({ color }: { color: string }) => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 82 C25 65, 10 45, 12 30 C14 15, 30 12, 42 22 C47 26, 50 30, 50 30 C50 30, 53 26, 58 22 C70 12, 86 15, 88 30 C90 45, 75 65, 50 82 Z"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-90"
    />
    <path
      d="M51 80 C27 63, 13 46, 15 32 C17 18, 31 14, 43 23 C48 27, 50 30, 50 30 C50 30, 52 27, 57 23 C68 14, 84 17, 86 32 C88 46, 73 63, 51 80 Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-60"
    />
    <circle cx="28" cy="30" r="2.5" fill={color} className="opacity-70" />
  </svg>
);

const HandDrawnChat = ({ color }: { color: string }) => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M18 45 C15 25, 35 15, 52 16 C70 17, 86 28, 84 48 C82 66, 64 74, 46 72 C38 71, 30 76, 22 81 C25 73, 23 66, 19 60 C15 55, 18 48, 18 45 Z"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M20 46 C17 27, 36 17, 53 18 C71 19, 84 30, 82 49 C80 65, 63 72, 47 71 C39 70, 31 75, 23 80 C26 73, 24 67, 20 60 Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-50"
    />
    <path d="M36 46 H44 M52 46 H64" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
  </svg>
);

const HandDrawnLock = ({ color }: { color: string }) => (
  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="22"
      y="42"
      width="56"
      height="44"
      rx="8"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="24"
      y="44"
      width="52"
      height="40"
      rx="6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="opacity-50"
    />
    <path
      d="M34 42 V28 C34 18, 42 14, 50 14 C58 14, 66 18, 66 28 V42"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M36 42 V29 C36 20, 43 16, 50 16 C57 16, 64 20, 64 29 V42"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      className="opacity-60"
    />
    <circle cx="50" cy="58" r="4" fill={color} />
    <path d="M50 62 V70" stroke={color} strokeWidth="3" strokeLinecap="round" />
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
        
        {/* Section Header with standard hierarchy */}
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
                    clipPath: 'polygon(3% 0%, 97% 0%, 100% 20%, 96% 40%, 100% 60%, 96% 80%, 100% 100%, 0% 100%, 4% 80%, 0% 60%, 4% 40%, 0% 20%)'
                  }}
                />

                {/* Journal Paper Slip */}
                <div className="relative w-full bg-[#FFFDF8] dark:bg-[#22201C] border border-[#E5E0D8] dark:border-[#38342E] p-6 sm:p-10 md:p-12 shadow-[0_12px_32px_-5px_rgba(0,0,0,0.07)] dark:shadow-[0_12px_32px_-5px_rgba(0,0,0,0.5)] rounded-sm overflow-hidden">
                  
                  {/* Paper grain texture */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-multiply"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                  />

                  {/* Visible Ruled Blue Notebook Lines */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-[0.55] dark:opacity-[0.25]"
                    style={{
                      backgroundImage: 'linear-gradient(transparent 31px, #CBD5E1 32px)',
                      backgroundSize: '100% 32px',
                    }}
                  />

                  {/* Red Double Vertical Margin Line */}
                  <div className="absolute left-8 sm:left-16 top-0 bottom-0 w-0.5 bg-red-400/60 dark:bg-red-500/40 pointer-events-none" />

                  {/* Soft Fold Shadow Gradient */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-900/5 via-transparent to-transparent pointer-events-none" />

                  {/* Inner Content Layout */}
                  <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10 pl-4 sm:pl-12">
                    {/* Larger Hand-drawn Icon */}
                    <div className="shrink-0 flex items-center justify-center w-20 h-20 sm:w-28 sm:h-28 pt-1">
                      <Icon color={feature.color} />
                    </div>

                    {/* Text Details */}
                    <div className="text-center sm:text-left flex-1">
                      <span className="inline-block text-[11px] font-mono font-bold tracking-[0.2em] text-neutral-400 dark:text-neutral-500 uppercase mb-1.5 bg-[#FFFDF8]/80 dark:bg-[#22201C]/80 px-1 rounded-xs">
                        {feature.tag}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-[#F5F2EC] mb-3 font-serif">
                        {feature.title}
                      </h3>
                      <p className="text-base sm:text-lg text-neutral-700 dark:text-[#C5BEB2] leading-[32px] max-w-xl">
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
