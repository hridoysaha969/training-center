import { NextResponse } from "next/server";
import { z } from "zod";

import { Batch } from "@/models/Batch";
import { connectDB } from "@/lib/mongodb";
import { requireRole } from "@/lib/rbac";

const querySchema = z.object({
  courseId: z.string().min(1),
});

export async function GET(req: Request) {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    courseId: url.searchParams.get("courseId") ?? "",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid query" },
      { status: 400 },
    );
  }

  await connectDB();

  const { courseId } = parsed.data;

  const batches = await Batch.find({
    courseId,
    status: "RUNNING",
  })
    .sort({ createdAt: -1 })
    .select("name schedule capacity startDate endDate status")
    .lean();

  return NextResponse.json({
    success: true,
    data: batches.map((b: any) => ({
      id: String(b._id),
      name: b.name,
      schedule: b.schedule,
      capacity: b.capacity,
      startDate: b.startDate || null,
      endDate: b.endDate || null,
      status: b.status,
    })),
  });
}
