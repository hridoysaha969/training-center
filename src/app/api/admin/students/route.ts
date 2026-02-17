import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { connectDB } from "@/lib/mongodb";
import { Student } from "@/models/Student";

export async function GET(req: NextRequest) {
  // role check
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  // read query params
  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") || 1));

  const limit = Math.min(
    100,
    Number(req.nextUrl.searchParams.get("limit") || 10),
  );

  const skip = (page - 1) * limit;

  // fetch data
  const [totalItems, students] = await Promise.all([
    Student.countDocuments(),
    Student.find({})
      .sort({ admissionDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      items: students,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    },
  });
}
