function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function getPeriodDates(year: number, month: number | null): { start_date: string; end_date: string } {
  if (month) {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0);
    
    return {
      start_date: formatDate(start),
      end_date: formatDate(end),
    };
  } else {
    return {
      start_date: `${year}-01-01`,
      end_date: `${year}-12-31`,
    };
  }
}
