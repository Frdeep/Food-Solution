'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button, ProgressBar, Input } from '@/components/ui';
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
  const { onboardingStep, setOnboardingStep, onboardingData, completeOnboarding, setUserName, userName } = useStore();
  const [localName, setLocalName] = useState(userName || '');
  
  const canProceed = (): boolean => {
    switch (onboardingStep) {
      case 0: return localName.trim().length >= 2;
      case 1: return !!onboardingData.establishmentType;
      case 2: return !!onboardingData.cuisineType;
      case 3: return !!onboardingData.dailyCovers;
      case 4: return onboardingData.averageTicket !== null;
      case 5: return !!onboardingData.experienceLevel;
      case 6: return !!onboardingData.primaryGoal;
      default: return true;
    }
  };
  
  const handleNext = () => {
    if (onboardingStep === 0) {
      setUserName(localName.trim());
    }
    if (onboardingStep < TOTAL_STEPS) {
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
      case 0: return <NameStep name={localName} setName={setLocalName} />;
      case 1: return <EstablishmentStep />;
      case 2: return <CuisineStep />;
      case 3: return <CoversStep />;
      case 4: return <TicketStep />;
      case 5: return <ExperienceStep />;
      case 6: return <GoalStep />;
      case 7: return <CompletionStep onComplete={handleComplete} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-white to-surface-secondary flex flex-col">
      {/* Header */}
      <header className="p-4 flex items-center justify-between safe-area-inset-top">
        {onboardingStep > 0 && onboardingStep < 7 ? (
          <button 
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-slate-100 active:bg-slate-200 transition-colors touch-manipulation"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
        ) : (
          <div className="w-10" />
        )}
        
        {onboardingStep < 7 && (
          <div className="flex gap-1.5 sm:gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-colors ${
                  i === onboardingStep 
                    ? 'bg-brand-primary' 
                    : i < onboardingStep 
                      ? 'bg-brand-primary/50' 
                      : 'bg-slate-200'
                }`}
                animate={{ scale: i === onboardingStep ? 1.3 : 1 }}
              />
            ))}
          </div>
        )}
        
        <div className="w-10" />
      </header>

      {/* Progress Bar */}
      {onboardingStep < 7 && (
        <div className="px-4 sm:px-6">
          <ProgressBar 
            value={onboardingStep} 
            max={7} 
            size="sm" 
          />
        </div>
      )}

      {/* Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={onboardingStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="flex-1 flex flex-col overflow-y-auto"
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer with CTA */}
      {onboardingStep < 7 && (
        <footer className="p-4 sm:p-6 pb-6 sm:pb-8 safe-area-inset-bottom">
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

// Name Step Component
function NameStep({ name, setName }: { name: string; setName: (name: string) => void }) {
  return (
    <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 flex flex-col">
      <div className="mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center mb-6 mx-auto shadow-button">
          <span className="text-3xl sm:text-4xl">🍽️</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-2">
          Bienvenue sur FoodSolution
        </h1>
        <p className="text-slate-500 text-center text-sm sm:text-base">
          Votre assistant rentabilité pour la restauration
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <label className="block text-sm font-medium text-slate-700 mb-2 text-center">
          Comment vous appelez-vous ?
        </label>
        <Input
          placeholder="Votre prénom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-center text-lg"
          autoFocus
        />
        <p className="text-xs text-slate-400 mt-2 text-center">
          Foodyx utilisera ce nom pour personnaliser votre expérience
        </p>
      </div>
    </div>
  );
}
