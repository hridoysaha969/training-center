import { NextResponse } from "next/server";
import { z } from "zod";

import { Batch } from "@/models/Batch";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";

import { createBatchSchema } from "@/lib/validators/batch";
import { makeBatchName, makeBatchSlug } from "@/lib/batchSchedules";
import { connectDB } from "@/lib/mongodb";
import { requireRole } from "@/lib/rbac";

// For list query
const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),

  q: z.string().optional(), // search by name
  status: z.enum(["RUNNING", "CLOSED"]).optional(),
  courseId: z.string().optional(),

  from: z.string().optional(), // YYYY-MM-DD (startDate)
  to: z.string().optional(), // YYYY-MM-DD (startDate)
});

function startOfDayUTC(s: string) {
  return new Date(`${s}T00:00:00.000Z`);
}
function endExclusiveUTC(s: string) {
  const d = new Date(`${s}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d;
}

export async function POST(req: Request) {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = createBatchSchema.safeParse(body);
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

  const data = parsed.data;

  const course = await Course.findById(data.courseId).lean();
  if (!course || !course.isActive) {
    return NextResponse.json(
      { success: false, message: "Invalid or inactive course" },
      { status: 400 },
    );
  }

  const courseCode = String((course as any).code || "").trim();
  if (!courseCode) {
    return NextResponse.json(
      { success: false, message: "Course code missing. Add code to course." },
      { status: 400 },
    );
  }

  const name = makeBatchName(courseCode, data.serial);
  const slug = makeBatchSlug(courseCode, data.serial);

  // soft check (nice UX) + DB unique index (true protection)
  const exists = await Batch.exists({ slug });
  if (exists) {
    return NextResponse.json(
      { success: false, message: "Batch already exists" },
      { status: 409 },
    );
  }

  const startDate = data.startDate
    ? new Date(`${data.startDate}T00:00:00.000Z`)
    : undefined;
  const endDate = data.endDate
    ? new Date(`${data.endDate}T00:00:00.000Z`)
    : undefined;

  if (startDate && endDate && endDate < startDate) {
    return NextResponse.json(
      { success: false, message: "End date cannot be before start date" },
      { status: 422 },
    );
  }

  try {
    const batch = await Batch.create({
      courseId: course._id,
      courseCode,
      serial: data.serial,
      name,
      slug,
      schedule: data.schedule,
      startDate,
      endDate,
      capacity: data.capacity ?? 20,
      status: "RUNNING",
      createdBy: admin.id,
    });

    return NextResponse.json({
      success: true,
      message: "Batch created",
      data: {
        id: String(batch._id),
        name: batch.name,
        schedule: batch.schedule,
        status: batch.status,
        capacity: batch.capacity,
      },
    });
  } catch (e: any) {
    // if two admins create same batch simultaneously
    if (e?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Batch already exists" },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create batch" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  const admin = await requireRole(["SUPER_ADMIN", "STAFF"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const parsed = listQuerySchema.safeParse({
    page: url.searchParams.get("page") ?? undefined,
    limit: url.searchParams.get("limit") ?? undefined,
    q: url.searchParams.get("q") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    courseId: url.searchParams.get("courseId") ?? undefined,
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid query",
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  await connectDB();

  const { page, limit, q, status, courseId, from, to } = parsed.data;
  const filter: Record<string, any> = {};

  if (status) filter.status = status;
  if (courseId) filter.courseId = courseId;

  if (q?.trim()) {
    filter.name = { $regex: q.trim(), $options: "i" };
  }

  // date wise filter (by startDate)
  if (from || to) {
    filter.startDate = {};
    if (from) filter.startDate.$gte = startOfDayUTC(from);
    if (to) filter.startDate.$lt = endExclusiveUTC(to);
  }

  const skip = (page - 1) * limit;

  const [totalItems, batches] = await Promise.all([
    Batch.countDocuments(filter),
    Batch.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("courseId", "name code durationMonths fee")
      .lean(),
  ]);

  // student count per batch (based on enrollment batchName for now)
  const batchNames = batches.map((b: any) => b.name);
  const countsAgg = await Enrollment.aggregate([
    { $match: { batchName: { $in: batchNames } } },
    { $group: { _id: "$batchName", count: { $sum: 1 } } },
  ]);

  const countMap = new Map<string, number>(
    countsAgg.map((x) => [x._id as string, x.count as number]),
  );

  const items = batches.map((b: any) => ({
    id: String(b._id),
    name: b.name,
    schedule: b.schedule,
    status: b.status,
    capacity: b.capacity,
    startDate: b.startDate || null,
    endDate: b.endDate || null,
    course: b.courseId
      ? {
          id: String(b.courseId._id),
          name: b.courseId.name,
          code: b.courseId.code,
        }
      : null,
    studentCount: countMap.get(b.name) ?? 0,
  }));

  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return NextResponse.json({
    success: true,
    data: {
      items,
      pagination: { page, limit, totalItems, totalPages },
    },
  });
}
