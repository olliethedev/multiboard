import type { MetadataRoute } from 'next'
import { getZenstackPrisma } from '@/lib/db'

const BASE_URL = process.env.BETTER_AUTH_URL || 'https://www.multiboard.dev'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const prisma = await getZenstackPrisma()

  // Fetch all published posts
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    select: {
      slug: true,
      updatedAt: true,
      publishedAt: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  // Fetch all tags that have published posts
  const tags = await prisma.tag.findMany({
    where: {
      posts: {
        some: {
          post: {
            published: true,
          },
        },
      },
    },
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: {
      name: 'asc',
    },
  })

  const sitemap: MetadataRoute.Sitemap = [
    // Home page
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Blog list page
    {
      url: `${BASE_URL}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Individual blog posts (less likely to update)
    ...posts.map((post) => ({
      url: `${BASE_URL}/posts/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    // Tag pages (blog related list pages)
    ...tags.map((tag) => ({
      url: `${BASE_URL}/posts/tag/${tag.slug}`,
      lastModified: tag.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  ]

  return sitemap
} 