import { BoardSkeleton } from "@/components/boards/board-skeleton";
import { Skeleton } from "@/components/ui/skeleton";


export default function Loading() {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-24" />
        </div>
        <BoardSkeleton />
      </div>
    );
  }