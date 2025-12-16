'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { OnboardingWizard } from '@/components/onboarding';
import { Dashboard } from '@/components/dashboard';
import { ChatInterface } from '@/components/chat';
import { ProductList } from '@/components/products';
import { DishList } from '@/components/dishes';
import { BottomNav } from '@/components/ui';

type View = 'home' | 'chat' | 'products' | 'dishes';

export default function Home() {
  const { onboardingComplete, currentView, setCurrentView } = useStore();
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
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-button">
            <span className="text-4xl">🍽️</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">FoodSolution</h1>
          <p className="text-slate-500 mt-2">Chargement...</p>
          <div className="mt-6 flex justify-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-brand-primary"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
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
    <div className="min-h-screen pb-20 sm:pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="min-h-screen"
        >
          {renderView()}
        </motion.div>
      </AnimatePresence>
      
      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} onNavigate={handleNavigate} />
    </div>
  );
}
