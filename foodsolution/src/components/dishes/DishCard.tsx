'use client';

import { motion } from 'framer-motion';
import { GlassCard, Badge, ProgressBar } from '@/components/ui';
import { formatPrice, formatPercent, getProfitabilityStatus } from '@/lib/utils';
import type { Dish } from '@/types';
import { ChevronRight, TrendingUp, AlertTriangle, Check } from 'lucide-react';

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
  const emoji = CATEGORY_EMOJIS[dish.category] || '🍽️';

  const statusConfig = {
    excellent: { variant: 'success' as const, icon: Check },
    good: { variant: 'success' as const, icon: Check },
    warning: { variant: 'warning' as const, icon: AlertTriangle },
    danger: { variant: 'danger' as const, icon: AlertTriangle },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <GlassCard 
      className="p-3 sm:p-4 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onClick}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* Image/Emoji */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-2xl sm:text-3xl shadow-sm flex-shrink-0">
          {dish.photoUrl ? (
            <img 
              src={dish.photoUrl} 
              alt={dish.name}
              className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
            />
          ) : (
            emoji
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{dish.name}</h3>
            <Badge variant={config.variant} size="sm" className="flex-shrink-0">
              <StatusIcon className="w-3 h-3 mr-0.5" />
              {formatPercent(dish.foodCostRatio)}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm mb-2">
            <span className="text-slate-600">
              Prix: <strong>{formatPrice(dish.sellingPrice)}</strong>
            </span>
            <span className="text-success">
              Marge: <strong>{formatPrice(dish.grossMargin)}</strong>
            </span>
          </div>
          
          {/* Progress bar */}
          <ProgressBar
            value={100 - dish.foodCostRatio}
            variant={status === 'excellent' || status === 'good' ? 'success' : status === 'warning' ? 'warning' : 'danger'}
            size="sm"
          />
        </div>

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0 mt-1" />
      </div>
    </GlassCard>
  );
}
