"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from "@/components/ui/command"

export interface SearchResult {
  id: string
  title: string
  subtitle?: string
  content?: string
  onClick?: () => void
}

export interface SearchModalProps<T = SearchResult> {
  placeholder?: string
  emptyMessage?: string
  buttonText?: string
  keyboardShortcut?: string
  searchFn: (query: string) => T[]
  renderResult: (item: T, index: number, query: string) => React.ReactNode
  results?: T[]
  isLoading?: boolean
  groupTitle?: string
  className?: string
  triggerClassName?: string
}

export function SearchModal<T extends SearchResult>({
  placeholder = "Type to search...",
  emptyMessage = "No results found.",
  buttonText = "Search",
  keyboardShortcut = "⌘K",
  searchFn,
  renderResult,
  results: externalResults,
  isLoading = false,
  className,
  triggerClassName,
}: SearchModalProps<T>) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<T[]>([])
  
  // Debounce the search query to avoid excessive calls
  const debouncedQuery = useDebounce(query, 300)

  // Handle keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    if (!open) {
      setQuery("")
      setResults([])
      return
    }

    // Don't clear results when query becomes empty - keep showing previous results
    // Only clear them when the modal is first opened or closed
    if (!debouncedQuery.trim()) {
      return
    }

    // Always call searchFn to notify parent component of the search query
    const searchResults = searchFn(debouncedQuery)
    
    // If external results are provided, use them; otherwise use searchFn results
    if (externalResults !== undefined) {
      setResults(externalResults)
    } else {
      setResults(searchResults)
    }
  }, [debouncedQuery, open, searchFn, externalResults])

  // Base button classes for better readability
  const buttonClasses = [
    "border-input bg-background text-foreground",
    "placeholder:text-muted-foreground/70",
    "focus-visible:border-ring focus-visible:ring-ring/50",
    "inline-flex h-9 w-fit rounded-md border px-3 py-2 text-sm",
    "shadow-xs transition-[color,box-shadow] outline-none",
    "focus-visible:ring-[3px]",
    triggerClassName
  ].filter(Boolean).join(" ")

  // Determine what to show based on state
  const showEmpty = debouncedQuery && !isLoading && results.length === 0
  const currentEmptyMessage = isLoading ? "Searching..." : emptyMessage

  return (
    <>
      <button
        className={buttonClasses}
        onClick={() => setOpen(true)}
      >
        <span className="flex grow items-center">
          <SearchIcon
            className="text-muted-foreground/80 -ms-1 me-3"
            size={16}
            aria-hidden="true"
          />
          <span className="text-muted-foreground/70 font-normal">{buttonText}</span>
        </span>
        {keyboardShortcut && (
          <kbd className="bg-background text-muted-foreground/70 ms-12 -me-1 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
            {keyboardShortcut}
          </kbd>
        )}
      </button>
      <CommandDialog open={open} onOpenChange={setOpen} className={className}>
        <CommandInput 
          placeholder={placeholder} 
          value={query}
          onValueChange={setQuery}
        />
        <CommandList className="max-h-[400px]">
          {showEmpty && (
            <CommandEmpty>{currentEmptyMessage}</CommandEmpty>
          )}
          
          {results.length > 0 && (
            results.map((item, index) =>
              renderResult(item, index, debouncedQuery)
            )
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default SearchModal
