'use client';

import { cn } from '@/lib/utils';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  variant?: 'light' | 'dark';
  hover?: boolean;
  children: React.ReactNode;
}

export function GlassCard({ 
  variant = 'light', 
  hover = true,
  className, 
  children,
  ...props 
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'rounded-3xl backdrop-blur-xl',
        variant === 'light' 
          ? 'bg-white/70 border border-white/80 shadow-glass' 
          : 'bg-slate-900/5 border border-black/5',
        hover && 'transition-all duration-300 hover:-translate-y-1 hover:shadow-xl',
        className
      )}
      whileHover={hover ? { scale: 1.01 } : undefined}
      whileTap={hover ? { scale: 0.99 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}
