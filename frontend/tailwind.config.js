/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0A0A0F',
        surface: '#12121B',
        primary: '#6B9FFF',
        secondary: '#FF7F50',
        accent: '#7F40FF',
        textPrimary: '#E6E6E6',
        textMuted: '#A9A9B3',
        borderSubtle: 'rgba(255,255,255,0.05)',
        // Cinematic depth colors
        deep: '#050510',
        mid: '#1A1A2A',
        light: '#2A2A3A',
        glow: 'rgba(107, 159, 255, 0.1)',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'accent-gradient': 'linear-gradient(135deg, #6B9FFF 0%, #7F40FF 100%)',
        'hero-gradient': 'linear-gradient(135deg, #0A0A0F 0%, #101020 50%, #0A0A0F 100%)',
        // Enhanced cinematic gradients
        'cinematic-gradient': 'linear-gradient(135deg, #0A0A0F 0%, #101020 25%, #1A1A2A 50%, #101020 75%, #0A0A0F 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(18, 18, 27, 0.8) 0%, rgba(26, 26, 42, 0.6) 100%)',
        'text-gradient': 'linear-gradient(135deg, #6B9FFF 0%, #7F40FF 50%, #FF7F50 100%)',
        'ambient-overlay': 'radial-gradient(circle at 50% 50%, rgba(107, 159, 255, 0.1) 0%, transparent 70%)',
        'hero-bg': 'url("/image (3).png")',
        'features-bg': 'url("/image (4).png")',
        'about-bg': 'url("/image (5).png")',
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        // Cinematic animations
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'drift': 'drift 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'cinematic-fade': 'cinematicFade 1.5s ease-out',
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
        // New cinematic keyframes
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
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(107, 159, 255, 0.25)',
        'glow-secondary': '0 0 30px rgba(255, 127, 80, 0.25)',
        // Enhanced cinematic shadows
        'cinematic-glow': '0 0 40px rgba(107, 159, 255, 0.15), 0 0 80px rgba(127, 64, 255, 0.1)',
        'glass-shadow': '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'ambient-shadow': '0 4px 20px rgba(0, 0, 0, 0.4), 0 0 40px rgba(107, 159, 255, 0.1)',
      },
      backdropBlur: {
        'glass': '20px',
      },
    },
  },
  plugins: [],
}