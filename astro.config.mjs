// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'http://localhost:4321',
  trailingSlash: 'ignore',
  devToolbar: {
    enabled: false,
  },

  // 2. Configure o adaptador
  output: 'static', // Use 'hybrid' se quiser algumas páginas com SSR (ex: busca em tempo real)
  adapter: cloudflare({
    // Configura o proxy para desenvolvimento local
    platformProxy: {
      enabled: true,
    },
    // Garante que o deploy no Cloudflare Pages use a estrutura de diretórios
    routes: {
      extend: {
        // Se tiver rotas específicas para ignorar o SSR
        exclude: ['/rss.xml'],
      },
    },
  }),
  // 3. Recomendado para Cloudflare Pages
  build: {
    format: 'directory',
  },
});
