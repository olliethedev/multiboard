
import { upload } from "@vercel/blob/client";

export async function uploadImage(file: File) {
  return upload(file.name, file, {
    access: 'public',
    handleUploadUrl: '/api/upload/image',
  });
}