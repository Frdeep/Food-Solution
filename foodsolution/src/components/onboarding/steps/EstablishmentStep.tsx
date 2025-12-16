'use client';

import { useStore } from '@/store/useStore';
import { OptionCard } from '@/components/ui';
import type { EstablishmentType } from '@/types';

const ESTABLISHMENT_OPTIONS: { value: EstablishmentType; icon: string; title: string; description: string }[] = [
  { value: 'fast-food', icon: '🍔', title: 'Fast-food / Restauration rapide', description: 'Service rapide, plats à emporter' },
  { value: 'traditional', icon: '🍽️', title: 'Restaurant traditionnel', description: 'Service à table, cuisine classique' },
  { value: 'dark-kitchen', icon: '🥡', title: 'Dark Kitchen / Livraison', description: 'Uniquement en livraison' },
  { value: 'cafe-snack', icon: '☕', title: 'Café / Snack / Boulangerie', description: 'Petite restauration' },
  { value: 'gastronomic', icon: '⭐', title: 'Gastronomique / Bistronomique', description: 'Cuisine raffinée' },
  { value: 'hotel-catering', icon: '🏨', title: 'Hôtel-restaurant / Traiteur', description: 'Services multiples' },
];

export function EstablishmentStep() {
  const { onboardingData, updateOnboardingData } = useStore();

  return (
    <div className="flex-1 px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-400 mb-2">
          Quel type de
        </h1>
        <h2 className="text-4xl font-bold text-slate-900">
          restaurant gérez-vous ?
        </h2>
      </div>

      <div className="space-y-3">
        {ESTABLISHMENT_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={onboardingData.establishmentType === option.value}
            onClick={() => updateOnboardingData({ establishmentType: option.value })}
          />
        ))}
      </div>
    </div>
  );
}
