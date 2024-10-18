/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'hero-pattern': "url('/src/images/homebg.jpg')",
        'register-page': "url('/src/images/registerbg.jpg')",
        'view-page': "url('/src/images/viewbg.jpg')",
        'report-page': "url('/src/images/reportbg.jpg')",
        'footer-texture': "url('/src/images/footer-texture.png')",
      },
    },
  },
  plugins: [],
}
