import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build`        -> normal multi-file production build (dist/)
// `npm run build:single` -> one self-contained index.html, fonts inlined (dist-single/)
export default defineConfig(({ mode }) => {
  const single = mode === 'single';
  return {
    plugins: single ? [react(), viteSingleFile()] : [react()],
    build: {
      outDir: single ? 'dist-single' : 'dist',
      assetsInlineLimit: single ? 100_000_000 : 4096,
    },
  };
});
