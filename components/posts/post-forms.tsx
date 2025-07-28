"use client";
import {
  AutoFormInputComponentProps,
  FieldConfig,
} from "@/components/ui/auto-form/types";
import {
  PostCreateWithoutRefineSchema as PostCreateSchema,
  PostUpdateWithoutRefineSchema as PostUpdateSchema,
} from "@zenstackhq/runtime/zod/models";
import { Trash2, Upload } from "lucide-react";

import { z } from "zod";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { MinimalTiptapEditor } from "@/components/ui/minimal-tiptap";
import { useMemo, memo, useState, useRef } from "react";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useCreatePost, useUpdatePost, useDeletePost, useFindUniquePost } from "@/hooks/model/post";
import { useFindManyTag } from "@/hooks/model/tag";
import MultipleSelector, { Option } from "@/components/posts/multi-select";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { uploadImage } from "@/lib/upload";
import { slugify } from "@/lib/utils";
import Image from "next/image";

const CustomPostCreateSchema = PostCreateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
  publishedAt: true,
}).extend({
  tagNames: z.string().optional(), // TagNames as comma-separated string
});

const CustomPostUpdateSchema = PostUpdateSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  authorId: true,
  publishedAt: true,
}).extend({
  tagNames: z.string().optional(), // TagNames as comma-separated string
});

type AddPostFormProps = {
  onClose: () => void;
  onSuccess: () => void;
};

const addPostFormPropsAreEqual = (
  prevProps: AddPostFormProps,
  nextProps: AddPostFormProps
): boolean => {
  if (prevProps.onClose !== nextProps.onClose) return false;
  if (prevProps.onSuccess !== nextProps.onSuccess) return false;
  return true;
};

const AddPostFormComponent = ({
  onClose,
  onSuccess,
}: AddPostFormProps) => {
  const [featuredImageUploading, setFeaturedImageUploading] = useState(false);

  const schema = CustomPostCreateSchema;

  const config = useMemo(() => {
    return createPostFieldConfig(setFeaturedImageUploading);
  }, []);

  const {
    mutateAsync: createPost,
    isPending: isCreatingPost,
    error: createPostError,
  } = useCreatePost({ optimisticUpdate: false });

  const onSubmit = async (data: z.infer<typeof schema>) => {

    // Auto-generate slug from title if not provided
    const slug = data.slug || slugify(data.title);

    await createPost({
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        slug,
        published: data.published || false,
        publishedAt: data.published ? new Date() : null,
        featuredImage: data.featuredImage || null,
        tags: data.tagNames ? {
          create: data.tagNames.split(',').map(tagName => tagName.trim()).filter(Boolean).map(tagName => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName.toLowerCase() },
                create: {
                  name: tagName.toLowerCase(),
                  slug: slugify(tagName),
                }
              }
            }
          }))
        } : undefined,
      },
    });
    toast.success("Post created successfully");
    onSuccess();
  };

  return (
    <AutoForm
      className="space-y-4"
      formSchema={schema}
      fieldConfig={config}
      onSubmit={onSubmit}
    >
      {createPostError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {createPostError?.message ||
            `Failed to create post. Please try again.`}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <AutoFormSubmit disabled={isCreatingPost || featuredImageUploading}>
          {isCreatingPost ? "Creating..." : "Create Post"}
        </AutoFormSubmit>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isCreatingPost}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </AutoForm>
  );
};

export const AddPostForm = memo(AddPostFormComponent, addPostFormPropsAreEqual);

type EditPostFormProps = {
  postSlug: string;
  onClose: () => void;
  onSuccess: () => void;
};

const editPostFormPropsAreEqual = (
  prevProps: EditPostFormProps,
  nextProps: EditPostFormProps
): boolean => {
  if (prevProps.postSlug !== nextProps.postSlug) return false;
  if (prevProps.onClose !== nextProps.onClose) return false;
  if (prevProps.onSuccess !== nextProps.onSuccess) return false;
  return true;
};

const EditPostFormComponent = ({
  postSlug,
  onClose,
  onSuccess,
}: EditPostFormProps) => {
  const [featuredImageUploading, setFeaturedImageUploading] = useState(false);

  const { data: post } = useFindUniquePost(
    { 
      where: { slug: postSlug },
      include: {
        tags: {
          include: {
            tag: true
          }
        }
      }
    },
    { staleTime: 5 * 60 * 1000 }
  );

  const initialData = useMemo(() => {
    if (!post) return {};
    return {
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      slug: post.slug,
      published: post.published,
      featuredImage: post.featuredImage || "",
      tagNames: post.tags?.map((postTag) => postTag.tag.name).join(', ') || "",
    };
  }, [post]);

  const schema = CustomPostUpdateSchema;

  const config = useMemo(() => {
    return createPostFieldConfig(setFeaturedImageUploading);
  }, []);

  const {
    mutateAsync: updatePost,
    isPending: isUpdatingPost,
    error: updatePostError,
  } = useUpdatePost({ optimisticUpdate: false });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await updatePost({
      where: { slug: postSlug },
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        slug: data.slug,
        published: data.published,
        publishedAt: data.published && !post?.published ? new Date() : post?.publishedAt,
        featuredImage: data.featuredImage || null,
        tags: data.tagNames ? {
          deleteMany: {},  // Delete all existing tags
          create: data.tagNames.split(',').map(tagName => tagName.trim()).filter(Boolean).map(tagName => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName.toLowerCase() },
                create: {
                  name: tagName.toLowerCase(),
                  slug: slugify(tagName),
                }
              }
            }
          }))
        } : { deleteMany: {} },
      },
    });
    toast.success("Post updated successfully");
    onSuccess();
  };

  return (
    <AutoForm
      className="space-y-4"
      formSchema={schema}
      fieldConfig={config}
      values={initialData}
      onSubmit={onSubmit}
    >
      {updatePostError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {updatePostError?.message ||
            `Failed to update post. Please try again.`}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <AutoFormSubmit disabled={isUpdatingPost || featuredImageUploading}>
          {isUpdatingPost ? "Updating..." : "Update Post"}
        </AutoFormSubmit>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isUpdatingPost}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </AutoForm>
  );
};

export const EditPostForm = memo(
  EditPostFormComponent,
  editPostFormPropsAreEqual
);

type EditPostActionsProps = {
  postSlug: string;
  onSuccess: () => void;
};

export function EditPostActions({ postSlug, onSuccess }: EditPostActionsProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
 
  const {
    mutateAsync: deletePost,
    isPending: isDeletingPost,
    error: deletePostError,
  } = useDeletePost({
    optimisticUpdate: false,
  });

  

  const handleDeletePost = async () => {
    try {
      await deletePost({
        where: { slug: postSlug },
      });
      toast.success("Post deleted successfully");
      onSuccess();
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete post");
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <span>Actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => setDeleteDialogOpen(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              post and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deletePostError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {deletePostError.message ||
                "Failed to delete post. Please try again."}
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletingPost}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePost}
              disabled={isDeletingPost}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeletingPost ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function createPostFieldConfig(
  setFeaturedImageUploading: (uploading: boolean) => void
) {
  const config: FieldConfig<
    z.infer<typeof CustomPostCreateSchema> | z.infer<typeof CustomPostUpdateSchema>
  > = {
    title: {
      order: 0,
      inputProps: {
        placeholder: "Enter your post title...",
      },
    },
    slug: {
      order: 1,
      inputProps: {
        placeholder: "url-friendly-slug",
      },
    },
    excerpt: {
      order: 2,
      fieldType: ({
        isRequired,
        field,
        fieldConfigItem,
      }: AutoFormInputComponentProps) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            Excerpt
            {isRequired && <span className="text-destructive"> *</span>}
          </FormLabel>
          <FormControl>
            <Textarea
              placeholder="Brief summary of your post..."
              className="min-h-20"
              value={field.value || ""}
              onChange={field.onChange}
            />
          </FormControl>
          {fieldConfigItem?.description && (
            <FormDescription>{fieldConfigItem.description}</FormDescription>
          )}
        </FormItem>
      ),
    },
    content: {
      order: 5,
      fieldType: ({
        isRequired,
        field,
        fieldConfigItem,
      }: AutoFormInputComponentProps) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            Content
            {isRequired && <span className="text-destructive"> *</span>}
          </FormLabel>
          <FormControl>
          <MinimalTiptapEditor
              className="min-h-80 max-w-full"
              immediatelyRender={false}
              throttleDelay={1000}
              output="markdown"
              editable={true}
              value={field.value}
              editorClassName="focus:outline-none px-4 py-2 min-h-80 h-full"
              onChange={(content) => {
                if (typeof content === "string") {
                  field.onChange(content);
                } else {
                  console.warn("Tiptap content is not a string");
                }
              }}
            />
          </FormControl>
          {fieldConfigItem?.description && (
            <FormDescription>{fieldConfigItem.description}</FormDescription>
          )}
        </FormItem>
      ),
    },
    featuredImage: {
      order: 3,
      fieldType: ({
        isRequired,
        field,
        fieldConfigItem,
        zodInputProps,
        label,
        fieldProps,
        zodItem,
      }: AutoFormInputComponentProps) => {
        return <FeaturedImageField
          isRequired={isRequired}
          field={field}
          fieldConfigItem={fieldConfigItem}
          zodInputProps={zodInputProps}
          label={label}
          fieldProps={fieldProps}
          zodItem={zodItem}
          setFeaturedImageUploading={setFeaturedImageUploading}
        />
      },
    },
    tagNames: {
      order: 4,
      fieldType: ({ isRequired, field, fieldConfigItem }: AutoFormInputComponentProps) => (
        <FormItem className="flex flex-col">
          <FormLabel>
            Tags
            {isRequired && <span className="text-destructive"> *</span>}
          </FormLabel>
          <FormControl>
            <TagsMultiSelect
              value={field.value || ""}
              onChange={field.onChange}
            />
          </FormControl>
          {fieldConfigItem?.description && (
            <FormDescription>{fieldConfigItem.description}</FormDescription>
          )}
        </FormItem>
      ),
      // This ensures the custom field isn't wrapped in default array container
      renderParent: ({ children }) => <>{children}</>,
    },
    published: {
      order: 6,
    },
  };

  return config;
} 

function TagsMultiSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { data: existingTags } = useFindManyTag({
    orderBy: { name: 'asc' }
  });

  const options: Option[] = (existingTags || []).map(tag => ({
    value: tag.name,
    label: tag.name,
  }));

  // Convert comma-separated string to array for internal use
  const tagNamesArray = value ? value.split(',').map(tag => tag.trim()).filter(Boolean) : [];
  
  const selectedOptions: Option[] = tagNamesArray.map(tagName => ({
    value: tagName,
    label: tagName,
  }));

  const handleChange = (newOptions: Option[]) => {
    // Convert array back to comma-separated string
    const tagNamesString = newOptions.map(option => option.value).join(', ');
    onChange(tagNamesString);
  };

  return (
    <MultipleSelector
      value={selectedOptions}
      onChange={handleChange}
      placeholder="Search or create tags..."
      options={options}
      creatable={true}
      hidePlaceholderWhenSelected={true}
      className="w-full"
    />
  );
}

function FeaturedImageField({
  isRequired,
  field,
  fieldConfigItem,
  setFeaturedImageUploading,
}: AutoFormInputComponentProps & {
  setFeaturedImageUploading: (uploading: boolean) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 4 * 1024 * 1024) {
        toast.error('Image size must be less than 4MB');
        return;
      }

      try {
        setIsUploading(true);
        setFeaturedImageUploading(true);
        const blob = await uploadImage(file);
        field.onChange(blob.url);
        toast.success('Image uploaded successfully');
      } catch (error) {
        toast.error('Failed to upload image');
        console.error('Failed to upload image:', error);
        toast.error('Failed to upload image');
      } finally {
        setIsUploading(false);
        setFeaturedImageUploading(false);
      }
    };

    return (
      <FormItem className="flex flex-col">
        <FormLabel>
          Featured Image
          {isRequired && <span className="text-destructive"> *</span>}
        </FormLabel>
        <FormControl>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="Image URL or upload below..."
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            {isUploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading image...
              </div>
            )}
            {field.value && !isUploading && (
              <div className="relative">
                <Image
                  src={field.value}
                  alt="Featured image preview"
                  className="w-full max-w-xs h-auto rounded-md border"
                  width={400}
                  height={400}
                />
              </div>
            )}
          </div>
        </FormControl>
        {fieldConfigItem?.description && (
          <FormDescription>{fieldConfigItem.description}</FormDescription>
        )}
      </FormItem>
    );
}