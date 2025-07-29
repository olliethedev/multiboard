"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { SearchModal, SearchResult } from "./search-modal"
import { usePostSearch } from "@/hooks/use-post-search"
import { HighlightText } from "@/components/posts/text-highlight"
import { stripHtml, stripMarkdown } from "@/lib/utils"

// Simplified blog post search result interface
interface BlogPostSearchResult extends SearchResult {
  slug: string
  publishedAt?: Date | null
  authorName?: string
  processedContent: string
}

interface BlogSearchProps {
  className?: string
  triggerClassName?: string
  placeholder?: string
  buttonText?: string
}

// Move render function outside component since it has no dependencies
const renderBlogResult = (item: BlogPostSearchResult, index: number, query: string) => (
  <div
    key={item.id}
    className="flex flex-col gap-2 px-4 py-3 cursor-pointer hover:bg-accent rounded-sm transition-colors border-b border-border"
    onClick={() => item.onClick?.()}
  >
    <div className="flex items-start justify-between gap-2">
      <HighlightText 
        text={item.title}
        searchQuery={query}
        className="font-medium text-sm leading-5 flex-1"
      />
      {item.publishedAt && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {new Date(item.publishedAt).toLocaleDateString()}
        </span>
      )}
    </div>
    
    <HighlightText 
      text={item.processedContent}
      searchQuery={query}
      className="text-xs text-muted-foreground leading-4"
      maxLength={120}
    />
  </div>
)

export function BlogSearch({
  className,
  triggerClassName,
  placeholder = "Search blog posts...",
  buttonText = "Search Posts",
}: BlogSearchProps) {
  const router = useRouter()
  const [currentQuery, setCurrentQuery] = React.useState("")

  const { data: searchResults = [], isLoading } = usePostSearch({
    query: currentQuery,
    enabled: true,
    debounceMs: 300,
  })

  const formattedResults: BlogPostSearchResult[] = React.useMemo(() => {
    return searchResults.map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      publishedAt: post.publishedAt,
      authorName: post.author?.name,
      processedContent: stripMarkdown(stripHtml(post.content || "")),
      onClick: () => router.push(`/posts/${post.slug}`),
    }))
  }, [searchResults, router])

  // Search function that updates our query state
  const handleSearch = React.useCallback((query: string): BlogPostSearchResult[] => {
    setCurrentQuery(query)
    return [] // Return empty since we use external async results
  }, [])

  return (
    <SearchModal<BlogPostSearchResult>
      placeholder={placeholder}
      buttonText={buttonText}
      emptyMessage="No blog posts found."
      searchFn={handleSearch}
      renderResult={renderBlogResult}
      results={formattedResults}
      isLoading={isLoading}
      className={className}
      triggerClassName={triggerClassName}
      keyboardShortcut="⌘⇧P"
    />
  )
}

export default BlogSearch