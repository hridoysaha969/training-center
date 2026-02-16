function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, 1, 0, 0, 0, 0);
}

// Returns months like ["2025-09", "2025-10", ...]
export function lastNMonthsKeys(n: number, now = new Date()) {
  const keys: string[] = [];
  const start = startOfMonth(addMonths(now, -(n - 1)));
  for (let i = 0; i < n; i++) {
    const d = addMonths(start, i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    keys.push(`${y}-${m}`);
  }
  return keys;
}

export function getMonthlyRanges(now = new Date()) {
  const thisMonthStart = startOfMonth(now);
  const nextMonthStart = addMonths(thisMonthStart, 1);
  const sixMonthsAgoStart = startOfMonth(addMonths(now, -5)); // inclusive for last 6 months
  return { thisMonthStart, nextMonthStart, sixMonthsAgoStart };
}
