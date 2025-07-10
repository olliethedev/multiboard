"use client";

import { Button } from "@/components/ui/button";
import z from "zod";
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { useFindUniqueColumn, useUpdateColumn } from "@/hooks/model";
import type { Prisma } from "@zenstackhq/runtime/models";
import { ColumnUpdateScalarSchema } from "@zenstackhq/runtime/zod/models";
import { toast } from "sonner";

const columnUpdateSchema = ColumnUpdateScalarSchema.omit({
  id: true,
  order: true,
});

interface EditColumnFormProps {
  columnId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditColumnForm({
  columnId,
  onClose,
  onSuccess,
}: EditColumnFormProps) {
  const {
    mutateAsync: updateColumn,
    isPending: isUpdatingColumn,
    error: updateColumnError,
  } = useUpdateColumn({ optimisticUpdate: true });

  const { data: column } = useFindUniqueColumn(
    { where: { id: columnId } } as Prisma.ColumnFindUniqueArgs,
    { enabled: !!columnId, refetchOnMount: false }
  );

  const onSubmit = async (data: z.infer<typeof columnUpdateSchema>) => {
    await updateColumn({
      where: { id: columnId },
      data: {
        title: data.title,
      },
    });
    onSuccess();
    toast.success("Column updated successfully");
  };

  if (!column) {
    return null;
  }

  return (
    <AutoForm
      formSchema={columnUpdateSchema}
      onSubmit={onSubmit}
      values={{
        title: column.title,
      }}
    >
      {updateColumnError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {updateColumnError.message ||
            "Failed to update column. Please try again."}
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <AutoFormSubmit disabled={isUpdatingColumn}>
          {isUpdatingColumn ? "Updating..." : "Update Column"}
        </AutoFormSubmit>
        <Button
          variant="outline"
          onClick={onClose}
          disabled={isUpdatingColumn}
          type="button"
        >
          Cancel
        </Button>
      </div>
    </AutoForm>
  );
}
