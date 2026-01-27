/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0c52ea',
        accent: '#b45309',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        // 語義色彩
        'primary-light': 'rgb(12, 82, 234, 0.05)',
        'accent-light': 'rgb(245, 165, 36, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'skeleton-loading': 'skeleton 1.5s infinite',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        skeleton: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
      },
      boxShadow: {
        'sm-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      spacing: {
        'safe-bottom': 'max(1rem, env(safe-area-inset-bottom))',
      },
    },
  },
  plugins: [],
};
