'use client';

import { motion } from 'framer-motion';
import { GlassCard, Badge } from '@/components/ui';
import { formatPrice, formatRelativeDate } from '@/lib/utils';
import type { Product } from '@/types';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

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
  dairy: 'Produits laitiers',
  grocery: 'Épicerie',
  beverages: 'Boissons',
  condiments: 'Condiments',
  bread: 'Boulangerie',
  frozen: 'Surgelés',
  other: 'Autre',
};

export function ProductCard({ product, onEdit }: ProductCardProps) {
  const emoji = CATEGORY_EMOJIS[product.category] || '📦';
  const priceChange = Math.random() > 0.7 ? (Math.random() * 20 - 5) : 0; // Demo random price change
  const hasAlert = priceChange > 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      layout
    >
      <GlassCard 
        className="p-4 cursor-pointer"
        onClick={onEdit}
      >
        <div className="flex items-center gap-4">
          {/* Image/Emoji */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center text-2xl shadow-sm">
            {product.photoUrl ? (
              <img 
                src={product.photoUrl} 
                alt={product.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              emoji
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 truncate">{product.name}</h3>
            <p className="text-sm text-slate-500">
              {CATEGORY_LABELS[product.category]} • {formatPrice(product.unitPrice)}/{product.unit}
            </p>
            
            <div className="flex items-center gap-2 mt-1">
              {hasAlert ? (
                <Badge variant="warning" size="sm">
                  <TrendingUp className="w-3 h-3" />
                  Prix +{priceChange.toFixed(0)}%
                </Badge>
              ) : (
                <span className="text-xs text-slate-400">
                  Màj: {formatRelativeDate(new Date(product.lastUpdated))}
                </span>
              )}
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="w-5 h-5 text-slate-400" />
        </div>
      </GlassCard>
    </motion.div>
  );
}
