import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Converts a string to a URL-friendly slug
 * @param text - The text to slugify
 * @returns A URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Converts a slug back to a readable string
 * @param slug - The slug to deslugify
 * @returns A readable string with proper capitalization
 */
export function deslugify(slug: string): string {
  return slug
    .replace(/-/g, ' ') // Replace hyphens with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
}

/**
 * Formats a tag name to be pretty and readable
 * @param tagName - The tag name to format (can be slug or regular text)
 * @returns A properly formatted tag name
 */
export function prettifyTagName(tagName: string): string {
  // If it looks like a slug (contains hyphens), deslugify it
  if (tagName.includes('-')) {
    return deslugify(tagName);
  }
  
  // Otherwise, just capitalize the first letter of each word
  return tagName
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Strips HTML tags from a string and decodes HTML entities
 * @param html - The HTML string to strip
 * @returns Plain text with HTML tags removed
 */
export function stripHtml(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, '');
  
  // Decode common HTML entities
  text = text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '...');
  
  // Clean up extra whitespace and newlines
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Strips markdown formatting from a string
 * @param markdown - The markdown string to strip
 * @returns Plain text with markdown formatting removed
 */
export function stripMarkdown(markdown: string): string {
  let text = markdown;
  
  // Remove headers (# ## ### etc.)
  text = text.replace(/^#{1,6}\s+/gm, '');
  
  // Remove bold and italic (**text**, *text*, __text__, _text_)
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1');
  text = text.replace(/\*([^*]+)\*/g, '$1');
  text = text.replace(/__([^_]+)__/g, '$1');
  text = text.replace(/_([^_]+)_/g, '$1');
  
  // Remove strikethrough (~~text~~)
  text = text.replace(/~~([^~]+)~~/g, '$1');
  
  // Remove inline code (`code`)
  text = text.replace(/`([^`]+)`/g, '$1');
  
  // Remove code blocks (```code```)
  text = text.replace(/```[\s\S]*?```/g, '');
  
  // Remove links [text](url) -> text
  text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Remove images ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');
  
  // Remove blockquotes (> text)
  text = text.replace(/^>\s+/gm, '');
  
  // Remove horizontal rules (--- or ***)
  text = text.replace(/^[-*]{3,}$/gm, '');
  
  // Remove list markers (- * + and numbered lists)
  text = text.replace(/^[\s]*[-*+]\s+/gm, '');
  text = text.replace(/^[\s]*\d+\.\s+/gm, '');
  
  // Clean up extra whitespace and newlines
  return text.replace(/\n\s*\n/g, '\n').replace(/\s+/g, ' ').trim();
}
