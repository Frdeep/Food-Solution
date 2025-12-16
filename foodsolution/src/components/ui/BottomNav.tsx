'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Home, MessageSquare, Package, UtensilsCrossed } from 'lucide-react';

type View = 'home' | 'chat' | 'products' | 'dishes';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const NAV_ITEMS: { id: View; icon: React.ElementType; label: string }[] = [
  { id: 'home', icon: Home, label: 'Accueil' },
  { id: 'products', icon: Package, label: 'Produits' },
  { id: 'dishes', icon: UtensilsCrossed, label: 'Plats' },
  { id: 'chat', icon: MessageSquare, label: 'Foodyx' },
];

export function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-slate-100 safe-area-inset-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around px-2 py-1">
        {NAV_ITEMS.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'relative flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all touch-manipulation',
                'min-w-[64px] min-h-[56px]',
                isActive 
                  ? 'text-brand-primary' 
                  : 'text-slate-400 hover:text-slate-600 active:text-slate-700'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="absolute inset-0 bg-brand-primary/10 rounded-xl"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className={cn(
                'w-5 h-5 sm:w-6 sm:h-6 relative z-10 transition-transform',
                isActive && 'scale-110'
              )} />
              <span className={cn(
                'text-[10px] sm:text-xs mt-0.5 relative z-10 font-medium',
                isActive && 'font-semibold'
              )}>
                {item.label}
              </span>
              
              {/* Chat badge */}
              {item.id === 'chat' && (
                <span className="absolute top-1 right-2 w-2 h-2 bg-success rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
