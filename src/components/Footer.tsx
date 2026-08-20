'use client';

import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Monitor, ExternalLink, Lightbulb, Shield } from 'lucide-react';
import Link from 'next/link';
import Logo from './Logo';

export default function Footer() {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();

    const showThemeToggle = !user;

    return (
        <footer className="border-t border-border bg-surface-secondary/40 backdrop-blur-sm relative py-16 sm:py-20 overflow-hidden">

            {/* Big Watermark text behind the main footer content */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                <span className="text-[18vw] font-bold font-mono uppercase leading-none tracking-tighter text-neutral-200/30 ">
                    DiaLabs
                </span>
            </div>

            {/* Footer Content Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 mb-12">

                    {/* Column 1: Brand Info */}
                    <div className="col-span-2 md:col-span-1 space-y-3">
                        <Link
                            href="/"
                            className="flex items-center gap-2 font-bold text-neutral-900 "
                            onClick={(e) => {
                                e.preventDefault();
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        >
                            <Logo className="w-6 h-6 text-primary" />
                            <span className="text-lg">Dia Chat</span>
                        </Link>
                        <p className="text-sm text-neutral-500 ">
                            Empathetic AI Companion
                        </p>
                    </div>

                    {/* Column 2: Product Capabilities */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Product</h4>
                        <ul className="space-y-2 text-sm text-neutral-500 ">
                            <li>
                                <Link href="#what-is-dia" className="hover:text-primary transition-colors">What is Dia</Link>
                            </li>
                            <li>
                                <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
                            </li>
                            <li>
                                <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
                            </li>
                            <li>
                                <a href="/chat" className="hover:text-primary transition-colors">Launch App</a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Company / Open Source */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Company</h4>
                        <ul className="space-y-2 text-sm text-neutral-500 ">
                            <li className="flex items-center gap-2">
                                <a
                                    href="https://dialabs.tech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors flex items-center font-semibold"
                                >
                                    <img
                                        src="https://www.dialabs.tech/favicon.ico"
                                        className="w-4 h-4 inline-block mr-1.5 align-text-bottom rounded-xs grayscale invert brightness-50 opacity-60 "
                                        alt="DiaLabs"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                    DiaLabs
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://patentiq.dialabs.tech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors inline-flex items-center gap-1.5"
                                >
                                    <Lightbulb className="w-4 h-4 text-neutral-400 " />
                                    <span>PatentIQ</span>
                                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://mod.dialabs.tech"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition-colors inline-flex items-center gap-1.5"
                                >
                                    <Shield className="w-4 h-4 text-neutral-400 " />
                                    <span>Dia Mod</span>
                                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: More Info */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">More</h4>
                        <ul className="space-y-2 text-sm text-neutral-500 ">
                            <li>
                                <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Footer Bottom copyright & Theme Toggle */}
                <div className="pt-6 border-t border-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                    <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
                        <p>© {new Date().getFullYear()} DiaLabs. All rights reserved.</p>
                    </div>
                </div>

            </div>
        </footer>
    );
}
