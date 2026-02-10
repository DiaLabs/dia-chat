'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';
import Header from '@/components/Header';

export default function TermsPage() {
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
              <FileText className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h1 className="text-4xl font-bold text-neutral-900 dark:text-white">
              Terms of Service
            </h1>
          </div>

          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-12">
            Last updated: February 10, 2026
          </p>

          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Welcome to Dia Chat
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                By using Dia Chat, you agree to these terms. Please read them carefully. 
                These terms help us provide a safe, supportive space for everyone.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                What Dia Chat Is
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Dia is an AI-powered chat companion designed for emotional support, reflection, 
                and casual conversation. It's meant to be a judgment-free space where you can 
                express yourself freely.
              </p>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <strong className="text-neutral-900 dark:text-white">Important:</strong> Dia is 
                not a replacement for professional mental health care, therapy, or medical advice. 
                If you're experiencing a crisis or need professional help, please reach out to a 
                qualified healthcare provider or crisis hotline.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Using the Service
              </h2>
              <div className="space-y-4 text-neutral-600 dark:text-neutral-400">
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Free to Use
                  </h3>
                  <p className="leading-relaxed">
                    Dia Chat is free to use. You just need a Google account to sign in and 
                    start chatting. No credit card required, no hidden fees.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Your Account
                  </h3>
                  <p className="leading-relaxed">
                    You're responsible for keeping your account secure. Don't share your login 
                    credentials with anyone. If you notice any unauthorized use of your account, 
                    please revoke access through your Google account settings.
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2">
                    Acceptable Use
                  </h3>
                  <p className="leading-relaxed mb-2">
                    Please use Dia Chat respectfully. Don't:
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li className="flex gap-2">
                      <span className="text-amber-500">•</span>
                      <span>Attempt to harm, abuse, or exploit the service</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-500">•</span>
                      <span>Use the service for any illegal purposes</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-500">•</span>
                      <span>Try to reverse engineer or manipulate the AI</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-amber-500">•</span>
                      <span>Interfere with other users' experiences</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                AI-Generated Content
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                Dia's responses are generated by AI and may not always be accurate, appropriate, 
                or helpful. While we strive to make Dia empathetic and supportive, AI has limitations:
              </p>
              <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Responses may occasionally be incorrect or inappropriate</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Dia doesn't have real emotions or consciousness</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Don't rely on Dia for critical decisions or medical advice</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span>Use your own judgment when applying advice from Dia</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Privacy & Data
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Your conversations with Dia are stored locally on your device. We take privacy 
                seriously—please read our{' '}
                <Link href="/privacy" className="text-amber-600 dark:text-amber-400 hover:underline">
                  Privacy Policy
                </Link>
                {' '}to understand how we handle your data.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Service Availability
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                We strive to keep Dia Chat running smoothly, but we can't guarantee 100% uptime. 
                The service may occasionally be unavailable for maintenance, updates, or due to 
                technical issues. We'll do our best to minimize disruptions.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Changes to Terms
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                We may update these terms from time to time. If we make significant changes, 
                we'll let you know by updating the "Last updated" date at the top of this page. 
                Continued use of Dia Chat after changes means you accept the new terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Limitation of Liability
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Dia Chat is provided "as is" without warranties of any kind. We're not liable 
                for any damages arising from your use of the service. Use Dia Chat at your own 
                risk and discretion.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Crisis Resources
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                If you're in crisis or need immediate help, please contact:
              </p>
              <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span><strong>988 Suicide & Crisis Lifeline:</strong> Call or text 988 (US)</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span><strong>Crisis Text Line:</strong> Text HOME to 741741</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-amber-500 mt-1">•</span>
                  <span><strong>Emergency Services:</strong> Call 911 (US) or your local emergency number</span>
                </li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-4">
                Contact
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Questions about these terms? Visit us on{' '}
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

            <div className="mt-16 p-6 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <strong className="text-neutral-900 dark:text-white">Remember:</strong> Dia is 
                here to support you, but it's not a substitute for professional care. Take care 
                of yourself, and don't hesitate to reach out to real people when you need help. 💛
              </p>
            </div>
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
