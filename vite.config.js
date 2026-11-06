import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// base relativa: funciona em poolmix14.github.io/escala/ e localmente
export default defineConfig({
  base: './',
  plugins: [react()],
});
