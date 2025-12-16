'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { getProfitabilityStatus, getStatusColor } from '@/lib/utils';

interface GaugeProps {
  value: number; // Food cost percentage
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function Gauge({ 
  value, 
  size = 'md',
  showLabel = true,
  className 
}: GaugeProps) {
  const status = getProfitabilityStatus(value);
  const color = getStatusColor(status);
  
  const sizes = {
    sm: { width: 80, strokeWidth: 6, fontSize: 16 },
    md: { width: 120, strokeWidth: 8, fontSize: 24 },
    lg: { width: 160, strokeWidth: 10, fontSize: 32 },
  };
  
  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Semi-circle
  const progress = Math.min(Math.max(value, 0), 100);
  const offset = circumference - (progress / 100) * circumference;

  const statusLabels = {
    excellent: 'Excellent',
    good: 'Bon',
    warning: 'Attention',
    danger: 'Critique',
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        width={width}
        height={width / 2 + strokeWidth}
        viewBox={`0 0 ${width} ${width / 2 + strokeWidth}`}
      >
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${width / 2} A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${width / 2}`}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        
        {/* Progress arc */}
        <motion.path
          d={`M ${strokeWidth / 2} ${width / 2} A ${radius} ${radius} 0 0 1 ${width - strokeWidth / 2} ${width / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      
      {showLabel && (
        <div className="text-center -mt-2">
          <motion.p 
            className="font-bold text-slate-900"
            style={{ fontSize }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {value.toFixed(1)}%
          </motion.p>
          <p 
            className="text-sm font-medium"
            style={{ color }}
          >
            {statusLabels[status]}
          </p>
        </div>
      )}
    </div>
  );
}
