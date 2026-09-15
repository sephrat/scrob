// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import node from '@astrojs/node';

import { paraglideVitePlugin } from '@inlang/paraglide-js';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  security: {
    checkOrigin: false,
  },

  server: {
    port: 7330,
  },

  vite: {
    plugins: [
      tailwindcss(),
      // UI translations. The language is a user preference, not part of the
      // URL: the ui_language cookie (mirrored from user_settings.ui_language,
      // see middleware.ts) wins, then the browser's Accept-Language, then English.
      paraglideVitePlugin({
        project: './project.inlang',
        outdir: './src/paraglide',
        strategy: ['cookie', 'preferredLanguage', 'baseLocale'],
        cookieName: 'ui_language',
      }),
    ],
    server: {
      allowedHosts: ['abstract-dev.bellamylab.com', 'scrob-dev.bellamylab.com'],
    }
  },

  adapter: node({
    mode: 'standalone'
  })
});