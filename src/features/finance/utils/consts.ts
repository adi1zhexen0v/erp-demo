export const SECTION_COLORS_LIGHT: Record<string, string> = {
  admin: "#f17c8d",
  mto: "#5fa2fd",
  direct: "#6bd8a2",
};

export const SECTION_COLORS_DARK: Record<string, string> = {
  admin: "#a52232",
  mto: "#0446a8",
  direct: "#118551",
};

export function getSectionColor(sectionId: string, isDark: boolean): string {
  const colors = isDark ? SECTION_COLORS_DARK : SECTION_COLORS_LIGHT;
  return colors[sectionId] || "#6B7280";
}

