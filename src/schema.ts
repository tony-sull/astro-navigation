import { z } from 'astro:content'

export function navigationSchema() {
    return z.object({
        title: z.string(),
        excerpt: z.string().optional(),
        navigation: z.object({
            order: z.number(),
            permalink: z.string().url().optional(),
            title: z.string().optional()
        }).optional()
    })
}

export type NavigationEntry = z.infer<ReturnType<typeof navigationSchema>>