/**
 * Get next sequence number safely (atomic)
 **/

import { Counter } from "@/models/Counter";

async function getNextSequence(key: string) {
  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { value: 1 } },
    { new: true, upsert: true },
  );

  return counter.value;
}

/**
 * Generate Roll Number → YYMM + 3 digit serial
 **/

export async function generateRoll() {
  const now = new Date();

  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const key = `roll:${now.getFullYear()}-${month}`;
  const serial = await getNextSequence(key);

  return `${year}${month}${String(serial).padStart(3, "0")}`;
}

/**
 * Generate Certificate ID → ECITC-YYYY-XXX
 **/

export async function generateCertificateId() {
  const year = new Date().getFullYear();

  const key = `cert:${year}`;
  const serial = await getNextSequence(key);

  return `ECITC-${year}-${String(serial).padStart(3, "0")}`;
}
