"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrgChangeCallback } from "@/hooks/use-org-change-callback";
import type { Board } from "@zenstackhq/runtime/models";
import { useFindManyBoard } from "@/hooks/model";
import { BoardListSkeleton } from "@/components/boards/board-list-skeleton";
import { ActionHeading } from "@/components/boards/action-heading";
import { useModalQuery } from "@/lib/use-modal-query";

type Props = {
  initialData?: Board[] | null;
};

export function BoardsList({ initialData }: Props) {
  const {
    data: boards,
    refetch,
    isLoading,
    isFetching,
  } = useFindManyBoard(
    {
      orderBy: { createdAt: "desc" },
    },
    {
      initialData,
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      optimisticUpdate: true,
    }
  );

  const { openAddBoardModal } = useModalQuery();

  // Refetch boards when active org changes (but not on initial mount)
  useOrgChangeCallback(() => {
    void refetch();
  });

  return (
    <div className="container mx-auto py-8">
      <ActionHeading
        title="Boards"
        isFetching={isFetching}
        isLoading={isLoading}
      >
        <Button disabled={isLoading} onClick={openAddBoardModal}>
          <Plus className="mr-2 h-4 w-4" />
          New Board
        </Button>
      </ActionHeading>

      {isLoading ? (
        <BoardListSkeleton />
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {boards?.map((board) => (
              <Card
                key={board.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle>
                    <Link
                      href={`/boards/${board.id}`}
                      className="hover:text-primary"
                    >
                      {board.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Created {board.createdAt.toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {boards?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No boards found. Create your first board to get started!
              </p>
              <Button onClick={openAddBoardModal}>
                <Plus className="mr-2 h-4 w-4" />
                Create Board
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
