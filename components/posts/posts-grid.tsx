"use client";

import React from "react";
import { useInfiniteFindManyPost } from "@/hooks/model";
import { PostSchema } from "@zenstackhq/runtime/zod/models";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import { useSession } from "@/lib/auth-client";
import { PostCard } from "@/components/posts/post-card";
import { ArrowRightIcon } from "lucide-react";

const PAGE_SIZE = 12;

// Extend the PostSchema to include the tags relationship with proper typing
type PostWithTags = z.infer<typeof PostSchema> & {
  tags?: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
      color?: string | null;
    };
  }>;
};

interface PostsGridProps {
  tagSlugFilter?: string;
}

export function PostsGrid({ tagSlugFilter }: PostsGridProps) {
  const fetchArgs = {
    where: tagSlugFilter ? {
      tags: {
        some: {
          tag: {
            slug: tagSlugFilter
          }
        }
      }
    } : undefined,
    include: {
      tags: {
        include: {
          tag: true
        }
      }
    },
    orderBy: { publishedAt: "desc" as const },
    take: PAGE_SIZE,
  };

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteFindManyPost(fetchArgs, {
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < PAGE_SIZE) {
        return undefined;
      }
      const fetched = pages.flatMap((item) => item).length;
      return {
        ...fetchArgs,
        skip: fetched,
      };
    },
  });

  if (isLoading) {
    return <PostsGridSkeleton />;
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-red-600">
          Error loading posts
        </h3>
        <p className="text-muted-foreground mt-2">
          {error?.message || "Something went wrong while fetching posts."}
        </p>
      </div>
    );
  }

  const allPosts = (data?.pages.flatMap((page) => page) || []) as PostWithTags[];

  if (allPosts.length === 0) {
    const emptyMessage = tagSlugFilter 
      ? `No posts found with the tag "${tagSlugFilter}"`
      : "There are no published posts at the moment.";
    
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No posts found</h3>
        <p className="text-muted-foreground mt-2">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPosts.map((post) => (
          <PostCard key={post.id} post={post} canEdit={isAdmin} />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            variant="outline"
            size="lg"
            className="gap-2"
          >
            {isFetchingNextPage ? (
              <>
                <div className="w-4 h-4 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                Loading more...
              </>
            ) : (
              <>
                Load more posts
                <ArrowRightIcon className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}


function PostsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Card key={i} className="h-full">
          <div className="relative h-48 w-full">
            <Skeleton className="w-full h-full rounded-t-xl" />
          </div>
          <CardHeader>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-32" />
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-between w-full">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
