"use client";

import { toast } from "sonner";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { useDeleteBoard, useFindUniqueBoard } from "@/hooks/model";
import { FIND_UNIQUE_BOARD } from "@/lib/constants";
import { Prisma } from "@zenstackhq/runtime/models";

type Props = {
  boardId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export function DeleteBoardForm({
  boardId,
  onClose,
  onSuccess,
}: Props) {

  // Fetch board data to display the board name
  const { data: board } = useFindUniqueBoard(
    FIND_UNIQUE_BOARD(boardId) as Prisma.BoardFindUniqueArgs,
    { enabled: !!boardId, refetchOnMount: false }
  );

  const {
    mutateAsync: deleteBoard,
    isPending: isDeletingBoard,
    error: deleteBoardError,
  } = useDeleteBoard();

  const handleDeleteBoard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await deleteBoard({
      where: { id: boardId },
    });
    onSuccess();
    toast.success("Board deleted successfully");
  };

  // Don't render until board data is loaded
  if (!board) {
    return null;
  }

  return (
    <>
    {deleteBoardError && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {deleteBoardError.message ||
            "Failed to delete board. Please try again."}
        </div>
      )}
    <AlertDialogFooter>
      <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
      <AlertDialogAction
        onClick={handleDeleteBoard}
        disabled={isDeletingBoard}
        className="bg-red-600 hover:bg-red-700"
      >
        {isDeletingBoard  ? "Deleting..." : "Delete"}
      </AlertDialogAction>
    </AlertDialogFooter>
    </>
  );
} 