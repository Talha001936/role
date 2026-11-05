import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    port: 5173
=======
    port: 3000
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
  },
  optimizeDeps: {
    // Vite 8 uses Rolldown — do NOT use `esbuildOptions` or `rollupOptions` here
    include: ['react', 'react-dom', 'react-router-dom', '@mui/material', '@mui/icons-material', 'axios', 'chart.js', 'react-chartjs-2']
  }
});