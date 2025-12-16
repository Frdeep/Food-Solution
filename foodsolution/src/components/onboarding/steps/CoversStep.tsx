'use client';

import { useStore } from '@/store/useStore';
import { OptionCard } from '@/components/ui';
import type { DailyCovers } from '@/types';

const COVERS_OPTIONS: { value: DailyCovers; icon: string; title: string; description: string }[] = [
  { value: 'less-30', icon: '🏠', title: 'Moins de 30 couverts/jour', description: 'Petit établissement' },
  { value: '30-80', icon: '🏪', title: '30 à 80 couverts/jour', description: 'Établissement moyen' },
  { value: '80-150', icon: '🏢', title: '80 à 150 couverts/jour', description: 'Établissement important' },
  { value: 'more-150', icon: '🏬', title: 'Plus de 150 couverts/jour', description: 'Très grande capacité' },
];

export function CoversStep() {
  const { onboardingData, updateOnboardingData } = useStore();

  return (
    <div className="flex-1 px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-400 mb-2">
          Combien de couverts
        </h1>
        <h2 className="text-4xl font-bold text-slate-900">
          servez-vous par jour ?
        </h2>
      </div>

      <div className="space-y-3">
        {COVERS_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={onboardingData.dailyCovers === option.value}
            onClick={() => updateOnboardingData({ dailyCovers: option.value })}
          />
        ))}
      </div>
    </div>
  );
}
