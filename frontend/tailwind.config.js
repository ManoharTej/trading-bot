/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pro: {
          bg: '#0F172A',         // Deep dark slate background
          panel: '#1E293B',      // Panel background
          border: '#334155',     // Border color
          amber: '#F59E0B',      // Brand amber
          cyan: '#06B6D4',       // Brand cyan
          green: '#10B981',      // Success / Buy
          red: '#EF4444'         // Danger / Sell
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
