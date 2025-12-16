'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { Button, GlassCard, Avatar } from '@/components/ui';
import { Check, Sparkles } from 'lucide-react';

interface CompletionStepProps {
  onComplete: () => void;
}

const ESTABLISHMENT_LABELS: Record<string, string> = {
  'fast-food': 'Fast-food / Restauration rapide',
  'traditional': 'Restaurant traditionnel',
  'dark-kitchen': 'Dark Kitchen',
  'cafe-snack': 'Café / Snack',
  'gastronomic': 'Gastronomique',
  'hotel-catering': 'Hôtel-restaurant / Traiteur',
};

const CUISINE_LABELS: Record<string, string> = {
  'french': 'Français',
  'italian': 'Italien',
  'japanese': 'Japonais',
  'american': 'Américain',
  'oriental': 'Oriental',
  'indian': 'Indien',
  'asian': 'Asiatique',
  'mexican': 'Mexicain',
  'fusion': 'Fusion',
  'other': 'Autre',
};

const COVERS_LABELS: Record<string, string> = {
  'less-30': 'moins de 30 couverts/jour',
  '30-80': '30-80 couverts/jour',
  '80-150': '80-150 couverts/jour',
  'more-150': 'plus de 150 couverts/jour',
};

export function CompletionStep({ onComplete }: CompletionStepProps) {
  const { onboardingData, userName } = useStore();

  const getProfileSummary = () => {
    const establishment = ESTABLISHMENT_LABELS[onboardingData.establishmentType || ''] || '';
    const cuisine = CUISINE_LABELS[onboardingData.cuisineType || ''] || '';
    const covers = COVERS_LABELS[onboardingData.dailyCovers || ''] || '';
    const ticket = onboardingData.averageTicket ? `${onboardingData.averageTicket}€` : '';

    return `${establishment} ${cuisine}, ${covers}, ticket moyen ${ticket}`;
  };

  return (
    <div className="flex-1 px-6 py-8 flex flex-col items-center justify-center text-center">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-success to-emerald-400 flex items-center justify-center mb-6 shadow-lg"
      >
        <motion.div
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Check className="w-10 h-10 text-white" strokeWidth={3} />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-3xl font-bold text-slate-900 mb-2"
      >
        Parfait ! 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-slate-500 mb-8"
      >
        Votre profil est configuré
      </motion.p>

      {/* Profile Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="w-full"
      >
        <GlassCard className="p-6 mb-6">
          <h3 className="font-semibold text-slate-900 mb-3">Votre profil</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            {getProfileSummary()}
          </p>
        </GlassCard>
      </motion.div>

      {/* Foodyx Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="w-full"
      >
        <GlassCard className="p-6 mb-8 border-brand-primary/20 border-2">
          <div className="flex items-start gap-4">
            <Avatar variant="foodyx" size="md" />
            <div className="flex-1 text-left">
              <p className="font-semibold text-slate-900 mb-1">Foodyx</p>
              <p className="text-slate-600 text-sm">
                Ravi de vous rencontrer ! 👋 Je suis prêt à vous accompagner. 
                Commençons par ajouter vos 5 plats principaux pour calculer leur rentabilité.
              </p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="w-full"
      >
        <Button onClick={onComplete} size="lg" className="w-full">
          <Sparkles className="w-5 h-5 mr-2" />
          Commencer avec Foodyx
        </Button>
      </motion.div>
    </div>
  );
}
