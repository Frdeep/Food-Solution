'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Camera, Folder, Mic, Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 pb-8 bg-white/80 backdrop-blur-lg border-t border-slate-100">
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            'flex items-center gap-2 p-2 rounded-2xl border-2 transition-all duration-200',
            'bg-white/70 backdrop-blur-sm',
            isFocused 
              ? 'border-brand-primary shadow-glow' 
              : 'border-slate-200'
          )}
        >
          {/* Attachments */}
          <button
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 transition-colors"
          >
            <Folder className="w-5 h-5" />
          </button>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Message..."
            disabled={disabled}
            className="flex-1 bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400"
          />

          {/* Send or Mic button */}
          {message.trim() ? (
            <motion.button
              type="submit"
              disabled={disabled}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                'p-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary',
                'text-white shadow-button transition-all',
                'hover:shadow-lg hover:-translate-y-0.5',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              whileTap={{ scale: 0.95 }}
            >
              <Send className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              className={cn(
                'p-3 rounded-xl bg-gradient-to-r from-brand-primary to-brand-secondary',
                'text-white shadow-button animate-pulse-glow'
              )}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );
}
