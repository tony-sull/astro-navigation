import { defineCollection } from 'astro:content';
import { navigationSchema } from 'astro-navigation';

export const collections = {
  pages: defineCollection({ type: 'content', schema: navigationSchema() })
}
