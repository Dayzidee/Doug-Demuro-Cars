/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'charcoal': '#111111',
        'accent-silver': '#E5E5E5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
        special: ['Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #0D1B2A 0%, #00BFFF 100%)',
        'secondary-gradient': 'linear-gradient(135deg, #FF7A18 0%, #FFC837 100%)',
      },
      backgroundColor: {
        'glass-bg': 'rgba(255, 255, 255, 0.1)',
      },
      borderColor: {
        'glass-border': 'rgba(255, 255, 255, 0.2)',
      }
    },
  },
  plugins: [],
}
