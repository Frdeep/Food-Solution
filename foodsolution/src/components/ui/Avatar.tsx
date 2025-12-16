'use client';

import { cn } from '@/lib/utils';

interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'user' | 'foodyx';
  className?: string;
}

export function Avatar({ 
  name, 
  src, 
  size = 'md',
  variant = 'user',
  className 
}: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-lg',
    lg: 'w-16 h-16 text-2xl',
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (variant === 'foodyx') {
    return (
      <div 
        className={cn(
          'rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary',
          'flex items-center justify-center shadow-button',
          sizes[size],
          className
        )}
      >
        <span className="text-white">🤖</span>
      </div>
    );
  }

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn(
          'rounded-full object-cover',
          sizes[size],
          className
        )}
      />
    );
  }

  return (
    <div 
      className={cn(
        'rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20',
        'flex items-center justify-center text-brand-primary font-semibold',
        sizes[size],
        className
      )}
    >
      {name ? getInitials(name) : '?'}
    </div>
  );
}
