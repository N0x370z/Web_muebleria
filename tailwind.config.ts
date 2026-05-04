import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // MaderArte brand palette — NO MODIFICAR sin aprobación del cliente
        'madera-oscura': '#2C1A0E',
        'crema-marfil': '#F5EFE0',
        'dorado-suave': '#B8935A',
        'gris-piedra': '#8A8070',
        'blanco-hueso': '#FDFAF5',
      },
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        courier: ['var(--font-courier)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.35s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'gradient-wood': 'linear-gradient(135deg, #2C1A0E 0%, #4a2e18 100%)',
        'gradient-gold': 'linear-gradient(135deg, #B8935A 0%, #d4a96a 100%)',
      },
      boxShadow: {
        'card': '0 2px 16px 0 rgba(44,26,14,0.08)',
        'card-hover': '0 8px 32px 0 rgba(44,26,14,0.16)',
        'gold': '0 4px 24px 0 rgba(184,147,90,0.25)',
      },
      borderRadius: {
        'sm': '4px',
        DEFAULT: '8px',
        'lg': '12px',
        'xl': '16px',
      },
    },
  },
  plugins: [],
}

export default config
