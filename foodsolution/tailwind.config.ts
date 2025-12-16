import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        brand: {
          primary: '#6366F1',
          secondary: '#8B5CF6',
          accent: '#06B6D4',
        },
        // Status Colors
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        info: '#3B82F6',
        // Surface Colors
        surface: {
          primary: '#FFFFFF',
          secondary: '#F8FAFC',
          tertiary: '#F1F5F9',
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
        'brand-gradient-simple': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        'glass': 'rgba(255, 255, 255, 0.7)',
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 40px rgba(99, 102, 241, 0.15)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.06)',
        'button': '0 4px 14px rgba(99, 102, 241, 0.4)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite',
        'bounce-dots': 'bounce-dots 1.4s infinite ease-in-out both',
        'scale-in': 'scale-in 0.3s ease-out',
        'slide-in': 'slide-in 0.3s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 0 8px rgba(99, 102, 241, 0.1), 0 4px 20px rgba(99, 102, 241, 0.4)' 
          },
          '50%': { 
            boxShadow: '0 0 0 16px rgba(99, 102, 241, 0.05), 0 4px 30px rgba(99, 102, 241, 0.5)' 
          },
        },
        'bounce-dots': {
          '0%, 80%, 100%': { transform: 'scale(0.6)', opacity: '0.4' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-in': {
          from: { transform: 'scale(0)' },
          to: { transform: 'scale(1)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateX(20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
