import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import siteData from '../data/siteData.json';

export async function GET(context) {
  const now = new Date();

  // 1. Buscamos e filtramos (Rascunhos e Futuros)
  const blog = await getCollection('blog', ({ data }) => {
    return !data.draft && data.pubDate <= now;
  });

  // 2. Ordenamos e LIMITAMOS (ex: apenas os 20 mais recentes)
  const latestPosts = blog
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .slice(0, 10); // Altere aqui o número de posts que deseja no feed

  return rss({
    stylesheet: '/rss/styles.xsl',
    title: siteData.title,
    description: siteData.description,
    site: context.site,

    // Mapeia apenas os posts limitados pelo slice
    items: latestPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      customData: `<media:content
          type="image/jpeg"
          medium="image"
          url="${siteData.url}${post.data.image.url}" />`,
    })),

    xmlns: {
      media: 'http://search.yahoo.com/mrss/',
    },

    customData: `<language>${siteData.inLanguage || 'pt-BR'}</language>`,
  });
}
