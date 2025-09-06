/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem', // 16px for mobile
        sm: '1.25rem', // 20px for tablet
        lg: '1.5rem', // 24px for desktop
      },
    },
    screens: {
      sm: '768px',
      md: '1024px',
      lg: '1440px',
    },
    extend: {
      colors: {
        'primary': {
          'deep-blue': '#0D1B2A',
          'electric-cyan': '#00BFFF',
        },
        'secondary': {
          'sunset-orange': '#FF7A18',
          'golden-yellow': '#FFC837',
        },
        'neutral': {
          'metallic-silver': '#E5E5E5',
          'charcoal-black': '#111111',
        },
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
      borderColor: {
        'glass': 'rgba(255, 255, 255, 0.2)',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #0D1B2A 0%, #00BFFF 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #FF7A18 0%, #FFC837 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        accent: ['Poppins', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.2', letterSpacing: '0.05em' }], // H1
        'h2': ['2.5rem', { lineHeight: '1.2' }],
        'h3': ['2rem', { lineHeight: '1.2' }],
        'h4': ['1.5rem', { lineHeight: '1.2' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1', letterSpacing: '0.1em' }],
      },
      letterSpacing: {
        'h1': '0.05em',
        'caption': '0.1em',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      transitionDuration: {
        '200': '200ms',
        '400': '400ms',
        '600': '600ms',
      },
      transitionTimingFunction: {
        'natural': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
