import React from "react";
import Image from "next/image";
import { z } from "zod";
import { PostSchema } from "@zenstackhq/runtime/zod/models";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, EditIcon, UserIcon } from "lucide-react";
import Link from "next/link";

interface PostHeroProps {
  isAdmin?: boolean;
  post: z.infer<typeof PostSchema> & {
    author: {
      name: string;
    };
    tags?: Array<{
      tag: {
        id: string;
        name: string;
        slug: string;
        color?: string | null;
      };
    }>;
  };
}

export default function PostHero({ post, isAdmin }: PostHeroProps) {
  return (
    <div className="relative overflow-hidden bg-muted">
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              <span className="block">{post.title}</span>
            </h1>

            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link href={`/posts/${post.slug}/edit`}>
                  <Badge className="w-fit">
                    <EditIcon />
                    Edit
                  </Badge>
                </Link>
              )}
              <Badge className="w-fit">
                <UserIcon />
                {post.author.name}
              </Badge>

              <Badge variant="secondary" className="w-fit">
                <CalendarDays />
                {post.updatedAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-full lg:max-w-2xl">
              {post.excerpt}
            </p>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((postTag: { tag: { id: string; name: string; slug: string; color?: string | null } }) => (
                  <Link key={postTag.tag.id} href={`/posts/tag/${postTag.tag.slug}`}>
                    <Badge 
                      variant="secondary" 
                      className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      style={postTag.tag.color ? { 
                        backgroundColor: postTag.tag.color + '20',
                        borderColor: postTag.tag.color + '40',
                        color: postTag.tag.color 
                      } : undefined}
                    >
                      {postTag.tag.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            )}

            <div className="h-1 w-full bg-gradient-to-r from-primary to-primary/50 rounded-full" />
          </div>

          {post.featuredImage && (
            <div className="relative lg:order-last">
              <div className="relative overflow-hidden rounded-2xl bg-muted/50 p-4">
                <Image
                  src={post.featuredImage}
                  priority
                  className="h-auto w-full rounded-xl shadow-2xl ring-1 ring-border/10"
                  placeholder="blur"
                  blurDataURL="https://placehold.co/1792x1024"
                  alt={post.title}
                  width="1792"
                  height="1024"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* Gradient overlay for depth */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/5 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-secondary/10 blur-3xl" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
