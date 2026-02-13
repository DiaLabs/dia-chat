'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import { 
  Shield, 
  Zap, 
  Heart, 
  Sparkles, 
  MessageCircle, 
  Cpu, 
  Lock,
  ArrowRight,
  Check
} from 'lucide-react';

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Home() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Persist CPU preference if present in URL
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('cpu') === 'true' || params.get('forceCPU') === 'true') {
        localStorage.setItem('dia-chat-force-cpu', 'true');
      }
    }

    // Redirect to chat page when user is authenticated
    // Use router.push instead of window.location.href to avoid hard reload
    if (user && !loading) {
      router.push('/chat');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Logo className="w-32 h-32 text-amber-500 animate-pulse" />
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="hero-bg" aria-hidden="true" />
      <Header />
      
      <main className="flex-1 pt-24">
        {/* ===== HERO SECTION ===== */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={stagger}
          >
            {/* Logo */}
            <motion.div 
              variants={fadeInUp}
              transition={{ duration: 0.6 }}
              className="mb-8 inline-flex items-center justify-center"
            >
              <div className="relative">
                <Logo className="w-20 h-20 sm:w-24 sm:h-24 text-amber-500" />
                <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full" />
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6"
            >
              Meet <span className="text-amber-500">Dia!</span>
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl text-neutral-600 dark:text-neutral-300 mb-4"
            >
              Your Empathetic AI Companion
            </motion.p>

            <motion.p 
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto mb-10"
            >
              A safe space for reflection, support, and meaningful conversations. 
              Dia listens without judgment and responds with care.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              variants={fadeInUp}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <button
                onClick={signInWithGoogle}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-500 text-neutral-900 text-lg font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-amber-400/25"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Get Started with Google
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="mt-4 text-sm text-neutral-500">
                Free to use • No credit card required
              </p>
            </motion.div>
          </motion.div>
        </section>

        {/* ===== WHAT IS DIA SECTION ===== */}
        <section id="what-is-dia" className="px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4"
              >
                What is Dia?
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
              >
                Your Digital Companion for Wellness
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
              >
                Dia is an AI companion designed to provide a judgment-free space for 
                reflection, emotional support, and casual conversation.
              </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Heart,
                  title: 'Empathetic',
                  description: 'Trained to understand emotions and respond with genuine care and compassion.',
                },
                {
                  icon: MessageCircle,
                  title: 'Conversational',
                  description: 'Natural, relatable conversations that feel like chatting with a friend.',
                },
                {
                  icon: Sparkles,
                  title: 'Gen Z Friendly',
                  description: 'Speaks your language with a casual, authentic vibe.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-400 dark:hover:border-amber-600 transition-colors group shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <div className="section-divider max-w-4xl mx-auto" />

        {/* ===== HOW IT WORKS SECTION ===== */}
        <section id="how-it-works" className="px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4"
              >
                How it Works
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
              >
                Simple, Private, Powerful
              </motion.h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: 'Sign In',
                  description: 'Quick sign-in with your Google account. No lengthy forms.',
                },
                {
                  step: '02',
                  title: 'Start Chatting',
                  description: 'Begin a conversation about anything on your mind.',
                },
                {
                  step: '03',
                  title: 'Feel Better',
                  description: 'Get support, reflect on your thoughts, and feel heard.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative"
                >
                  <div className="text-6xl font-bold text-amber-200 dark:text-amber-900/50 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <div className="section-divider max-w-4xl mx-auto" />

        {/* ===== FEATURES SECTION ===== */}
        <section id="features" className="px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-16">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-sm font-medium mb-4"
              >
                Features
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white"
              >
                Built for Your Privacy
              </motion.h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Lock,
                  title: 'On-Device AI',
                  description: 'Conversations processed locally on your device.',
                },
                {
                  icon: Zap,
                  title: 'Lightning Fast',
                  description: 'No server delays. Instant responses.',
                },
                {
                  icon: Cpu,
                  title: 'WebGPU Powered',
                  description: 'Cutting-edge browser technology.',
                },
                {
                  icon: Shield,
                  title: 'No Data Stored',
                  description: 'Your conversations stay with you.',
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm"
                >
                  <feature.icon className="w-8 h-8 text-amber-500 mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ===== CTA SECTION ===== */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="p-8 sm:p-12 rounded-3xl bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                Ready to chat with Dia?
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                Join thousands of people who found a safe space for conversation.
              </p>
              <button
                onClick={signInWithGoogle}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-amber-400 hover:bg-amber-500 text-neutral-900 font-semibold transition-all hover:scale-105"
              >
                Start Chatting Now
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </section>

        {/* Disclaimer */}
        <section className="px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-sm text-neutral-500 dark:text-neutral-500 max-w-2xl mx-auto">
            Dia is an AI companion and not a replacement for professional mental health services. 
            If you&apos;re in crisis, please reach out to a mental health professional.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
