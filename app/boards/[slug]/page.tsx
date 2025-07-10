import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { getZenstackPrisma } from '@/lib/db';
import { BoardContent } from '@/components/boards/board-content';

type Props = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function BoardPage(props: Props) {
    const { slug } = await props.params;
    const queryClient = getQueryClient();
    
    // Prefetch the board data on the server using enhanced Prisma client
    const db = await getZenstackPrisma();
    const boardData = await db.board.findUnique({
        where: { id: slug },
        include: {
            columns: {
                include: {
                    tasks: {
                        include: {
                            assignee: true,
                        },
                        orderBy: { order: "asc" },
                    },
                },
                orderBy: { order: "asc" },
            },
        },
    });
    
    // Store the prefetched data with a server-side key
    queryClient.setQueryData(['board-server', slug], boardData);

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <BoardContent slug={slug} initialData={boardData} />
        </HydrationBoundary>
    );
}