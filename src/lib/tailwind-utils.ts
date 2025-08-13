// Simple alternative to avoid dependency issues
export function mergeTailwindClasses(...classes: (string | undefined | null | false)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .split(' ')
    .filter((cls, index, arr) => {
      // Simple deduplication - keep last occurrence of each class
      const lastIndex = arr.lastIndexOf(cls);
      return index === lastIndex;
    })
    .join(' ');
}
