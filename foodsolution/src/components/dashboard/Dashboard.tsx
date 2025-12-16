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
  Sparkles,
  BarChart3,
  Target
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-white via-white to-surface-secondary"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <header className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4">
        <motion.div 
          className="flex items-center justify-between mb-6"
          variants={itemVariants}
        >
          <Avatar name={displayName} size="md" />
          <div className="flex items-center gap-2">
            {alerts.length > 0 && (
              <Badge variant="warning" size="sm">
                <AlertTriangle className="w-3 h-3 mr-1" />
                {alerts.length}
              </Badge>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className="text-slate-400 text-base sm:text-lg font-light">{greeting}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 flex items-center gap-2">
            {displayName} <span className="text-2xl sm:text-3xl">👋</span>
          </h1>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 pb-6 space-y-4">
        {/* Main KPI Card */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 flex items-center justify-center">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-brand-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 text-sm sm:text-base">Votre rentabilité</h2>
                <p className="text-xs text-slate-500">Aujourd&apos;hui</p>
              </div>
            </div>

            {dishes.length > 0 ? (
              <>
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                  <div className="flex-1">
                    <ProgressBar 
                      value={100 - stats.averageFoodCost} 
                      variant={stats.averageFoodCost < 30 ? 'success' : stats.averageFoodCost < 35 ? 'warning' : 'danger'}
                      size="lg"
                    />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-bold text-slate-900">
                      {(100 - stats.averageFoodCost).toFixed(0)}%
                    </span>
                    <p className="text-xs text-slate-500">rentabilité</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-xl">
                    <p className="text-lg sm:text-xl font-bold text-slate-900">
                      {formatPercent(stats.averageFoodCost)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Food Cost</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-success/5 rounded-xl">
                    <p className="text-lg sm:text-xl font-bold text-success">
                      {formatPrice(stats.totalMargin)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Marge</p>
                  </div>
                  <div className="text-center p-2 sm:p-3 bg-slate-50 rounded-xl">
                    <p className="text-lg sm:text-xl font-bold text-slate-900">
                      {dishes.length}
                    </p>
                    <p className="text-[10px] sm:text-xs text-slate-500">Plats</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-6 sm:py-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 text-sm sm:text-base mb-4">
                  Ajoutez vos premiers plats pour voir vos statistiques
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
          className="grid grid-cols-2 gap-3"
          variants={itemVariants}
        >
          <GlassCard 
            className="p-3 sm:p-4 cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => onNavigate('products')}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-2 sm:mb-3">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Mes produits</h3>
                <p className="text-xs sm:text-sm text-slate-500">{products.length} enregistrés</p>
              </div>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mt-1" />
            </div>
          </GlassCard>

          <GlassCard 
            className="p-3 sm:p-4 cursor-pointer active:scale-[0.98] transition-transform"
            onClick={() => onNavigate('dishes')}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-2 sm:mb-3">
                  <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">Mes plats</h3>
                <p className="text-xs sm:text-sm text-slate-500">{dishes.length} actifs</p>
              </div>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 mt-1" />
            </div>
          </GlassCard>
        </motion.div>

        {/* Alerts */}
        {stats.alertCount > 0 && (
          <motion.div variants={itemVariants}>
            <GlassCard className="p-3 sm:p-4 border-2 border-warning/20 bg-warning/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-warning/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm sm:text-base">
                    {stats.alertCount} plat{stats.alertCount > 1 ? 's' : ''} à optimiser
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500 truncate">
                    Food cost supérieur à 35%
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onNavigate('dishes')}
                  className="flex-shrink-0"
                >
                  Voir
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Chat CTA */}
        <motion.div variants={itemVariants}>
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
            className="grid grid-cols-2 gap-3"
            variants={itemVariants}
          >
            <GlassCard className="p-3 sm:p-4 bg-success/5 border-success/20">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-sm">🏆</span>
                <p className="text-xs font-medium text-success">Plus rentable</p>
              </div>
              <p className="font-semibold text-slate-900 text-sm truncate">{stats.bestDish.name}</p>
              <p className="text-xs text-slate-500">
                {formatPercent(stats.bestDish.foodCostRatio)} food cost
              </p>
            </GlassCard>

            {stats.worstDish && stats.worstDish.id !== stats.bestDish.id && (
              <GlassCard className="p-3 sm:p-4 bg-danger/5 border-danger/20">
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-sm">⚠️</span>
                  <p className="text-xs font-medium text-danger">À optimiser</p>
                </div>
                <p className="font-semibold text-slate-900 text-sm truncate">{stats.worstDish.name}</p>
                <p className="text-xs text-slate-500">
                  {formatPercent(stats.worstDish.foodCostRatio)} food cost
                </p>
              </GlassCard>
            )}
          </motion.div>
        )}

        {/* Quick Tips */}
        <motion.div variants={itemVariants}>
          <GlassCard className="p-3 sm:p-4 border-2 border-brand-primary/10">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 text-sm mb-1">Conseil du jour</h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  Un food cost entre 28% et 32% est idéal pour un restaurant traditionnel. 
                  Ajoutez vos plats pour voir où vous en êtes !
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </main>
    </motion.div>
  );
}
