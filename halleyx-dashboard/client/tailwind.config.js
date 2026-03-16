/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      colors: {
        // Figma Light & Dark Theme Colors mapped to CSS Variables
        background: 'var(--background)',
        surface: 'var(--surface)',
        surfaceHover: 'var(--surface-hover)',
        surfaceActive: 'var(--surface-active)',
        borderLight: 'var(--border-light)',
        primary: 'rgb(var(--primary-rgb) / <alpha-value>)',
        secondary: 'rgb(var(--secondary-rgb) / <alpha-value>)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        textTertiary: 'var(--text-tertiary)',
        
        // Retaining some original for compatibility if needed
        neonCyan: '#00f7ff',
        neonIndigo: '#6366f1',
        neonPurple: '#a855f7',
        neonEmerald: '#10b981',
      }
    },
  },
  plugins: [],
}

