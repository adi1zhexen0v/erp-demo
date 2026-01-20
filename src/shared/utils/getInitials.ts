export function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("");
}

