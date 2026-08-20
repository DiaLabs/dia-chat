'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import { useAuth } from '@/context/AuthContext';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { User, LogOut, Menu as MenuIcon, X } from 'lucide-react';
import clsx from 'clsx';

type NavLink = {
    name: string;
    href: string;
    external?: boolean;
};

const homeNavLinks: NavLink[] = [
    { name: 'How it Works', href: '#demo' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
];

const legalNavLinks: NavLink[] = [
    { name: 'About', href: 'https://github.com/dialabs', external: true },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
];

function HoverNavLink({ name, href, external }: NavLink) {
    const [hovered, setHovered] = useState(false);

    const content = (
        <span className="relative inline-block py-1">
            <span className="relative z-10">{name}</span>
            <svg
                className={clsx(
                    "absolute left-0 -bottom-1 w-full h-1.5 text-primary pointer-events-none transition-opacity duration-200",
                    hovered ? "opacity-100" : "opacity-0"
                )}
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
            >
                <motion.path
                    d="M3 5 Q 50 1 97 5"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: hovered ? 1 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                />
            </svg>
        </span>
    );

    const handleClick = (e: React.MouseEvent) => {
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

    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
                {content}
            </a>
        );
    }

    return (
        <Link
            href={href}
            onClick={handleClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
        >
            {content}
        </Link>
    );
}

export default function Header() {
    const { user, loading, signInWithGoogle, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [logoHovered, setLogoHovered] = useState(false);
    const pathname = usePathname();

    // Determine which nav links to show based on current path
    const isLegalPage = pathname === '/privacy' || pathname === '/terms';
    const navLinks = isLegalPage ? legalNavLinks : homeNavLinks;

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={clsx(
                'fixed top-1 left-0 right-0 z-50 transition-all duration-300',
                scrolled ? 'py-3 px-4' : 'py-6 px-0'
            )}
        >
            <nav
                className={clsx(
                    'navbar flex items-center justify-between w-full mx-auto',
                    scrolled ? 'navbar-floating px-4 sm:px-6 py-3' : 'navbar-top px-4 sm:px-6 py-3',
                    'relative'
                )}
            >
                {/* Left: Mobile Menu Button OR Desktop Nav Links */}
                <div className="flex items-center md:flex-1 justify-start">
                    {/* Mobile menu button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 -ml-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <MenuIcon className="w-5 h-5" />
                        )}
                    </button>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <HoverNavLink key={link.name} {...link} />
                        ))}
                    </div>
                </div>

                {/* Center: Logo (Centered on both mobile and desktop) */}
                <div className="flex items-center justify-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 sm:gap-2.5 group"
                        onMouseEnter={() => setLogoHovered(true)}
                        onMouseLeave={() => setLogoHovered(false)}
                        onClick={(e) => {
                            e.preventDefault();
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                    >
                        <Logo
                            className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 text-primary transition-transform duration-300 group-hover:scale-105"
                            hovered={logoHovered}
                        />
                        <span className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                            Dia Chat
                        </span>
                    </Link>
                </div>

                {/* Right: Auth Controls */}
                <div className="flex items-center justify-end md:flex-1 -mr-2 sm:-mr-3">
                    {loading ? (
                        <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse" />
                    ) : user ? (
                        <Menu as="div" className="relative">
                            <MenuButton className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 transition-colors">
                                {user.photoURL ? (
                                    <img
                                        src={user.photoURL}
                                        alt={user.displayName || 'User'}
                                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                                    />
                                ) : (
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center">
                                        <User className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                            </MenuButton>

                            <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none p-1">
                                <div className="px-4 py-3 border-b border-neutral-100 ">
                                    <p className="text-sm font-medium text-neutral-900 truncate">
                                        {user.displayName}
                                    </p>
                                    <p className="text-xs text-neutral-500 truncate">
                                        {user.email}
                                    </p>
                                </div>

                                <MenuItem>
                                    {({ focus }) => (
                                        <button
                                            onClick={logout}
                                            className={clsx(
                                                'w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg mt-1',
                                                focus
                                                    ? 'bg-neutral-100 text-neutral-900 '
                                                    : 'text-neutral-700 '
                                            )}
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign out
                                        </button>
                                    )}
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    ) : (
                        <button
                            onClick={signInWithGoogle}
                            className="inline-flex items-center gap-1.5 px-5 py-2 md:px-6 md:py-2.5 rounded-full bg-primary hover:bg-primary-hover text-neutral-900 text-sm md:text-base font-bold transition-colors shadow-sm shadow-primary/20"
                        >
                            Sign in
                        </button>
                    )}
                </div>
            </nav>

            {/* Premium Mobile Menu (Subtle Frosted Capsule floating below navbar) */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="md:hidden mt-2 mx-4 p-3 rounded-2xl bg-surface/65 backdrop-blur-xl border border-border/60 shadow-lg"
                    >
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                link.external ? (
                                    <a
                                        key={link.name}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-2.5 rounded-xl text-base font-semibold text-neutral-700 hover:bg-neutral-100/50 transition-colors"
                                    >
                                        {link.name}
                                    </a>
                                ) : (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="px-4 py-2.5 rounded-xl text-base font-semibold text-neutral-700 hover:bg-neutral-100/50 transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.header>
    );
}