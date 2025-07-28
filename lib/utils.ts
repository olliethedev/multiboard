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
