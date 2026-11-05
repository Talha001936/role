import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  optimizeDeps: {
    // Vite 8 uses Rolldown — do NOT use `esbuildOptions` or `rollupOptions` here
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@mui/icons-material', 'axios', 'chart.js', 'react-chartjs-2']
  }
});