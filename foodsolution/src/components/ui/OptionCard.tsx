'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface OptionCardProps {
  icon: string;
  title: string;
  description?: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function OptionCard({ 
  icon, 
  title, 
  description,
  selected = false,
  onClick,
  className 
}: OptionCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'w-full p-5 rounded-2xl border-2 text-left transition-all duration-300',
        'hover:border-brand-primary hover:-translate-y-1 hover:shadow-lg',
        selected 
          ? 'border-brand-primary bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 shadow-md ring-4 ring-brand-primary/10' 
          : 'border-slate-200 bg-white',
        className
      )}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-slate-900">{title}</h3>
            {description && (
              <p className="text-sm text-slate-500 mt-1">{description}</p>
            )}
          </div>
        </div>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center"
          >
            <Check className="w-4 h-4 text-white" />
          </motion.div>
        )}
      </div>
    </motion.button>
  );
}
