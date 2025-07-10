"use client";

import { toast } from "sonner";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useDeleteColumn, useFindUniqueColumn } from "@/hooks/model";
import { Prisma } from "@zenstackhq/runtime/models";

type Props = {
  columnId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function DeleteColumnForm({
  columnId,
  onClose,
  onSuccess,
}: Props) {

  const { data: column } = useFindUniqueColumn(
    { where: { id: columnId } } as Prisma.ColumnFindUniqueArgs,
    { enabled: !!columnId, refetchOnMount: false }
  );

  const {
    mutateAsync: deleteColumn,
    isPending: isDeletingColumn,
    error: deleteColumnError,
  } = useDeleteColumn({
    optimisticUpdate: true,
  });

  const handleDeleteColumn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await deleteColumn({
      where: { id: columnId },
    });
    onSuccess();
    toast.success("Column deleted successfully");
  };

  if (!column) {
    return null;
  }

  return (
    <>
      {deleteColumnError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {deleteColumnError.message ||
            "Failed to delete column. Please try again."}
        </div>
      )}
      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDeleteColumn}
          disabled={isDeletingColumn}
          className="bg-red-600 hover:bg-red-700"
        >
          {isDeletingColumn ? "Deleting..." : "Delete"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
} 