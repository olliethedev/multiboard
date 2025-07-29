"use client";

import React from "react";
import { useInfiniteFindManyPost } from "@/hooks/model";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { PostCard, PostCardSkeleton } from "@/components/posts/post-card";
import { ArrowRightIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface LatestPostsSectionProps {
  title?: string;
  description?: string;
  queryFilter?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  className?: string;
}

const POSTS_LIMIT = 3;

export function LatestPostsSection({
  title = "Latest Blog Posts",
  description = "Stay up to date with our latest articles and insights",
  queryFilter = {},
  className = "",
}: LatestPostsSectionProps) {
  const fetchArgs = {
    orderBy: { publishedAt: "desc" as const },
    take: POSTS_LIMIT,
    where: {
      published: true,
      ...queryFilter,
    },
  };

  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";

  const {
    data,
    isLoading,
    isError,
    error,
  } = useInfiniteFindManyPost(fetchArgs, {
    getNextPageParam: () => undefined, // No pagination needed for latest posts
  });

  const posts = data?.pages?.[0] || [];

  if (isLoading) {
    return <LatestPostsSkeleton title={title} description={description} className={className} />;
  }

  if (isError) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-red-600">
              Error loading posts
            </h3>
            <p className="text-muted-foreground mt-2">
              {error?.message || "Something went wrong while fetching posts."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">No posts found</h3>
            <p className="text-muted-foreground mt-2">
              There are no published posts at the moment.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} canEdit={isAdmin} />
          ))}
        </div>

        {/* View All Posts Link */}
        {posts.length > 0 && (
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link href="/posts" className="gap-2">
                View all posts
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}



function LatestPostsSkeleton({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className: string;
}) {
  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Skeleton Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: POSTS_LIMIT }).map((_, i) => (
            <PostCardSkeleton key={i} />
          ))}
        </div>

        {/* Skeleton View All Button */}
        <div className="text-center mt-12">
          <Skeleton className="h-10 w-32 mx-auto" />
        </div>
      </div>
    </section>
  );
} 