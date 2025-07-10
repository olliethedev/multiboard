"use client";

import z from "zod";
import { Button } from "@/components/ui/button";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { BoardUpdateWithoutRefineSchema } from "@zenstackhq/runtime/zod/models";
import { useUpdateBoard, useFindUniqueBoard } from "@/hooks/model";
import { Prisma } from "@zenstackhq/runtime/models";
import { FIND_UNIQUE_BOARD } from "@/lib/constants";
import { toast } from "sonner";

const boardUpdateSchema = BoardUpdateWithoutRefineSchema.omit({
  id: true,
  createdAt: true,
  ownerId: true,
  organizationId: true,
});

interface EditBoardFormProps {
  onClose: () => void;
  onSuccess: () => void;
  boardId: string;
}

export function EditBoardForm({
  onSuccess,
  onClose,
  boardId,
}: EditBoardFormProps) {

  const {
    data: board,
  } = useFindUniqueBoard( FIND_UNIQUE_BOARD(boardId) as Prisma.BoardFindUniqueArgs, {
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    mutateAsync: updateBoard,
    isPending: isUpdatingBoard,
    error: updateBoardError,
  } = useUpdateBoard();

  const onSubmit = async (data: z.infer<typeof boardUpdateSchema>) => {
    await updateBoard({
      where: { id: boardId },
      data,
    });
    toast.success("Board updated successfully");
    onSuccess();
  };

  if (!board) {
    return (
      <div className="w-full">
        <p>Board not found</p>
      </div>
    );
  }

  return (
    <AutoForm
      className="w-full"
      formSchema={boardUpdateSchema}
      onSubmit={onSubmit}
      values={{
        name: board.name,
      }}
    >
      {updateBoardError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {updateBoardError.message ||
            "Failed to update board. Please try again."}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <AutoFormSubmit disabled={isUpdatingBoard}>
          {isUpdatingBoard ? "Updating..." : "Update Board"}
        </AutoFormSubmit>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isUpdatingBoard}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </AutoForm>
  );
}
