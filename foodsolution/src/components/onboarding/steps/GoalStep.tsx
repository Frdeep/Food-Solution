'use client';

import { useStore } from '@/store/useStore';
import { OptionCard } from '@/components/ui';
import type { PrimaryGoal } from '@/types';

const GOAL_OPTIONS: { value: PrimaryGoal; icon: string; title: string; description: string }[] = [
  { 
    value: 'cost-control', 
    icon: '📊', 
    title: 'Maîtriser mes coûts matières', 
    description: 'Calculer précisément le coût de chaque plat' 
  },
  { 
    value: 'profitability', 
    icon: '💰', 
    title: 'Améliorer ma rentabilité', 
    description: 'Optimiser mes prix de vente' 
  },
  { 
    value: 'management', 
    icon: '📈', 
    title: 'Piloter mon activité', 
    description: 'Avoir des projections financières fiables' 
  },
  { 
    value: 'complete', 
    icon: '🎯', 
    title: 'Tout cela', 
    description: 'Je veux un accompagnement complet' 
  },
];

export function GoalStep() {
  const { onboardingData, updateOnboardingData } = useStore();

  return (
    <div className="flex-1 px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-400 mb-2">
          Quel est votre
        </h1>
        <h2 className="text-4xl font-bold text-slate-900">
          objectif principal ?
        </h2>
      </div>

      <div className="space-y-3">
        {GOAL_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={onboardingData.primaryGoal === option.value}
            onClick={() => updateOnboardingData({ primaryGoal: option.value })}
          />
        ))}
      </div>
    </div>
  );
}
