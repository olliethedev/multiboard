import { useMemo, useRef } from 'react'
import { useFindManyPost } from '@/hooks/model'
import { useDebounce } from '@/hooks/use-debounce'
import type { Post } from "@zenstackhq/runtime/models"

interface UsePostSearchOptions {
  query: string
  enabled?: boolean
  debounceMs?: number
}

type PostWithIncludes = Post & {
  author: { name: string } | null
  tags: Array<{ tag: { name: string } }>
}

export function usePostSearch({ query, enabled = true, debounceMs = 300 }: UsePostSearchOptions) {
  // Debounce the search query to avoid excessive API calls
  const debouncedQuery = useDebounce(query, debounceMs)
  
  // Only search if we have a query and search is enabled
  const shouldSearch = enabled && debouncedQuery.trim().length > 0
  
  // Keep track of the last successful results to prevent flickering
  const lastResultsRef = useRef<PostWithIncludes[]>([])
  
  // Create search where conditions using Prisma's text search capabilities
  const searchWhere = useMemo(() => {
    if (!shouldSearch) return undefined
    
    const searchTerm = debouncedQuery.toLowerCase().trim()
    
    return {
      published: true,
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
        {
          content: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
        {
          excerpt: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
        {
          tags: {
            some: {
              tag: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive' as const,
                },
              },
            },
          },
        },
      ],
    }
  }, [shouldSearch, debouncedQuery])

  // Use the existing ZenStack-generated hook with search parameters
  const result = useFindManyPost(
    {
      where: searchWhere,
      include: {
        author: {
          select: {
            name: true,
          },
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        publishedAt: 'desc',
      },
      take: 10, // Limit results for performance
    },
    {
      enabled: shouldSearch,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    }
  )

  // Update last results when we get fresh data
  if (result.data && result.data.length >= 0) {
    lastResultsRef.current = result.data
  }

  // Use current data if available, otherwise fall back to last results
  const dataToReturn = result.data || lastResultsRef.current

  return {
    ...result,
    data: dataToReturn,
    isSearching: result.isLoading,
    searchQuery: debouncedQuery,
  }
}