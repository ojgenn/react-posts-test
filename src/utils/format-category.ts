export function formatCategoryLabel(category: string): string {
  if (!category) return ''
  const withSpaces = category.replace(/-/g, ' ')
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1)
}
