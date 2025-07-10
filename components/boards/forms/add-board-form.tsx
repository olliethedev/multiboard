"use client";

import { Button } from "@/components/ui/button";
import z from "zod";
import { BoardCreateWithoutRefineSchema } from "@zenstackhq/runtime/zod/models";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { useCreateBoard, useCreateManyColumn } from "@/hooks/model";
import { toast } from "sonner";

const boardCreateSchema = BoardCreateWithoutRefineSchema.omit({
  id: true,
  createdAt: true,
  ownerId: true,
  organizationId: true,
});

interface AddBoardFormProps {
  onClose: () => void;
  onSuccess: (boardId: string) => void;
}

export function AddBoardForm({ onClose, onSuccess }: AddBoardFormProps) {
  const {
    mutateAsync: createBoard,
    isPending: isCreatingBoard,
    error: createBoardError,
  } = useCreateBoard({ optimisticUpdate: true });

  const {
    mutateAsync: createManyColumns,
    isPending: isCreatingColumns,
    error: createColumnsError,
  } = useCreateManyColumn({ optimisticUpdate: true });

  const handleCancel = () => {
    onClose();
  };

  const handleSubmit = async (data: z.infer<typeof boardCreateSchema>) => {
    try {
      const result = await createBoard({ data });

      if (result?.id) {
        // Create standard Kanban columns
        const standardColumns = [
          { title: "To Do", order: 0, boardId: result.id },
          { title: "In Progress", order: 1, boardId: result.id },
          { title: "Done", order: 2, boardId: result.id },
        ];

        await createManyColumns({
          data: standardColumns,
        });

        toast.success("Board created successfully with standard columns");
        onSuccess(result.id);
      }
    } catch (error) {
      toast.error("Failed to create board");
      console.error("Error creating board:", error);
    }
  };

  const isPending = isCreatingBoard || isCreatingColumns;

  return (
    <AutoForm
      className="w-full"
      formSchema={boardCreateSchema}
      onSubmit={handleSubmit}
    >
      {(createBoardError || createColumnsError) && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {createBoardError?.message ||
            createColumnsError?.message ||
            "Failed to create board. Please try again."}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <AutoFormSubmit disabled={isPending}>
          {isPending ? "Creating..." : "Create Board"}
        </AutoFormSubmit>
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isPending}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </AutoForm>
  );
}
