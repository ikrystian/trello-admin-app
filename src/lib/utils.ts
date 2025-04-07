import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a unique ID for HTML elements
 * @param componentName - The name of the component
 * @param elementType - The type of element (e.g., button, div, span)
 * @param identifier - Optional unique identifier (e.g., item ID)
 * @returns A unique ID string
 */
export function generateId(componentName: string, elementType: string, identifier?: string): string {
  const base = `${componentName.toLowerCase()}-${elementType.toLowerCase()}`;
  if (identifier) {
    return `${base}-${identifier}`;
  }
  return `${base}-${Math.random().toString(36).substring(2, 9)}`;
}
