import { Counter } from "@/models/Counter";

function pad(n: number, width: number) {
  return String(n).padStart(width, "0");
}

export function yymm(date = new Date()) {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = pad(date.getMonth() + 1, 2);
  return `${yy}${mm}`; // e.g. 2602
}

// Roll format: YYMM + 3-digit serial => 2602001
export async function generateRoll(admissionDate: Date) {
  const key = `roll:${yymm(admissionDate)}`;

  const doc = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  const serial = pad(doc.seq, 3);
  return `${yymm(admissionDate)}${serial}`;
}

// Batch counter is per course + month
export async function generateBatch(courseCode: string, admissionDate: Date) {
  const YYMM = yymm(admissionDate);
  const key = `batch:${courseCode}:${YYMM}`;

  const doc = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  // each batch holds 20 students
  const batchNo = Math.ceil(doc.seq / 20);
  const batch = pad(batchNo, 2);

  return `${courseCode}-${YYMM}-${batch}`; // BC-2602-01
}
