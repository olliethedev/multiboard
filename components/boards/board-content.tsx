"use client";

import { useCallback, useEffect, useMemo, useRef, useState, memo } from "react";
import { Settings, Trash2, Plus, Pencil } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import equal from "fast-deep-equal";
import * as Kanban from "@/components/ui/kanban";
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
import { BoardColumnContent } from "@/components/boards/board-column-content";
import type { Board, Column, Prisma, Task, User } from "@zenstackhq/runtime/models";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { BoardSkeleton } from "@/components/boards/board-skeleton";
import { useModalQuery } from "@/lib/use-modal-query";
import { ActionHeading } from "./action-heading";
import { FIND_UNIQUE_BOARD } from "@/lib/constants";

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
    FIND_UNIQUE_BOARD(slug) as Prisma.BoardFindUniqueArgs,
    {
      initialData,
      staleTime: 30 * 1000,
      refetchInterval: isAnyModalOpen ? false : 30 * 1000, // Pause syncing when modals are open
      refetchIntervalInBackground: true, // Continue refetching even when tab is not active
      refetchOnWindowFocus: !isAnyModalOpen, // Pause on focus when modals are open
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

type KanbanContentProps = {
  children: React.ReactNode;
  value: Record<string, (Task & { assignee: User | null })[]>;
  onValueChange: (
    newData: Record<string, (Task & { assignee: User | null })[]>
  ) => void;
  columns: (Column & {
    tasks: (Task & {
      assignee: User | null;
    })[];
  })[];
};

// Memoize the overlay children to prevent recreation
const KanbanOverlay = memo(() => (
  <Kanban.Overlay>
    <div className="size-full rounded-md bg-primary/10" />
  </Kanban.Overlay>
));
KanbanOverlay.displayName = 'KanbanOverlay';

// Custom comparison function for memoization using fast-deep-equal
const kanbanContentPropsAreEqual = (
  prevProps: KanbanContentProps,
  nextProps: KanbanContentProps
): boolean => {
  // Use deep equality for complex objects (most important checks first)
  if (!equal(prevProps.value, nextProps.value)) return false;
  if (!equal(prevProps.columns, nextProps.columns)) return false;
  
  // Use reference equality for children and onValueChange function
  // Note: We'll handle these more gracefully now
  if (prevProps.children !== nextProps.children) return false;
  if (prevProps.onValueChange !== nextProps.onValueChange) return false;
  
  return true;
};

const KanbanContentComponent = ({
  children,
  value,
  onValueChange,
  columns,
}: KanbanContentProps) => {
  const [kanbanState, setKanbanState] = useState(value);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleDragEnd = useCallback(() => {
    onValueChange(kanbanState);
  }, [onValueChange, kanbanState]);

  const handleValueChange = useCallback((
    newState: Record<string, (Task & { assignee: User | null })[]>
  ) => {
    const oldKeys = Object.keys(kanbanState);
    const newKeys = Object.keys(newState);

    const isColumnMove =
      oldKeys.length === newKeys.length &&
      oldKeys.join("") !== newKeys.join("");

    setKanbanState(newState);

    if (isColumnMove) {
      onValueChange(newState);
    }
  }, [kanbanState, onValueChange]);

  // Only update local state when value prop actually changes
  useEffect(() => {
    if (!equal(kanbanState, value)) {
      setKanbanState(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // Remove kanbanState from deps to avoid infinite loops

  // Memoize ordered columns calculation
  const orderedColumns = useMemo(() => {
    const columnMap = new Map(columns.map((c) => [c.id, c]));
    return Object.keys(kanbanState)
      .map((columnId) => {
        const column = columnMap.get(columnId);
        if (!column) return null;
        return {
          ...column,
          tasks: kanbanState[columnId],
        };
      })
      .filter(
        (c): c is Column & { tasks: (Task & { assignee: User | null })[] } =>
          c !== null
      );
  }, [columns, kanbanState]);

  // Memoize grid class calculation
  const mdClass = useMemo(() => {
    const gridClassMap: Record<number, string> = {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      5: "md:grid-cols-5",
      6: "md:grid-cols-6",
    };
    return gridClassMap[orderedColumns.length] || "grid-cols-6";
  }, [orderedColumns.length]);

  return (
    <Kanban.Root
      orientation={isDesktop ? "horizontal" : "vertical"}
      value={kanbanState}
      onValueChange={handleValueChange}
      getItemValue={(item) => item.id}
      onDragEnd={handleDragEnd}
    >
      <Kanban.Board
        className={cn(
          "flex flex-col gap-4 md:auto-rows-fr md:grid-cols-1 md:grid",
          mdClass
        )}
      >
        {orderedColumns.map((column) => (
          <BoardColumnContent key={column.id} column={column} />
        ))}
      </Kanban.Board>
      {children}
    </Kanban.Root>
  );
};

// Memoized version of KanbanContent using fast-deep-equal for comparison
const KanbanContent = memo(KanbanContentComponent, kanbanContentPropsAreEqual);
