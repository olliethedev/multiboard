import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { getZenstackPrisma } from '@/lib/db';
import { BoardsList } from '@/components/boards/boards-list';

export default async function BoardsPage() {
    const queryClient = getQueryClient();
    const db = await getZenstackPrisma();
    
    // authorization automatically handled by zenstack. It also accounts for active organization
    const boardsData = await db.board.findMany({
        orderBy: { createdAt: "desc" },
    });
    
    queryClient.setQueryData(['boards-server'], boardsData);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <BoardsList initialData={boardsData} />
        </HydrationBoundary>
    );
}
