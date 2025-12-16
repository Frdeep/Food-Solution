'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Input } from '@/components/ui';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const TICKET_SUGGESTIONS = [
  { label: 'Moins de 10€', value: 8, description: 'Fast-food' },
  { label: '10€ - 20€', value: 15, description: 'Restauration rapide' },
  { label: '20€ - 35€', value: 27, description: 'Traditionnel' },
  { label: '35€ - 60€', value: 45, description: 'Bistronomique' },
  { label: 'Plus de 60€', value: 75, description: 'Gastronomique' },
];

export function TicketStep() {
  const { onboardingData, updateOnboardingData } = useStore();
  const [customValue, setCustomValue] = useState(
    onboardingData.averageTicket?.toString() || ''
  );

  const handleSuggestionClick = (value: number) => {
    setCustomValue(value.toString());
    updateOnboardingData({ averageTicket: value });
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      updateOnboardingData({ averageTicket: numValue });
    }
  };

  return (
    <div className="flex-1 px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-400 mb-2">
          Quel est votre
        </h1>
        <h2 className="text-4xl font-bold text-slate-900">
          ticket moyen actuel ?
        </h2>
      </div>

      {/* Custom Input */}
      <div className="mb-6">
        <div className="relative">
          <Input
            type="number"
            placeholder="Entrez votre ticket moyen"
            value={customValue}
            onChange={handleCustomChange}
            className="text-2xl font-bold text-center pr-12"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
            €
          </span>
        </div>
      </div>

      {/* Suggestions */}
      <p className="text-sm text-slate-500 mb-4">Ou sélectionnez une fourchette :</p>
      
      <div className="grid grid-cols-2 gap-3">
        {TICKET_SUGGESTIONS.map((suggestion) => (
          <motion.button
            key={suggestion.value}
            onClick={() => handleSuggestionClick(suggestion.value)}
            className={cn(
              'p-4 rounded-2xl border-2 text-left transition-all duration-300',
              'hover:border-brand-primary hover:-translate-y-0.5 hover:shadow-md',
              onboardingData.averageTicket === suggestion.value
                ? 'border-brand-primary bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5'
                : 'border-slate-200 bg-white'
            )}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-bold text-slate-900 block">{suggestion.label}</span>
            <span className="text-sm text-slate-500">{suggestion.description}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
