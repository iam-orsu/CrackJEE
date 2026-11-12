const IST_OFFSET_MS = 330 * 60 * 1000;

/** YYYY-MM-DD of an instant in India Standard Time (UTC+5:30, no DST). */
export function istDateKey(date: Date): string {
  return new Date(date.getTime() + IST_OFFSET_MS).toISOString().slice(0, 10);
}

/** YYYY-MM calendar month of an instant in India Standard Time (UTC+5:30). */
export function istMonthKey(date: Date): string {
  return new Date(date.getTime() + IST_OFFSET_MS).toISOString().slice(0, 7);
}
