import { NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { Course } from "@/models/Course";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  const courses = await Course.find({ isActive: true })
    .sort({ name: 1 })
    .select({ name: 1, code: 1, durationMonths: 1, fee: 1 });

  return NextResponse.json({
    success: true,
    data: courses.map((c) => ({
      id: String(c._id), // ✅ ObjectId string for dropdown value
      name: c.name,
      code: c.code,
      durationMonths: c.durationMonths,
      fee: c.fee,
    })),
  });
}
