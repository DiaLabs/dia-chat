'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import Header from '@/components/Header';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <Header />
      
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">
              Privacy Policy
            </h1>
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-12">
            Last updated: February 10, 2026
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Your Privacy Matters
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                At Dia Chat, we believe your conversations should remain private. This privacy policy 
                explains how we handle your information when you use our service.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                What We Collect
              </h2>
              <div className="space-y-4 text-neutral-600 dark:text-neutral-400">
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Authentication Information
                  </h3>
                  <p className="leading-relaxed">
                    When you sign in with Google, we receive your name, email address, and profile 
                    picture. This helps us identify you and personalize your experience.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Chat Data
                  </h3>
                  <p className="leading-relaxed">
                    Your conversations with Dia are stored locally in your browser using IndexedDB. 
                    We don't send your chats to our servers or store them in any cloud database.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Settings & Preferences
                  </h3>
                  <p className="leading-relaxed">
                    Your theme preferences, accent colors, and other settings are stored locally 
                    in your browser to enhance your experience.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                How We Use Your Information
              </h2>
              <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>To authenticate your account and maintain your session</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>To personalize your chat experience with Dia</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>To store your preferences and settings locally</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>To improve the AI model responses (anonymized data only)</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Data Storage & Security
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Your chat history never leaves your device. Everything is stored locally using 
                browser storage (IndexedDB), which means:
              </p>
              <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Only you can access your conversations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Your chats are tied to your browser and device</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Clearing your browser data will delete your chat history</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>We use Firebase Authentication for secure sign-in</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Third-Party Services
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                We use the following third-party services:
              </p>
              <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span><strong>Google Firebase:</strong> For authentication and user management</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span><strong>AI Model Providers:</strong> For generating chat responses (your messages are processed but not stored)</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Your Rights
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                You have full control over your data. You can delete your chat history anytime 
                from the settings menu. Since data is stored locally, you can also clear it by 
                clearing your browser's storage. To delete your account, simply sign out and 
                revoke access from your Google account settings.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Contact Us
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Questions about our privacy practices? Reach out to us on{' '}
                <a 
                  href="https://github.com/dialabs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-600 dark:text-amber-400 hover:underline"
                >
                  GitHub
                </a>
                .
              </p>
            </section>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} DiaLabs — made with heart and care
            </p>
            <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
              <a 
                href="https://github.com/dialabs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                About
              </a>
              <Link href="/privacy" className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
