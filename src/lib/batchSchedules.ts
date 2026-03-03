export const BATCH_SCHEDULES = [
  "09:00-11:00",
  "11:00-13:00",
  "14:00-16:00",
  "16:00-18:00",
  "19:00-21:00",
] as const;

export type BatchSchedule = (typeof BATCH_SCHEDULES)[number];

export function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export function makeBatchName(courseCode: string, serial: number) {
  return `Batch-${courseCode}-${pad2(serial)}`;
}

export function makeBatchSlug(courseCode: string, serial: number) {
  return `batch-${courseCode}-${pad2(serial)}`.toLowerCase();
}
