import { defineConfig } from 'vite';
import fs from 'fs';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  css: {
    postcss: resolve(__dirname, 'postcss.config.js'),
    preprocessorOptions: {
      scss: {
       
      },
    },
  },
  resolve: {
    alias: {
      '@scss': resolve(__dirname, './scss'),
    },
  },
  plugins: [
    {
      name: 'create-redirects-file',
      apply: 'build',
      closeBundle() {
        const outputDir = resolve(__dirname, 'dist');
        const redirectsFilePath = resolve(outputDir, '_redirects');
        const redirectsContent = '/*    /index.html   200';

        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(redirectsFilePath, redirectsContent);
        console.log('Created _redirects file for SPA fallback.');
      },
    },
  ],
});



