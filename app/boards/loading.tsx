import { BoardListSkeleton } from "@/components/boards/board-list-skeleton";
import { Skeleton } from "@/components/ui/skeleton";


export default function Loading() {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <BoardListSkeleton />
      </div>
    );
  }