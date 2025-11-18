/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "!./src/**/*.test.{js,ts,jsx,tsx}",
    "!./src/**/*.spec.{js,ts,jsx,tsx}",
    "!./src/**/*.stories.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: '#12121B',
        surfaceElevated: '#1A1A2A',
        surfaceHover: '#1F1F2F',
        primary: '#6366F1',
        primaryHover: '#4F46E5',
        secondary: '#8B5CF6',
        secondaryHover: '#7C3AED',
        accent: '#EC4899',
        accentHover: '#DB2777',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        textPrimary: '#F8FAFC',
        textSecondary: '#CBD5E1',
        textMuted: '#94A3B8',
        textDisabled: '#64748B',
        borderSubtle: 'rgba(255,255,255,0.08)',
        borderMedium: 'rgba(255,255,255,0.15)',
        borderStrong: 'rgba(255,255,255,0.25)',
        deep: '#050510',
        mid: '#1A1A2A',
        light: '#2A2A3A',
        glow: 'rgba(99, 102, 241, 0.15)',
        glowSecondary: 'rgba(139, 92, 246, 0.15)',
        glowAccent: 'rgba(236, 72, 153, 0.15)',
        // Campus-Connect premium palette
        campusPrimary: '#1e3a8a', // Deep Blue
        campusSecondary: '#059669', // Green
        campusAccent: '#7c3aed', // Purple
        campusOrange: '#f97316', // Orange accent alternative
        campusWhite: '#ffffff',
        campusGray: '#6b7280',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 100%)',
        'hero-gradient': 'linear-gradient(135deg, #0A0A0F 0%, #101020 50%, #0A0A0F 100%)',
        'cinematic-gradient': 'linear-gradient(135deg, #0A0A0F 0%, #101020 25%, #1A1A2A 50%, #101020 75%, #0A0A0F 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(18, 18, 27, 0.8) 0%, rgba(26, 26, 42, 0.6) 100%)',
        'text-gradient': 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 50%, #f97316 100%)',
        'ambient-overlay': 'radial-gradient(circle at 50% 50%, rgba(30, 58, 138, 0.1) 0%, transparent 70%)',
        'hero-bg': 'url("/image (3).png")',
        'features-bg': 'url("/image (4).png")',
        'dashboard-gradient': 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2A 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(26, 26, 42, 0.8) 0%, rgba(31, 31, 47, 0.6) 100%)',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'drift': 'drift 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'cinematic-fade': 'cinematicFade 1.5s ease-out',
        'hover-lift': 'hoverLift 0.3s ease-out',
        'card-hover': 'cardHover 0.3s ease-out',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(107, 159, 255, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(107, 159, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(107, 159, 255, 0.3), 0 0 40px rgba(127, 64, 255, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(107, 159, 255, 0.5), 0 0 60px rgba(127, 64, 255, 0.3)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
          '25%': { transform: 'translateX(5px) translateY(-5px)' },
          '50%': { transform: 'translateX(-5px) translateY(5px)' },
          '75%': { transform: 'translateX(3px) translateY(-3px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.7', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        cinematicFade: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        hoverLift: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        cardHover: {
          '0%': { transform: 'translateY(0)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)' },
          '100%': { transform: 'translateY(-2px)', boxShadow: '0 8px 30px rgba(99, 102, 241, 0.15)' },
        },
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.25)',
        'glow-secondary': '0 0 30px rgba(139, 92, 246, 0.25)',
        'glow-accent': '0 0 25px rgba(236, 72, 153, 0.25)',
        'cinematic-glow': '0 0 40px rgba(99, 102, 241, 0.15), 0 0 80px rgba(139, 92, 246, 0.1)',
        'glass-shadow': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'ambient-shadow': '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(99, 102, 241, 0.1)',
        'card-shadow': '0 4px 20px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'card-hover': '0 8px 30px rgba(99, 102, 241, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        'button-shadow': '0 2px 10px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      lineClamp: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
      },
    },
  },
  plugins: [],
}
