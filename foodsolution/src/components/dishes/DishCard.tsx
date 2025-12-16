'use client';

import { motion } from 'framer-motion';
import { GlassCard, Badge, ProgressBar } from '@/components/ui';
import { formatPrice, formatPercent, getProfitabilityStatus, getStatusColor } from '@/lib/utils';
import type { Dish } from '@/types';
import { ChevronRight, TrendingUp, AlertTriangle } from 'lucide-react';

interface DishCardProps {
  dish: Dish;
  onClick?: () => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  starter: '🥗',
  main: '🍽️',
  dessert: '🍰',
  beverage: '🥤',
  menu: '📋',
  side: '🍟',
  sauce: '🫙',
};

export function DishCard({ dish, onClick }: DishCardProps) {
  const status = getProfitabilityStatus(dish.foodCostRatio);
  const statusColor = getStatusColor(status);
  const emoji = CATEGORY_EMOJIS[dish.category] || '🍽️';

  const statusConfig = {
    excellent: { variant: 'success' as const, label: 'Excellent', icon: TrendingUp },
    good: { variant: 'info' as const, label: 'Bon', icon: TrendingUp },
    warning: { variant: 'warning' as const, label: 'Attention', icon: AlertTriangle },
    danger: { variant: 'danger' as const, label: 'Critique', icon: AlertTriangle },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      <GlassCard 
        className="p-4 cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-start gap-4">
          {/* Image/Emoji */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-3xl shadow-sm flex-shrink-0">
            {dish.photoUrl ? (
              <img 
                src={dish.photoUrl} 
                alt={dish.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              emoji
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-slate-900 truncate">{dish.name}</h3>
              <Badge variant={config.variant} size="sm">
                {formatPercent(dish.foodCostRatio)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 mt-1 text-sm">
              <span className="text-slate-600">
                Prix: <strong>{formatPrice(dish.sellingPrice)}</strong>
              </span>
              <span className="text-success">
                Marge: <strong>{formatPrice(dish.grossMargin)}</strong>
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3">
              <ProgressBar
                value={100 - dish.foodCostRatio}
                variant={status === 'excellent' || status === 'good' ? 'success' : status === 'warning' ? 'warning' : 'danger'}
                size="sm"
              />
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="w-5 h-5 text-slate-400 flex-shrink-0 mt-2" />
        </div>
      </GlassCard>
    </motion.div>
  );
}
