'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import Preloader from '@/components/Preloader';

// Landing Page Sections
import HeroSection from '@/components/landing/HeroSection';
import QuoteSection from '@/components/landing/QuoteSection';
import ProductShowcase from '@/components/landing/ProductShowcase';
import FeaturesSection from '@/components/landing/FeaturesSection';
import FAQSection from '@/components/landing/FAQSection';
import PricingGag from '@/components/landing/PricingGag';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [introCompleted, setIntroCompleted] = useState(false);
  const [heroExpanded, setHeroExpanded] = useState(false);

  useEffect(() => {
    if (user && !loading) {
      router.push('/chat');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <div className="w-24 h-24 sm:w-32 sm:h-32 text-white">
          <Logo className="w-full h-full text-white animate-pulse" />
        </div>
      </div>
    );
  }

  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FBF9F4] dark:bg-[#121110] selection:bg-primary/30 transition-colors duration-300">
      {!introCompleted && <Preloader onComplete={() => setIntroCompleted(true)} />}
      <div className="hero-bg" aria-hidden="true" />
      <Header />
      
      <main className="flex-1 relative">
        {/* Sticky Hero — only sticky on desktop (md:) and only when not expanded */}
        <div className={`${heroExpanded ? 'relative' : 'md:sticky md:top-0'} z-0 w-full`}>
          <HeroSection startAnimation={introCompleted} onExpandedChange={setHeroExpanded} />
        </div>
        
        {/* Card that slides up over the hero */}
        <div className="relative z-10 bg-[#FBF9F4] dark:bg-[#141311] transition-colors duration-300 shadow-[0_-20px_50px_rgba(0,0,0,0.05)] border-t border-[#E5E0D8] dark:border-[#262320] rounded-t-[32px] sm:rounded-t-[48px]">
          <QuoteSection />
          <ProductShowcase />
          <FeaturesSection />
          <FAQSection />
          <PricingGag />
          <FinalCTA />
          <Footer />
        </div>
      </main>
    </div>
  );
}
