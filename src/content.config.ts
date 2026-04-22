import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob, file } from 'astro/loaders'; // Importamos os loaders

// 1. Coleção de Autores (Lendo de arquivos JSON ou YAML em src/content/authors)
const authors = defineCollection({
  loader: glob({
    pattern: '**/*.{json,yaml,yml}',
    base: 'src/content/authors',
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      bio: z.string(),
      avatar: z.object({
        url: image(),
        alt: z.string().default('Foto do autor'),
      }),
      social: z
        .object({
          website: z.string().optional(),
          linkedin: z.string().optional(),
          instagram: z.string().optional(),
          twitter: z.string().optional(),
          github: z.string().optional(),
        })
        .optional(),
    }),
});

// 2. Coleção do Blog (Lendo Markdowns em src/content/blog)
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: 'src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      authors: z.array(reference('authors')),
      pubDate: z.coerce.date(), // Use coerce para evitar erros de formato de data
      image: z.object({
        url: image(),
        alt: z.string(),
      }),
      taxonomies: z.object({
        categories: z.array(reference('categories')),
        tags: z.array(z.string()),
      }),
      draft: z.boolean().default(false),
    }),
});

// 3. Coleção Categorias (Lendo de arquivos em src/content/categories)
const categories = defineCollection({
  loader: glob({
    pattern: '**/*.{json,yaml,yml}',
    base: 'src/content/categories',
  }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      description: z.string(),
      image: z.object({
        url: image(),
        alt: z.string(),
      }),
    }),
});

export const collections = { blog, authors, categories };
