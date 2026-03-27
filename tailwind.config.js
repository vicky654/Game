/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        floatUp: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-12px) scale(1.05)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0) rotate(-10deg)', opacity: '0' },
          '60%': { transform: 'scale(1.15) rotate(3deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        celebration: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.2)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.15)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(110%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(115%)', opacity: '0' },
        },
        countUp: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(244,63,94,0.35), 0 0 50px rgba(244,63,94,0.15)' },
          '50%': { boxShadow: '0 0 35px rgba(244,63,94,0.6), 0 0 80px rgba(244,63,94,0.25)' },
        },
      },
      animation: {
        floatUp: 'floatUp 3s ease-in-out infinite',
        bounceIn: 'bounceIn 0.6s ease-out forwards',
        fadeIn: 'fadeIn 0.8s ease-out forwards',
        wiggle: 'wiggle 0.4s ease-in-out infinite',
        celebration: 'celebration 0.5s ease-out forwards',
        heartbeat: 'heartbeat 1.2s ease-in-out infinite',
        slideDown: 'slideDown 0.4s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
        slideInRight: 'slideInRight 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        slideOutRight: 'slideOutRight 0.28s cubic-bezier(0.4, 0, 1, 1) forwards',
        countUp: 'countUp 0.4s ease-out forwards',
        glowPulse: 'glowPulse 2.2s ease-in-out infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
}
