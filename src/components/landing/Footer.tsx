'use client';

import { ExternalLink, Lightbulb, Shield, Globe, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function Footer() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <footer className="border-t border-[#E5E0D8] dark:border-[#262320] bg-[#FBF9F4] dark:bg-[#100F0E] relative z-20 py-14 sm:py-20 overflow-hidden transition-colors duration-300">

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <span className="text-[22vw] sm:text-[16vw] font-bold font-mono uppercase leading-none tracking-tighter text-neutral-200/40 dark:text-neutral-800/30 transition-colors duration-300">
          DiaLabs
        </span>
      </div>

      <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

        {/* Brand row & link columns grouped together */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10 md:gap-16 mb-12">
          
          {/* Brand Info & Theme Toggle */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <Logo className="w-6 h-6 text-primary" />
              <span className="text-lg">Dia Chat</span>
            </Link>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Empathetic AI Companion</p>

            {/* Appearance Toggle pill from screenshot */}
            <div className="pt-3 flex items-center gap-3">
              <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-neutral-400 dark:text-neutral-500 uppercase select-none">
                APPEARANCE
              </span>
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="relative w-[74px] h-9 rounded-full bg-neutral-200/90 dark:bg-[#1E1D19] border border-neutral-300 dark:border-[#332F28] p-1 flex items-center justify-between cursor-pointer select-none transition-colors"
                aria-label="Toggle appearance"
              >
                {/* Sliding white circle indicator */}
                <motion.div
                  className="absolute top-1 left-1 w-7 h-7 rounded-full bg-white dark:bg-[#38342E] shadow-sm flex items-center justify-center text-neutral-900 dark:text-amber-400 z-0"
                  animate={{ x: isDark ? 36 : 0 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
                {/* Sun icon on left */}
                <div className={`w-7 h-7 flex items-center justify-center z-10 transition-colors ${!isDark ? 'text-neutral-900' : 'text-neutral-500'}`}>
                  <Sun className="w-4 h-4" />
                </div>
                {/* Moon icon on right */}
                <div className={`w-7 h-7 flex items-center justify-center z-10 transition-colors ${isDark ? 'text-amber-300' : 'text-neutral-400'}`}>
                  <Moon className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* Link columns — 3-col grid on mobile, inline on md */}
          <div className="grid grid-cols-3 sm:flex sm:gap-16 gap-x-6 gap-y-8">

            {/* Product */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link href="#demo" onClick={(e) => handleNavClick(e, '#demo')} className="hover:text-primary transition-colors">What is Dia</Link></li>
                <li><Link href="#demo" onClick={(e) => handleNavClick(e, '#demo')} className="hover:text-primary transition-colors">How it works</Link></li>
                <li><Link href="#features" onClick={(e) => handleNavClick(e, '#features')} className="hover:text-primary transition-colors">Features</Link></li>
                <li><a href="/chat" className="hover:text-primary transition-colors">Launch App</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li>
                  <a href="https://dialabs.tech" target="_blank" rel="noopener noreferrer"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1.5 font-semibold">
                    <img
                      src="https://www.dialabs.tech/icon0.svg"
                      className="w-3.5 h-3.5 inline-block opacity-50 dark:invert"
                      alt="DiaLabs"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span>DiaLabs</span>
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
                <li>
                  <a href="https://patentiq.dialabs.tech" target="_blank" rel="noopener noreferrer"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-neutral-400" />
                    PatentIQ
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
                <li>
                  <a href="https://mod.dialabs.tech" target="_blank" rel="noopener noreferrer"
                    className="hover:text-primary transition-colors inline-flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-neutral-400" />
                    Dia Mod
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </li>
              </ul>
            </div>

            {/* More */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">More</h4>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 border-t border-[#E5E0D8] dark:border-[#262320] flex items-center justify-center">
          <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center">
            © {new Date().getFullYear()} DiaLabs. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
