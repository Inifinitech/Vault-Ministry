/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/src/images/homebg.jpg')",  // Adjusted path for home background image
        'footer-texture': "url('/src/images/footer-texture.png')",  // Update this if you have a footer texture image in the same folder
      },
    },
  },
  plugins: [],
}
