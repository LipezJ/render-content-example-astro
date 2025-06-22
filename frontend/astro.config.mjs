// @ts-check
import { defineConfig } from 'astro/config';

import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

console.log('Loading Astro configuration...');
console.log(`ASTRO_STATIC environment variable: ${process.env.ASTRO_STATIC}`);

const isStatic = process.env.ASTRO_STATIC === 'true';

let config;

if (isStatic) {
  console.log('Building for static output');
  config = {
    output: 'static',
    outDir: '../backend/static',
    vite: {
      plugins: [tailwindcss()]
    }
  };
} else {
  console.log('Building for server output');
  config = {
    output: 'server',
    adapter: node({
      mode: 'middleware',
    }),
    vite: {
      plugins: [tailwindcss()]
    }
  };
}

// @ts-ignore
export default defineConfig(config);