import siteData from '../data/siteData.json';
import { slugify } from '../scripts/utils.js';

export default function jsonLDGenerator({
  type,
  post,
  url,
  author,
  image,
  title,
  description,
}) {
  if (type === 'author') {
    // Se não houver dados de autor (ex: página de listagem /authors/),
    // retornamos a lógica de página padrão.
    if (!author || !author.name) {
      return `<script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Autores - ${siteData.title}",
        "description": "Conheça a equipa de autores do nosso blog.",
        "url": "${siteData.url}/authors/"
      }
    </script>`;
    }

    // Se houver autor, segue a lógica que já tínhamos
    const authorSlug = url.pathname.split('/').filter(Boolean).pop();

    return `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "${author.name}",
      "url": "${siteData.url}/author/${authorSlug}/",
      "mainEntityOfPage": "${siteData.url}/author/${authorSlug}/",
      "description": "${author.bio || ''}",
      "image": "${siteData.url}${author.avatar?.url || ''}",
      "sameAs": ${JSON.stringify(author.social ? Object.values(author.social).filter((v) => v) : [])}
    }
  </script>`;
  }

  if (type === 'post') {
    return `<script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "${url}"
        },
        "headline": "${post.title}",
        "description": "${post.description}",
        "image": "${siteData.url}${post.image?.url || ''}",
        "author": {
          "@type": "Person",
          "name": "${author?.data?.name || 'Autor'}",
          "url": "${siteData.url}/authors/${author?.id || ''}"
        },
        "datePublished": "${new Date(post.pubDate).toISOString()}"
      }
    </script>`;
  }

  if (type === 'page') {
    return `<script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "${title || siteData.title}",
        "description": "${description || siteData.description}",
        "url": "${url || siteData.url}",
        "inLanguage": "${siteData.inLanguage || 'pt-BR'}"
      }
    </script>`;
  }

  // fallback para WebSite (ex: home)
  return `<script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "${siteData.title}",
      "url": "${siteData.url}",
      "description": "${siteData.description}",
      "inLanguage": "${siteData.inLanguage || 'pt-BR'}",
      "publisher": {
        "@type": "Organization",
        "name": "${siteData.title}",
        "url": "${siteData.url}",
        "logo": {
          "@type": "ImageObject",
          "url": "${siteData.url}${siteData.logo}"
        }
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "${siteData.url}/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  </script>`;
}
