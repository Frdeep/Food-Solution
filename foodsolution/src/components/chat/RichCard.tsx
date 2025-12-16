'use client';

import { motion } from 'framer-motion';
import { GlassCard, Badge, Gauge, Button } from '@/components/ui';
import { formatPrice, formatPercent, getProfitabilityStatus } from '@/lib/utils';
import type { Dish } from '@/types';
import { Trophy, TrendingUp, AlertTriangle } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  onViewDetails?: () => void;
  onModify?: () => void;
}

export function DishRichCard({ dish, onViewDetails, onModify }: DishCardProps) {
  const status = getProfitabilityStatus(dish.foodCostRatio);
  
  const statusConfig = {
    excellent: { icon: Trophy, color: 'text-success', bg: 'bg-success/10', label: 'Excellent' },
    good: { icon: TrendingUp, color: 'text-brand-primary', bg: 'bg-brand-primary/10', label: 'Bon' },
    warning: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', label: 'Attention' },
    danger: { icon: AlertTriangle, color: 'text-danger', bg: 'bg-danger/10', label: 'Critique' },
  };
  
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="p-4 border-2 border-brand-primary/20">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className={`p-2 rounded-xl ${config.bg}`}>
            <StatusIcon className={`w-5 h-5 ${config.color}`} />
          </div>
          <span className="font-semibold text-slate-900">TOP RENTABILITÉ</span>
        </div>

        {/* Content */}
        <div className="flex items-center gap-4">
          {/* Image placeholder */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-3xl">
            🍔
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-slate-900">{dish.name}</h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-slate-600">
              <span>Marge: <strong className="text-success">{formatPrice(dish.grossMargin)}</strong></span>
              <span>Food Cost: <strong>{formatPercent(dish.foodCostRatio)}</strong></span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - dish.foodCostRatio}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
              <Badge variant="success" size="sm">✓</Badge>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={onViewDetails}
          >
            Voir détails
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1"
            onClick={onModify}
          >
            Modifier
          </Button>
        </div>
      </GlassCard>
    </motion.div>
  );
}

interface RichCardProps {
  type: 'dish' | 'product' | 'alert';
  data: unknown;
}

export function RichCard({ type, data }: RichCardProps) {
  switch (type) {
    case 'dish':
      return <DishRichCard dish={data as Dish} />;
    default:
      return null;
  }
}
