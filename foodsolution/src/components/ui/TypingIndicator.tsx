'use client';

import { motion } from 'framer-motion';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 px-4 py-3">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-brand-primary"
            animate={{
              scale: [0.6, 1, 0.6],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.16,
            }}
          />
        ))}
      </div>
      <span className="text-sm text-slate-500">Foodyx écrit...</span>
    </div>
  );
}
