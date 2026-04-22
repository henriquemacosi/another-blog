// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  site: 'https://test-blog.henriquemacosi.com/',
  trailingSlash: 'ignore',

  devToolbar: {
    enabled: false,
  },

  // 2. Configure o adaptador
  // Use 'hybrid' se quiser algumas páginas com SSR (ex: busca em tempo real)
  output: 'static',

  /* image: {
    // Isso garante que o Astro use o Sharp (ou Squoosh) no build
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  }, */

  adapter: cloudflare({
    imageService: 'compile',
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
    assets: '_images',
  },

  integrations: [
    sitemap(/* {
      // Opcional: Filtrar páginas que você não quer no Google
      filter: (page) => !page.includes('/secret-page'),
      // Opcional: Adicionar páginas externas se necessário
      customPages: ['https://henriquemacosi.com/portfolio'],
    } */),
  ],
});
