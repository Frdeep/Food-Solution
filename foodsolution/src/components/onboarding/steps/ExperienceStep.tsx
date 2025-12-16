'use client';

import { useStore } from '@/store/useStore';
import { OptionCard } from '@/components/ui';
import type { ExperienceLevel } from '@/types';

const EXPERIENCE_OPTIONS: { value: ExperienceLevel; icon: string; title: string; description: string }[] = [
  { value: 'beginner', icon: '🌱', title: 'Je débute', description: 'Moins de 2 ans dans la restauration' },
  { value: 'experienced', icon: '🌿', title: "J'ai de l'expérience", description: '2 à 5 ans d\'expérience' },
  { value: 'confirmed', icon: '🌳', title: 'Je suis confirmé', description: '5 à 10 ans d\'expérience' },
  { value: 'expert', icon: '🏆', title: 'Je suis expert', description: 'Plus de 10 ans d\'expérience' },
];

export function ExperienceStep() {
  const { onboardingData, updateOnboardingData } = useStore();

  return (
    <div className="flex-1 px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-slate-400 mb-2">
          Depuis combien de temps
        </h1>
        <h2 className="text-4xl font-bold text-slate-900">
          êtes-vous restaurateur ?
        </h2>
      </div>

      <div className="space-y-3">
        {EXPERIENCE_OPTIONS.map((option) => (
          <OptionCard
            key={option.value}
            icon={option.icon}
            title={option.title}
            description={option.description}
            selected={onboardingData.experienceLevel === option.value}
            onClick={() => updateOnboardingData({ experienceLevel: option.value })}
          />
        ))}
      </div>
    </div>
  );
}
