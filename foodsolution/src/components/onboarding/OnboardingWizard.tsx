'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button, ProgressBar } from '@/components/ui';
import { EstablishmentStep } from './steps/EstablishmentStep';
import { CuisineStep } from './steps/CuisineStep';
import { CoversStep } from './steps/CoversStep';
import { TicketStep } from './steps/TicketStep';
import { ExperienceStep } from './steps/ExperienceStep';
import { GoalStep } from './steps/GoalStep';
import { CompletionStep } from './steps/CompletionStep';
import { ChevronLeft } from 'lucide-react';

const TOTAL_STEPS = 7; // 6 questions + completion

export function OnboardingWizard() {
  const { onboardingStep, setOnboardingStep, onboardingData, completeOnboarding } = useStore();
  
  const canProceed = (): boolean => {
    switch (onboardingStep) {
      case 0: return !!onboardingData.establishmentType;
      case 1: return !!onboardingData.cuisineType;
      case 2: return !!onboardingData.dailyCovers;
      case 3: return onboardingData.averageTicket !== null;
      case 4: return !!onboardingData.experienceLevel;
      case 5: return !!onboardingData.primaryGoal;
      default: return true;
    }
  };
  
  const handleNext = () => {
    if (onboardingStep < TOTAL_STEPS - 1) {
      setOnboardingStep(onboardingStep + 1);
    }
  };
  
  const handleBack = () => {
    if (onboardingStep > 0) {
      setOnboardingStep(onboardingStep - 1);
    }
  };
  
  const handleComplete = () => {
    completeOnboarding();
  };

  const renderStep = () => {
    switch (onboardingStep) {
      case 0: return <EstablishmentStep />;
      case 1: return <CuisineStep />;
      case 2: return <CoversStep />;
      case 3: return <TicketStep />;
      case 4: return <ExperienceStep />;
      case 5: return <GoalStep />;
      case 6: return <CompletionStep onComplete={handleComplete} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-surface-secondary flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        {onboardingStep > 0 && onboardingStep < 6 ? (
          <button 
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        
        {onboardingStep < 6 && (
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === onboardingStep 
                    ? 'bg-brand-primary' 
                    : i < onboardingStep 
                      ? 'bg-brand-primary/50' 
                      : 'bg-slate-200'
                }`}
                animate={{ scale: i === onboardingStep ? 1.2 : 1 }}
              />
            ))}
          </div>
        )}
        
        <div className="w-10" />
      </header>

      {/* Progress Bar */}
      {onboardingStep < 6 && (
        <div className="px-6">
          <ProgressBar 
            value={onboardingStep} 
            max={6} 
            size="sm" 
          />
        </div>
      )}

      {/* Content */}
      <main className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={onboardingStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex-1 flex flex-col"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with CTA */}
      {onboardingStep < 6 && (
        <footer className="p-6 pb-8">
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full"
            size="lg"
          >
            Continuer →
          </Button>
        </footer>
      )}
    </div>
  );
}
