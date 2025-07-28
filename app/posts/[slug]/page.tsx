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
