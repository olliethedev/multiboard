import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { BoardColumnContent } from "@/components/boards/board-column-content";
import equal from "fast-deep-equal";
import * as Kanban from "@/components/ui/kanban";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { Column, Task, User } from "@zenstackhq/runtime/models";

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
KanbanOverlay.displayName = "KanbanOverlay";

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

  const handleValueChange = useCallback(
    (newState: Record<string, (Task & { assignee: User | null })[]>) => {
      const oldKeys = Object.keys(kanbanState);
      const newKeys = Object.keys(newState);

      const isColumnMove =
        oldKeys.length === newKeys.length &&
        oldKeys.join("") !== newKeys.join("");

      setKanbanState(newState);

      if (isColumnMove) {
        onValueChange(newState);
      }
    },
    [kanbanState, onValueChange]
  );

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
    return gridClassMap[orderedColumns.length] || "md:grid-cols-6";
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

KanbanContent.displayName = "KanbanContent";

export { KanbanContent, KanbanOverlay };
