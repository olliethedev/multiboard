import { requireAdmin } from "@/lib/admin-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { EditPostClient } from "./edit-post-client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EditPostPage({ params }: PageProps) {
  // Server-side admin check - will redirect if not admin
  await requireAdmin();
  
  const resolvedParams = await params;
  const postSlug = resolvedParams.slug;

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Post</h1>
            <p className="text-muted-foreground">
              Update your post details. All fields marked with * are required.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
          <CardDescription>
            Update the information below to modify your post. You can save as a draft or publish.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditPostClient postSlug={postSlug} />
        </CardContent>
      </Card>
    </div>
  );
} 