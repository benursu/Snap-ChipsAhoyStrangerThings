import { defineConfig } from 'vite';
import fs from 'fs';
import { resolve } from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl'

import dotenv from 'dotenv';
dotenv.config();

let ssl = process.env.HEROKU ? null : basicSsl();

export default defineConfig({
  appType: 'mpa',
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
  server: {
    port: 5174,
    allowedHosts: true,
    cors: true,
  },
  plugins: [
    ssl,
  ],
});



