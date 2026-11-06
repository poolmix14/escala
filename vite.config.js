import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Código-fonte fica em app/. O build vai para a raiz do repositório,
// assim o GitHub Pages ("Deploy from a branch", main / root) já serve o app pronto.
const root = fileURLToPath(new URL('./app', import.meta.url));
const outDir = fileURLToPath(new URL('./', import.meta.url));

export default defineConfig({
  root,
  base: './',
  plugins: [react()],
  build: {
    outDir,
    emptyOutDir: false,
  },
});
