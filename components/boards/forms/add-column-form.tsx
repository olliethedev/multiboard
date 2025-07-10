"use client";

import { Button } from "@/components/ui/button";
import z from "zod";
import { ColumnCreateScalarSchema } from "@zenstackhq/runtime/zod/models";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { useCreateColumn, useFindUniqueBoard } from "@/hooks/model";
import { FIND_UNIQUE_BOARD } from "@/lib/constants";

const columnCreateSchema = ColumnCreateScalarSchema.omit({
  id: true,
  order: true,
});

interface AddColumnFormProps {
  onClose: () => void;
  onSuccess: () => void;
  boardId: string;
}

export function AddColumnForm({
  onClose,
  onSuccess,
  boardId,
}: AddColumnFormProps) {
  const { data: board } = useFindUniqueBoard(FIND_UNIQUE_BOARD(boardId), {
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const {
    mutateAsync: createColumn,
    isPending: isCreatingColumn,
    error: createColumnError,
  } = useCreateColumn({ optimisticUpdate: false });

  // Calculate the next order value
  const nextOrder =
    board?.columns.length && board.columns.length > 0
      ? Math.max(...board.columns.map((col) => col.order)) + 1
      : 0;

  const onSubmit = async (data: z.infer<typeof columnCreateSchema>) => {
    await createColumn({
      data: {
        ...data,
        boardId,
        order: nextOrder,
      },
    }, {
      onSuccess: () => {
        onSuccess();
      },
    });
  };

  return (
    <AutoForm formSchema={columnCreateSchema} onSubmit={onSubmit}>
      {createColumnError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {createColumnError.message ||
            "Failed to create column. Please try again."}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <AutoFormSubmit disabled={isCreatingColumn}>
          {isCreatingColumn ? "Creating..." : "Create Column"}
        </AutoFormSubmit>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isCreatingColumn}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </AutoForm>
  );
}
