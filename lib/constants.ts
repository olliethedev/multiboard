export const FIND_UNIQUE_BOARD =
    (boardId: string) => ({
        where: { id: boardId },
        include: {
            columns: {
                include: {
                    tasks: {
                        include: {
                            assignee: true,
                        },
                        orderBy: { order: "asc" as const },
                    },
                },
                orderBy: { order: "asc" as const },
            },
        },
    });
