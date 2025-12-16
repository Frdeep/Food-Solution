'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/useStore';
import { GlassCard, Button, Badge, ProgressBar, Avatar } from '@/components/ui';
import { calculateMenuStats } from '@/lib/calculations';
import { formatPrice, formatPercent } from '@/lib/utils';
import { 
  MessageSquare, 
  Package, 
  UtensilsCrossed, 
  TrendingUp, 
  AlertTriangle,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (view: 'chat' | 'products' | 'dishes') => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { userName, dishes, products, alerts, onboardingData } = useStore();
  
  const stats = calculateMenuStats(dishes);
  const displayName = userName || 'Chef';

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir';

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-surface-secondary">
      {/* Header */}
      <header className="p-6 pb-2">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar name={displayName} size="md" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="relative"
          >
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-xs rounded-full flex items-center justify-center">
                {alerts.length}
              </span>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-slate-400 text-lg font-light">{greeting}</p>
          <h1 className="text-4xl font-bold text-slate-900">
            {displayName} 👋
          </h1>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="p-6 space-y-4">
        {/* Main KPI Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-brand-primary" />
              </div>
              <h2 className="font-semibold text-slate-900">Votre rentabilité</h2>
            </div>

            {dishes.length > 0 ? (
              <>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1">
                    <ProgressBar 
                      value={100 - stats.averageFoodCost} 
                      variant={stats.averageFoodCost < 30 ? 'success' : stats.averageFoodCost < 35 ? 'warning' : 'danger'}
                      size="lg"
                    />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">
                    {(100 - stats.averageFoodCost).toFixed(0)}%
                  </span>
                </div>

                <p className="text-sm text-slate-500 mb-4">Food Cost Moyen</p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <p className="text-xl font-bold text-slate-900">
                      {formatPercent(stats.averageFoodCost)}
                    </p>
                    <p className="text-xs text-slate-500">Food Cost</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <p className="text-xl font-bold text-success">
                      {formatPrice(stats.totalMargin)}
                    </p>
                    <p className="text-xs text-slate-500">Marge totale</p>
                  </div>
                  <div className="text-center p-3 bg-slate-50 rounded-xl">
                    <p className="text-xl font-bold text-slate-900">
                      {dishes.length}
                    </p>
                    <p className="text-xs text-slate-500">Plats</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 mb-4">
                  Ajoutez vos premiers plats pour voir vos statistiques de rentabilité
                </p>
                <Button onClick={() => onNavigate('dishes')} size="sm">
                  <UtensilsCrossed className="w-4 h-4 mr-2" />
                  Créer un plat
                </Button>
              </div>
            )}
          </GlassCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-3"
        >
          <GlassCard 
            className="p-4 cursor-pointer"
            onClick={() => onNavigate('products')}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-3">
                  <Package className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Mes produits</h3>
                <p className="text-sm text-slate-500">{products.length} enregistrés</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </GlassCard>

          <GlassCard 
            className="p-4 cursor-pointer"
            onClick={() => onNavigate('dishes')}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-3">
                  <UtensilsCrossed className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-900">Mes plats</h3>
                <p className="text-sm text-slate-500">{dishes.length} actifs</p>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Alerts */}
        {stats.alertCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-4 border-2 border-warning/20 bg-warning/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-warning/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">
                    {stats.alertCount} plat{stats.alertCount > 1 ? 's' : ''} à optimiser
                  </p>
                  <p className="text-sm text-slate-500">
                    Food cost supérieur à 35%
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('dishes')}
                >
                  Voir
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Chat CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={() => onNavigate('chat')} 
            className="w-full"
            size="lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Discuter avec Foodyx
          </Button>
        </motion.div>

        {/* Best/Worst Dish */}
        {stats.bestDish && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 gap-3"
          >
            <GlassCard className="p-4 bg-success/5 border-success/20">
              <p className="text-xs text-success font-medium mb-1">🏆 Plus rentable</p>
              <p className="font-semibold text-slate-900 truncate">{stats.bestDish.name}</p>
              <p className="text-sm text-slate-500">
                {formatPercent(stats.bestDish.foodCostRatio)} food cost
              </p>
            </GlassCard>

            {stats.worstDish && stats.worstDish.id !== stats.bestDish.id && (
              <GlassCard className="p-4 bg-danger/5 border-danger/20">
                <p className="text-xs text-danger font-medium mb-1">⚠️ À optimiser</p>
                <p className="font-semibold text-slate-900 truncate">{stats.worstDish.name}</p>
                <p className="text-sm text-slate-500">
                  {formatPercent(stats.worstDish.foodCostRatio)} food cost
                </p>
              </GlassCard>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
