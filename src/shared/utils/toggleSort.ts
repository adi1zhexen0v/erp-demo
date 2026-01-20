export interface SortConfig<T extends string = string> {
  key: T;
  direction: "asc" | "desc";
}

export function toggleSort<T extends string>(
  currentSort: SortConfig<T> | null,
  newKey: T
): SortConfig<T> {
  if (currentSort?.key === newKey) {
    return { key: newKey, direction: currentSort.direction === "asc" ? "desc" : "asc" };
  }
  return { key: newKey, direction: "asc" };
}

