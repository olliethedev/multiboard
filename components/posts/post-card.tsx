import { z } from "zod";
import { PostSchema } from "@zenstackhq/runtime/zod/models";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";

export function PostCard({
    post,
    canEdit,
  }: {
    post: z.infer<typeof PostSchema>;
    canEdit: boolean;
  }) {
    const publishedDate = post.publishedAt || post.createdAt;
    const [imageError, setImageError] = useState(false);
  
    return (
      <Card className="group hover:shadow-lg transition-shadow duration-200 h-full flex flex-col relative pt-0 pb-4">
        {/* Featured Image or Placeholder */}
        <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-muted">
          {post.featuredImage && !imageError ? (
            <Image
              src={post.featuredImage}
              alt={post.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
              width={500}
              height={300}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/80">
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon className="w-14 h-14 mb-2" />
              </div>
            </div>
          )}
        </div>
  
        {!post.published && (
          <Badge variant="destructive" className="text-xs absolute top-2 left-2">
            Draft
          </Badge>
        )}
  
        <CardHeader className="flex-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <CalendarIcon className="w-3 h-3" />
            <time dateTime={publishedDate?.toISOString()}>
              {formatDistanceToNow(publishedDate || new Date(), {
                addSuffix: true,
              })}
            </time>
          </div>
  
          <CardTitle className="line-clamp-2 transition-colors">
            <Link href={`/posts/${post.slug}`} className="hover:underline">
              {post.title}
            </Link>
          </CardTitle>
        </CardHeader>
  
        <CardContent className="flex-1 flex flex-col gap-4">
          {post.excerpt && (
            <CardDescription className="line-clamp-3 mt-2">
              {post.excerpt}
            </CardDescription>
          )}
        </CardContent>
  
        <CardFooter>
          <div className="flex items-center justify-between w-full">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/posts/${post.slug}`}>
                Read more
                <ArrowRightIcon className="w-3 h-3 ml-1" />
              </Link>
            </Button>
            {canEdit && (
              <Button size="sm" asChild>
                <Link href={`/posts/${post.slug}/edit`}>
                  Edit
                </Link>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    );
  }