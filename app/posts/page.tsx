import { Button } from "@/components/ui/button";
import Link from "next/link";

import { PostsGrid } from "@/components/posts/posts-grid";
import { PostGridWrapper } from "@/components/posts/post-grid-wrapper";
import { checkIsAdmin } from "@/lib/admin-auth";
import { Plus } from "lucide-react";

export default async function PostsPage() {
  const isAdmin = await checkIsAdmin();

  return (
    <PostGridWrapper
      title="Blog Posts"
      description="Discover our latest articles and insights"
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
      <PostsGrid />
    </PostGridWrapper>
  );
}
