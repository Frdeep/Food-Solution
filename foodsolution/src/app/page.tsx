'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { OnboardingWizard } from '@/components/onboarding';
import { Dashboard } from '@/components/dashboard';
import { ChatInterface } from '@/components/chat';
import { ProductList } from '@/components/products';
import { DishList } from '@/components/dishes';

type View = 'home' | 'chat' | 'products' | 'dishes';

export default function Home() {
  const { onboardingComplete, setCurrentView, currentView } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-surface-secondary">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-button">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">FoodSolution</h1>
          <p className="text-slate-500 mt-2">Chargement...</p>
        </motion.div>
      </div>
    );
  }

  // Show onboarding if not complete
  if (!onboardingComplete) {
    return <OnboardingWizard />;
  }

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'chat':
        return <ChatInterface onBack={() => handleNavigate('home')} />;
      case 'products':
        return <ProductList onBack={() => handleNavigate('home')} />;
      case 'dishes':
        return <DishList onBack={() => handleNavigate('home')} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0, x: currentView === 'home' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: currentView === 'home' ? 20 : -20 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen"
      >
        {renderView()}
      </motion.div>
    </AnimatePresence>
  );
}
