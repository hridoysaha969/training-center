import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";

import { Batch } from "@/models/Batch";
import { Enrollment } from "@/models/Enrollment";
import { BATCH_SCHEDULES } from "@/lib/batchSchedules";
import { requireRole } from "@/lib/rbac";
import { connectDB } from "@/lib/mongodb";

const patchSchema = z.object({
  schedule: z.enum(BATCH_SCHEDULES).optional(),
  status: z.enum(["RUNNING", "CLOSED"]).optional(),
  endDate: z.string().optional(), // YYYY-MM-DD or "" to clear
  capacity: z.coerce.number().int().min(1).max(200).optional(),
});

function endExclusiveUTC(dateStr: string) {
  // store as UTC midnight (start of day)
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const id = (await params).id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid batch id" },
      { status: 400 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Validation failed",
        errors: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }

  await connectDB();

  const batch = await Batch.findById(id);
  if (!batch) {
    return NextResponse.json(
      { success: false, message: "Batch not found" },
      { status: 404 },
    );
  }

  // current students count (source of truth)
  const currentCount = await Enrollment.countDocuments({ batchId: batch._id });

  // parse endDate
  let newEndDate: Date | null | undefined = undefined;
  if ("endDate" in parsed.data) {
    const raw = parsed.data.endDate?.trim() ?? "";
    newEndDate = raw ? endExclusiveUTC(raw) : null; // allow clearing
  }

  const today = new Date();
  // treat "passed" as endDate < now
  const endDatePassed = (d: Date | null | undefined) =>
    !!d && d.getTime() < today.getTime();

  const targetEndDate =
    newEndDate === undefined ? (batch.endDate ?? null) : newEndDate;

  // RULE: cannot set RUNNING if endDate passed
  if (parsed.data.status === "RUNNING" && endDatePassed(targetEndDate)) {
    return NextResponse.json(
      {
        success: false,
        message: "Cannot set RUNNING because end date has passed.",
      },
      { status: 400 },
    );
  }

  // RULE: capacity cannot go below currentCount
  if (
    typeof parsed.data.capacity === "number" &&
    parsed.data.capacity < currentCount
  ) {
    return NextResponse.json(
      {
        success: false,
        message: `Capacity cannot be less than current students (${currentCount}).`,
      },
      { status: 400 },
    );
  }

  // Apply updates
  if (parsed.data.schedule) batch.schedule = parsed.data.schedule;
  if (parsed.data.status) batch.status = parsed.data.status;
  if (newEndDate !== undefined) batch.endDate = newEndDate ?? undefined;
  if (typeof parsed.data.capacity === "number")
    batch.capacity = parsed.data.capacity;

  // Recommended: auto-close if endDate passed
  if (batch.endDate && endDatePassed(batch.endDate)) {
    batch.status = "CLOSED";
  }

  await batch.save();

  return NextResponse.json({
    success: true,
    message: "Batch updated",
    data: {
      id: String(batch._id),
      name: batch.name,
      schedule: batch.schedule,
      status: batch.status,
      endDate: batch.endDate ?? null,
      capacity: batch.capacity,
      currentStudentCount: currentCount,
    },
  });
}
