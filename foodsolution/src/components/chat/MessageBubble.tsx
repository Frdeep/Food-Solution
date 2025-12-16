'use client';

import { motion } from 'framer-motion';
import { Avatar, GlassCard } from '@/components/ui';
import type { Message } from '@/types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-end gap-3',
        !isAssistant && 'flex-row-reverse'
      )}
    >
      {isAssistant && <Avatar variant="foodyx" size="sm" />}
      
      <div
        className={cn(
          'max-w-[85%] rounded-2xl px-4 py-3',
          isAssistant
            ? 'bg-white border border-brand-primary/20 rounded-bl-sm shadow-sm'
            : 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white rounded-br-sm'
        )}
      >
        <div 
          className={cn(
            'text-sm leading-relaxed prose prose-sm max-w-none',
            isAssistant ? 'text-slate-700' : 'text-white prose-invert',
            '[&_strong]:font-semibold',
            '[&_ul]:list-disc [&_ul]:pl-4 [&_ul]:my-2',
            '[&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:my-2',
            '[&_li]:my-1',
            '[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0'
          )}
        >
          {message.content.split('\n').map((line, i) => {
            // Simple markdown-like parsing
            if (line.startsWith('**') && line.endsWith('**')) {
              return <p key={i} className="font-bold">{line.slice(2, -2)}</p>;
            }
            if (line.startsWith('• ')) {
              return <p key={i}>• {parseInlineStyles(line.slice(2))}</p>;
            }
            if (line.match(/^\d+\. /)) {
              return <p key={i}>{parseInlineStyles(line)}</p>;
            }
            if (line.trim() === '') {
              return <br key={i} />;
            }
            return <p key={i}>{parseInlineStyles(line)}</p>;
          })}
        </div>
      </div>
    </motion.div>
  );
}

function parseInlineStyles(text: string): React.ReactNode {
  // Parse **bold** text
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}
