'use client';

import { motion } from 'framer-motion';
import { GlassCard, Badge } from '@/components/ui';
import { formatPrice, formatRelativeDate } from '@/lib/utils';
import type { Product } from '@/types';
import { ChevronRight, TrendingUp } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit?: () => void;
}

const CATEGORY_EMOJIS: Record<string, string> = {
  vegetables: '🥬',
  meat: '🥩',
  fish: '🐟',
  dairy: '🧀',
  grocery: '🛒',
  beverages: '🥤',
  condiments: '🧂',
  bread: '🍞',
  frozen: '🧊',
  other: '📦',
};

const CATEGORY_LABELS: Record<string, string> = {
  vegetables: 'Légumes',
  meat: 'Viandes',
  fish: 'Poissons',
  dairy: 'Laitiers',
  grocery: 'Épicerie',
  beverages: 'Boissons',
  condiments: 'Condiments',
  bread: 'Pain',
  frozen: 'Surgelés',
  other: 'Autre',
};

export function ProductCard({ product, onEdit }: ProductCardProps) {
  const emoji = CATEGORY_EMOJIS[product.category] || '📦';
  // Demo: random price change for visual effect
  const priceChange = Math.random() > 0.8 ? Math.floor(Math.random() * 15) + 5 : 0;
  const hasAlert = priceChange > 10;

  return (
    <GlassCard 
      className="p-3 sm:p-4 cursor-pointer active:scale-[0.98] transition-transform"
      onClick={onEdit}
    >
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Image/Emoji */}
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-xl sm:text-2xl shadow-sm flex-shrink-0">
          {product.photoUrl ? (
            <img 
              src={product.photoUrl} 
              alt={product.name}
              className="w-full h-full object-cover rounded-xl sm:rounded-2xl"
            />
          ) : (
            emoji
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{product.name}</h3>
          <p className="text-xs sm:text-sm text-slate-500 truncate">
            {CATEGORY_LABELS[product.category]} • {formatPrice(product.unitPrice)}/{product.unit}
          </p>
          
          <div className="flex items-center gap-2 mt-1">
            {hasAlert ? (
              <Badge variant="warning" size="sm">
                <TrendingUp className="w-3 h-3 mr-0.5" />
                +{priceChange}%
              </Badge>
            ) : (
              <span className="text-[10px] sm:text-xs text-slate-400">
                Màj: {formatRelativeDate(new Date(product.lastUpdated))}
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" />
      </div>
    </GlassCard>
  );
}
