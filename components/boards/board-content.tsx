"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Settings, Trash2, Plus, Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFindUniqueBoard } from "@/hooks/model";
import { useUpdateTask, useUpdateColumn } from "@/hooks/model";
import { Skeleton } from "@/components/ui/skeleton";
import type { Board, Column, Task, User } from "@zenstackhq/runtime/models";
import { BoardSkeleton } from "@/components/boards/board-skeleton";
import { useModalQuery } from "@/lib/use-modal-query";
import { ActionHeading } from "./action-heading";
import { FIND_UNIQUE_BOARD } from "@/lib/constants";
import { KanbanContent, KanbanOverlay } from "@/components/boards/kanban-content";

type TaskWithAssignee = Task & { assignee: User | null };

type BoardWithColumns = Board & {
  columns: (Column & {
    tasks: TaskWithAssignee[];
  })[];
};

type Props = {
  slug: string;
  initialData?: BoardWithColumns | null;
};

export function BoardContent({ slug, initialData }: Props) {
  const [kanbanState, setKanbanState] = useState<
    Record<string, (Task & { assignee: User | null })[]>
  >({});

  const { modalState, openAddColumnModal, openEditBoardModal, openDeleteBoardModal } = useModalQuery();


  const isInitialRender = useRef(true);
  const queryClient = useQueryClient();

  // Track modal states directly
  const isAnyModalOpen = !!modalState?.openModalType;

  const updateTask = useUpdateTask({
    optimisticUpdate: true,
  });

  const updateColumn = useUpdateColumn({
    optimisticUpdate: true,
  });

  const {
    data: board,
    isLoading,
    isFetching,
    error,
    refetch,
    queryKey,
  } = useFindUniqueBoard(
    FIND_UNIQUE_BOARD(slug),
    {
      initialData,
      staleTime: 30 * 1000,
      refetchInterval: isAnyModalOpen ? false : 30 * 1000, // Pause syncing when modals are open
      refetchIntervalInBackground: true, // Continue refetching even when tab is not active
      refetchOnWindowFocus: isAnyModalOpen? false : "always", // Pause on focus when modals are open
      refetchOnReconnect: true,
      optimisticUpdate: true,
    }
  );


  // Refetch when board slug changes (but not on initial load)
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }
    console.log("refetching board");
    void refetch();
  }, [slug, refetch]);

  // Convert board data to kanban format (memoized for performance)
  const serverKanbanData = useMemo(() => {
    if (!board?.columns) return {};

    return board.columns.reduce(
      (acc, column) => {
        acc[column.id] = column.tasks || [];
        return acc;
      },
      {} as Record<string, (Task & { assignee: User | null })[]>
    );
  }, [board?.columns]);

  useEffect(() => {
    setKanbanState(serverKanbanData);
  }, [serverKanbanData]);

  // Handle kanban updates
  const handleKanbanChange = useCallback(
    async (newData: Record<string, (Task & { assignee: User | null })[]>) => {
      // Update local state immediately for smooth UI

      setKanbanState(newData);

      if (!board) return;

      if (!queryKey) {
        console.error("Could not find query key for board");
        return;
      }

      await queryClient.cancelQueries({ queryKey });

      const previousBoard =
        queryClient.getQueryData<BoardWithColumns>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData<BoardWithColumns | undefined>(
        queryKey,
        (oldBoard) => {
          if (!oldBoard) {
            return undefined;
          }

          const newBoard: BoardWithColumns = JSON.parse(
            JSON.stringify(oldBoard)
          );

          const newColumns = Object.keys(newData).map((columnId, colIndex) => {
            const column = newBoard.columns.find((c) => c.id === columnId)!;
            // Here we are creating a new column object to avoid mutation
            const newColumn = { ...column, order: colIndex };

            newColumn.tasks = newData[columnId].map((task, taskIndex) => ({
              ...task,
              order: taskIndex,
              columnId: columnId,
            }));
            return newColumn;
          });

          newBoard.columns = newColumns.sort((a, b) => a.order - b.order);
          return newBoard;
        }
      );

      // Create lookup maps for performance
      const columnMap = new Map(board.columns.map((col) => [col.id, col]));
      const taskMap = new Map(
        board.columns.flatMap((col) => col.tasks.map((task) => [task.id, task]))
      );

      // Track all mutations to fire them
      const mutations: Array<Promise<Task | Column | undefined>> = [];

      // Process column order changes
      const newColumnOrder = Object.keys(newData);
      newColumnOrder.forEach((columnId, index) => {
        const currentColumn = columnMap.get(columnId);
        if (currentColumn && currentColumn.order !== index) {
          mutations.push(
            updateColumn.mutateAsync({
              where: { id: columnId },
              data: { order: index },
            })
          );
        }
      });

      // Process task changes
      Object.entries(newData).forEach(([columnId, tasks]) => {
        tasks.forEach((task, index) => {
          const currentTask = taskMap.get(task.id);
          if (currentTask) {
            const needsColumnUpdate = currentTask.columnId !== columnId;
            const needsOrderUpdate = currentTask.order !== index;

            if (needsColumnUpdate || needsOrderUpdate) {
              mutations.push(
                updateTask.mutateAsync({
                  where: { id: task.id },
                  data: { columnId, order: index },
                })
              );
            }
          }
        });
      });

      // Execute mutations in parallel to avoid race conditions and improve performance
      try {
        await Promise.all(mutations);
      } catch (error) {
        console.error("Error updating kanban data:", error);
        // On failure, revert to the previous state
        if (previousBoard) {
          queryClient.setQueryData(queryKey, previousBoard);
        }
      } finally {
        // Always refetch to ensure data consistency
        await queryClient.invalidateQueries({ queryKey });
      }
    },
    [board, queryClient, queryKey, updateColumn, updateTask]
  );


  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="mb-8">
          <BoardSkeleton />
        </div>
      </div>
    );
  }

  if (error || !board) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary-foreground">Board not found</h1>
        </div>
        <p className="text-muted-foreground">
          {error?.message ||
            "The board you're looking for doesn't exist or you don't have access to it."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <ActionHeading title={board.name} isLoading={isLoading} isFetching={isFetching} isPaused={isAnyModalOpen}>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openAddColumnModal(board.id)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Column
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditBoardModal()}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Board
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openDeleteBoardModal()}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Board
              </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </ActionHeading>

      <div className="mb-8">
        {board.columns && board.columns.length > 0 ? (
          <KanbanContent
            value={kanbanState}
            onValueChange={handleKanbanChange}
            columns={board.columns}
          >
            <KanbanOverlay />
          </KanbanContent>
        ) : (
          <div className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-muted p-6">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">No columns yet</h3>
                <p className="text-muted-foreground max-w-md">
                  This board doesn&apos;t have any columns yet. Create your
                  first column to start organizing your tasks.
                </p>
              </div>
              <Button onClick={() => openAddColumnModal(board.id)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Column
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
