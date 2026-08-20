import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';
import Logo from '@/components/Logo';

export const metadata: Metadata = {
  title: 'Privacy Policy — Dia Chat',
  description: 'How Dia Chat handles your data and protects your privacy.',
};

const sections = [
  {
    title: 'What We Collect',
    body: `When you sign in, we receive your name, email address, and profile picture from Google — only what Google shares with us. Your conversations with Dia are stored locally on your device using your browser's storage. They do not travel to our servers.`,
  },
  {
    title: 'How We Use It',
    body: `Your profile information is used solely to identify your account and personalise your experience. We do not sell, share, or use your data for advertising. We do not read your conversations.`,
  },
  {
    title: 'On-Device Processing',
    body: `Dia runs language models directly inside your browser. Your messages are processed on your own device, not on our infrastructure. This means what you tell Dia stays with you.`,
  },
  {
    title: 'Third-Party Services',
    body: `We use Google Sign-In for authentication. Google's own privacy policy governs the data you share with them during sign-in. We use Firebase to store your account metadata (name, email, profile picture). No conversation data is stored in Firebase.`,
  },
  {
    title: 'Data Deletion',
    body: `You can delete your account at any time from the Settings page inside the app. This removes your profile data from our systems. Locally stored conversations can be cleared by clearing your browser's site data.`,
  },
  {
    title: 'Changes to This Policy',
    body: `We may update this policy as our service evolves. We will update the "Last updated" date below when we do. Continued use of Dia Chat after changes constitutes acceptance.`,
  },
  {
    title: 'Contact',
    body: `Questions? Reach us at the DiaLabs GitHub or via dialabs.tech.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FBF9F4] font-sans">

      {/* Minimal header */}
      <header className="border-b border-[#E5E0D8] bg-[#FBF9F4]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-neutral-900 font-bold">
            <Logo className="w-7 h-7 text-primary" />
            <span>Dia Chat</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24">

        {/* Page heading */}
        <div className="mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-semibold text-neutral-700 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            Privacy Policy
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 mb-4 leading-tight">
            Your privacy,<br />
            <span className="italic font-serif font-medium text-neutral-500">taken seriously.</span>
          </h1>
          <p className="text-neutral-500 text-base">Last updated: February 10, 2026</p>
        </div>

        {/* Lead paragraph */}
        <p className="text-lg text-neutral-700 leading-relaxed mb-14 border-l-4 border-primary/40 pl-5">
          Dia is built on a simple premise: your conversations are yours. We designed the product 
          around on-device processing so that your most personal moments never leave your device.
        </p>

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-bold text-neutral-900 mb-3">{section.title}</h2>
              <p className="text-neutral-600 leading-relaxed">{section.body}</p>
              {i < sections.length - 1 && (
                <div className="mt-12 h-px bg-gradient-to-r from-transparent via-[#E5E0D8] to-transparent" />
              )}
            </div>
          ))}
        </div>

      </main>

      {/* Footer strip */}
      <footer className="border-t border-[#E5E0D8] py-8 mt-16">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
          <p>© {new Date().getFullYear()} DiaLabs. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-neutral-700 transition-colors">Terms</Link>
            <a href="https://dialabs.tech" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-700 transition-colors">DiaLabs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
