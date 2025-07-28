import { requireAdmin } from "@/lib/admin-auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { NewPostClient } from "./new-post-client";

export default async function NewPostPage() {
  // Server-side admin check - will redirect if not admin
  await requireAdmin();

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="ghost" className="mb-4">
          <Link href="/posts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground">
          Create a new blog post. All fields marked with * are required.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
          <CardDescription>
            Fill in the information below to create your post. You can save as a draft or publish immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewPostClient />
        </CardContent>
      </Card>
    </div>
  );
} 