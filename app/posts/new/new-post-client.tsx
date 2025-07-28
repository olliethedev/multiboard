"use client";

import { useRouter } from "next/navigation";
import { AddPostForm } from "@/components/posts/post-forms";

export function NewPostClient() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/posts");
  };

  const handleClose = () => {
    router.push("/posts");
  };

  return (
    <AddPostForm onClose={handleClose} onSuccess={handleSuccess} />
  );
} 