'use client';

import { useStore } from '@/store/useStore';
import type { CuisineType } from '@/types';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const CUISINE_OPTIONS: { value: CuisineType; icon: string; label: string }[] = [
  { value: 'french', icon: '🇫🇷', label: 'Français' },
  { value: 'italian', icon: '🇮🇹', label: 'Italien' },
  { value: 'japanese', icon: '🇯🇵', label: 'Japonais' },
  { value: 'american', icon: '🇺🇸', label: 'Américain' },
  { value: 'oriental', icon: '🇲🇦', label: 'Oriental' },
  { value: 'indian', icon: '🇮🇳', label: 'Indien' },
  { value: 'asian', icon: '🇨🇳', label: 'Asiatique' },
  { value: 'mexican', icon: '🇲🇽', label: 'Mexicain' },
  { value: 'fusion', icon: '🌍', label: 'Fusion' },
  { value: 'other', icon: '🍴', label: 'Autre' },
];

export function CuisineStep() {
  const { onboardingData, updateOnboardingData } = useStore();

  return (
    <div className="flex-1 px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-400 mb-2">
          Quelle est votre
        </h1>
        <h2 className="text-4xl font-bold text-slate-900">
          spécialité culinaire ?
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {CUISINE_OPTIONS.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => updateOnboardingData({ cuisineType: option.value })}
            className={cn(
              'p-4 rounded-2xl border-2 text-center transition-all duration-300',
              'hover:border-brand-primary hover:-translate-y-1 hover:shadow-lg',
              onboardingData.cuisineType === option.value
                ? 'border-brand-primary bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 shadow-md'
                : 'border-slate-200 bg-white'
            )}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-3xl mb-2 block">{option.icon}</span>
            <span className="font-medium text-slate-900">{option.label}</span>
            {onboardingData.cuisineType === option.value && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-brand-primary flex items-center justify-center"
              >
                <Check className="w-3 h-3 text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
