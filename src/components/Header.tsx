'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
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
  { name: 'What is Dia', href: '#what-is-dia' },
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'Features', href: '#features' },
];

const legalNavLinks: NavLink[] = [
  { name: 'About', href: 'https://github.com/dialabs', external: true },
  { name: 'Privacy', href: '/privacy' },
  { name: 'Terms', href: '/terms' },
];

export default function Header() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
          'navbar flex items-center mx-auto',
          scrolled ? 'navbar-floating px-4 sm:px-6 py-3' : 'navbar-top px-4 sm:px-6 py-3',
          'relative justify-center md:justify-between'
        )}
      >
        {/* Left - Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 flex-1">
          {navLinks.map((link) => (
            link.external ? (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            )
          ))}
        </div>

        {/* Mobile menu button - absolute positioned on left */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 absolute left-6"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          ) : (
            <MenuIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
          )}
        </button>

        {/* Center - Logo - Centered on mobile, static on desktop */}
        <Link 
          href="/" 
          className="flex items-center gap-2"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <Logo className="w-8 h-8 text-amber-500" />
          <span className="text-xl font-semibold text-neutral-900 dark:text-white">
            Dia Chat
          </span>
        </Link>

        {/* Right - Auth - absolute positioned on right for mobile */}
        <div className="flex items-center gap-3 md:justify-end md:flex-1 absolute right-5 md:static">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 animate-pulse" />
          ) : user ? (
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </MenuButton>

              <MenuItems className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none p-1">
                <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-700">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
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
                          ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                          : 'text-neutral-700 dark:text-neutral-300'
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-400 hover:bg-amber-500 text-neutral-900 text-sm font-semibold transition-colors"
            >
              Sign in
            </button>
          )}
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mt-2 mx-4 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {link.name}
                </a>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}