"use client";

import { useRouter } from "next/navigation";
import { EditPostForm, EditPostActions } from "@/components/posts/post-forms";
import { useFindUniquePost } from "@/hooks/model/post";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type EditPostClientProps = {
  postSlug: string;
};

export function EditPostClient({ postSlug }: EditPostClientProps) {
  const router = useRouter();

  const { data: post, isLoading: isLoadingPost } = useFindUniquePost(
    { where: { slug: postSlug } },
    { staleTime: 5 * 60 * 1000 }
  );

  const handleSuccess = () => {
    router.push("/posts");
  };

  const handleClose = () => {
    router.push("/posts");
  };

  if (isLoadingPost) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Post Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The post you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to edit it.
        </p>
        <Button asChild>
          <Link href="/posts">Back to Posts</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <EditPostActions postSlug={postSlug} onSuccess={handleSuccess} />
      <EditPostForm 
        postSlug={postSlug} 
        onClose={handleClose} 
        onSuccess={handleSuccess} 
      />
    </div>
  );
} 