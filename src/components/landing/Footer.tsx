'use client';

import { ExternalLink, Lightbulb, Shield } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E0D8] bg-[#FBF9F4] relative py-14 sm:py-20 overflow-hidden">

      {/* Watermark — scaled down on mobile so it doesn't clip */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <span className="text-[22vw] sm:text-[16vw] font-bold font-mono uppercase leading-none tracking-tighter text-neutral-200/40">
          DiaLabs
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">

        {/* Brand row (always full-width on top) */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 mb-12">
          <div className="space-y-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-bold text-neutral-900"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            >
              <Logo className="w-6 h-6 text-primary" />
              <span className="text-lg">Dia Chat</span>
            </Link>
            <p className="text-sm text-neutral-500">AI Therapist for GenZ</p>
          </div>

          {/* Link columns — 3-col grid on mobile, inline on md */}
          <div className="grid grid-cols-3 sm:flex sm:gap-16 gap-x-6 gap-y-8">

            {/* Product */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="#demo" className="hover:text-primary transition-colors">What is Dia</Link></li>
                <li><Link href="#demo" className="hover:text-primary transition-colors">How it works</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors">Features</Link></li>
                <li><a href="/chat" className="hover:text-primary transition-colors">Launch App</a></li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <a href="https://dialabs.tech" target="_blank" rel="noopener noreferrer"
                    className="hover:text-primary transition-colors flex items-center gap-1 font-semibold">
                    <img
                      src="https://www.dialabs.tech/favicon.ico"
                      className="w-4 h-4 rounded grayscale opacity-50"
                      alt="DiaLabs"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    DiaLabs
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
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">More</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms</Link></li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-5 border-t border-[#E5E0D8] flex items-center justify-center">
          <p className="text-xs text-neutral-400 text-center">
            © {new Date().getFullYear()} DiaLabs. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
