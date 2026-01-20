export function buildYearRange(year: number): { start_date: string; end_date: string } {
  return {
    start_date: `${year}-01-01`,
    end_date: `${year}-12-31`,
  };
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

