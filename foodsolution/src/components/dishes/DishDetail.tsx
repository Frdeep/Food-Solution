'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { GlassCard, Button, Badge, Gauge } from '@/components/ui';
import { formatPrice, formatPercent, getProfitabilityStatus, getStatusColor } from '@/lib/utils';
import { analyzeDishProfitability } from '@/lib/calculations';
import { ChevronLeft, Edit3, Trash2, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

interface DishDetailProps {
  dishId: string;
  onBack: () => void;
  onEdit: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  starter: 'Entrée',
  main: 'Plat principal',
  dessert: 'Dessert',
  beverage: 'Boisson',
  menu: 'Menu',
  side: 'Accompagnement',
  sauce: 'Sauce',
};

export function DishDetail({ dishId, onBack, onEdit }: DishDetailProps) {
  const { dishes, products, onboardingData, deleteDish } = useStore();
  const dish = dishes.find(d => d.id === dishId);

  if (!dish) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-slate-500">Plat non trouvé</p>
      </div>
    );
  }

  const analysis = analyzeDishProfitability(dish, onboardingData.establishmentType || 'traditional');
  const status = getProfitabilityStatus(dish.foodCostRatio);
  const statusColor = getStatusColor(status);

  const handleDelete = () => {
    if (window.confirm('Supprimer ce plat ?')) {
      deleteDish(dish.id);
      onBack();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-white to-surface-secondary">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-lg">
        <button 
          onClick={onBack}
          className="p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-slate-600" />
        </button>
        
        <div className="flex gap-2">
          <button 
            onClick={onEdit}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <Edit3 className="w-5 h-5 text-slate-600" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-danger/10 transition-colors"
          >
            <Trash2 className="w-5 h-5 text-danger" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="relative h-48 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
          <span className="text-6xl">{dish.category === 'main' ? '🍽️' : dish.category === 'starter' ? '🥗' : dish.category === 'dessert' ? '🍰' : '🍴'}</span>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <Badge variant="default" size="sm" className="mb-2 bg-white/90 text-slate-700">
              {CATEGORY_LABELS[dish.category]}
            </Badge>
            <h1 className="text-2xl font-bold text-white">{dish.name}</h1>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Profitability Card */}
          <GlassCard className="p-6">
            <h2 className="font-semibold text-slate-900 mb-4">RENTABILITÉ</h2>
            
            <div className="flex items-center justify-center mb-6">
              <Gauge value={dish.foodCostRatio} size="lg" />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500">Prix de vente</p>
                <p className="text-xl font-bold text-slate-900">{formatPrice(dish.sellingPrice)}</p>
              </div>
              <div className="text-center p-3 bg-slate-50 rounded-xl">
                <p className="text-sm text-slate-500">Coût MP</p>
                <p className="text-xl font-bold text-slate-900">{formatPrice(dish.costPrice)}</p>
              </div>
            </div>

            {/* Margin Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-500">Marge brute</span>
                <span className="font-bold text-success">{formatPrice(dish.grossMargin)}</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-success to-emerald-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (dish.grossMargin / (dish.sellingPrice / 1.1)) * 100)}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex justify-center">
              <Badge 
                variant={status === 'excellent' || status === 'good' ? 'success' : status === 'warning' ? 'warning' : 'danger'}
              >
                {status === 'excellent' && <TrendingUp className="w-4 h-4 mr-1" />}
                {status === 'good' && <TrendingUp className="w-4 h-4 mr-1" />}
                {(status === 'warning' || status === 'danger') && <AlertTriangle className="w-4 h-4 mr-1" />}
                {status === 'excellent' && 'Excellent - Objectif atteint'}
                {status === 'good' && 'Bon - Dans les objectifs'}
                {status === 'warning' && 'Attention - Food cost élevé'}
                {status === 'danger' && 'Critique - Non rentable'}
              </Badge>
            </div>
          </GlassCard>

          {/* Composition */}
          <GlassCard className="p-4">
            <h2 className="font-semibold text-slate-900 mb-4">COMPOSITION</h2>
            
            <div className="space-y-2">
              {dish.ingredients.map((ing, index) => {
                const product = products.find(p => p.id === ing.productId);
                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                    <span className="text-slate-700">{ing.productName || product?.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-slate-500">
                        {ing.quantity} {ing.unit}
                      </span>
                      <span className="font-medium text-slate-900">
                        {formatPrice(ing.cost)}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              <div className="flex items-center justify-between pt-2 font-bold">
                <span className="text-slate-900">TOTAL COÛT MP</span>
                <span className="text-slate-900">{formatPrice(dish.costPrice)}</span>
              </div>
            </div>
          </GlassCard>

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <GlassCard className="p-4 border-2 border-brand-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Recommandation Foodyx</h3>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-slate-600">
                        • {rec}
                      </li>
                    ))}
                  </ul>
                  
                  {dish.foodCostRatio > 30 && (
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="gradient">
                        Appliquer le prix suggéré
                      </Button>
                      <Button size="sm" variant="ghost">
                        Ignorer
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
