'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, Search, Frown } from 'lucide-react';
import Logo from '@/components/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white dark:bg-black">
      <motion.div 
        className="max-w-md w-full text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div 
          className="mb-8 inline-flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative">
            <Logo className="w-16 h-16 text-amber-500" />
            <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full" />
          </div>
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="text-8xl font-bold text-neutral-200 dark:text-neutral-800 mb-2">
            404
          </div>
          <div className="flex items-center justify-center gap-2 text-neutral-500 dark:text-neutral-400 mb-6">
            <Frown className="w-5 h-5" />
            <span className="text-lg">Page not found</span>
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-3">
            Oops! This page doesn't exist
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            The page you're looking for might have been moved, deleted, or never existed in the first place.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-500 text-neutral-900 font-semibold transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white font-semibold transition-all hover:scale-105"
          >
            <Search className="w-4 h-4" />
            Start Chatting
          </Link>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-sm text-neutral-500 dark:text-neutral-400"
        >
          Need help?{' '}
          <a
            href="https://github.com/dialabs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 dark:text-amber-400 hover:underline"
          >
            Visit our GitHub
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
