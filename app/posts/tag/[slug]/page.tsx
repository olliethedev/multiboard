import { Metadata } from "next";
import Link from "next/link";
import { PostsGrid } from "@/components/posts/posts-grid";
import { PostGridWrapper } from "@/components/posts/post-grid-wrapper";
import { deslugify, prettifyTagName } from "@/lib/utils";
import { checkIsAdmin } from "@/lib/admin-auth";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TagPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  // Format the slug for display (replace hyphens with spaces and capitalize)
  const slug = (await params).slug;
  const tagName = deslugify(slug);

  return {
    title: `${tagName} Posts | Multiboard`,
    description: `Browse all posts tagged with "${tagName}"`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  // Convert slug back to tag name format (lowercase with spaces)
  const slug = (await params).slug;
  const displayTagName = prettifyTagName(slug);
  const isAdmin = await checkIsAdmin();

  return (
    <PostGridWrapper
      title={`${displayTagName} Posts`}
      description={`Browse all posts tagged with "${displayTagName}"`}
      actions={
        isAdmin ? (
          <Button asChild>
            <Link href="/posts/new">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        ) : null
      }
    >
      <PostsGrid tagSlugFilter={slug} />
    </PostGridWrapper>
  );
}
