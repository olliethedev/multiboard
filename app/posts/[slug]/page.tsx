import { Metadata } from "next";
import { Markdown } from "@/components/posts/markdown";
import PostHero from "@/components/posts/post-hero";
import { getZenstackPrisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { checkIsAdmin } from "@/lib/admin-auth";
import { LatestPostsSection } from "@/components/marketing/latest-posts-section";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const prisma = await getZenstackPrisma();
  const slug = (await params).slug;

  const post = await prisma.post.findUnique({
    include: {
      author: {
        select: {
          name: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
    where: {
      slug,
    },
  });

  if (!post) {
    return {
      title: "Post Not Found | Multiboard",
      description: "The requested post could not be found.",
    };
  }

  const baseUrl = process.env.BETTER_AUTH_URL || 'https://www.multiboard.dev';
  const postUrl = `${baseUrl}/posts/${post.slug}`;
  const tags = post.tags.map(postTag => postTag.tag.name);

  return {
    title: `${post.title} | Multiboard`,
    description: post.excerpt,
    keywords: tags.length > 0 ? tags.join(', ') : undefined,
    authors: [{ name: post.author.name }],
    creator: post.author.name,
    publisher: "Multiboard",
    category: "Technology",
    
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: "Multiboard",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author.name],
      tags: tags,
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        }
      ] : [
        {
          url: `${baseUrl}/og-default.png`,
          width: 1200,
          height: 630,
          alt: "Multiboard - Open Source Kanban Project Management",
        }
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      creator: "@olliethedev",
      images: post.featuredImage ? [post.featuredImage] : [`${baseUrl}/og-default.png`],
    },

    robots: {
      index: post.published,
      follow: post.published,
      googleBot: {
        index: post.published,
        follow: post.published,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const prisma = await getZenstackPrisma();
  const slug = (await params).slug;
  const isAdmin = await checkIsAdmin();

  const post = await prisma.post.findUnique({
    include: {
      author: {
        select: {
          name: true,
        },
      },
      tags: {
        include: {
          tag: true,
        },
      },
    },
    where: {
      slug,
    },
  });
  if (!post) {
    notFound();
  }
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <PostHero post={post} isAdmin={isAdmin} />
        <div className="mx-auto max-w-4xl px-4 py-8">
          <Markdown>{post.content}</Markdown>
        </div>
        
        {/* Related Posts Section */}
        {post.tags && post.tags.length > 0 && (
          <LatestPostsSection
            title="Related Posts"
            description="Discover more articles with similar topics"
            queryFilter={{
              tags: {
                some: {
                  tagId: {
                    in: post.tags.map(postTag => postTag.tag.id)
                  }
                }
              },
              NOT: {
                id: post.id
              }
            }}
            className="bg-muted/30"
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
