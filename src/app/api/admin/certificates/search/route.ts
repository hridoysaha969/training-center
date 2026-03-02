import "@/models"; // registers all models

import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { connectDB } from "@/lib/mongodb";
import { Student } from "@/models/Student";
import { Enrollment } from "@/models/Enrollment";

export async function GET(req: NextRequest) {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  const roll = (req.nextUrl.searchParams.get("roll") || "").trim();
  if (!roll) {
    return NextResponse.json(
      { success: false, message: "Roll is required" },
      { status: 400 },
    );
  }

  try {
    const student = await Student.findOne({ roll }).lean();
    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 },
      );
    }

    const enrollments = await Enrollment.find({
      studentId: (student as any)._id,
    })
      .sort({ createdAt: -1 })
      .populate("courseId", "name code fee")
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        student,
        enrollments: enrollments.map((e: any) => ({
          id: String(e._id),
          batchName: e.batchName,
          startDate: e.startDate,
          status: e.status, // RUNNING | COMPLETED

          // result fields
          resultStatus: e.resultStatus ?? "PENDING",
          resultNote: e.resultNote ?? "",

          // certificate fields (new)
          certificateId: e.certificateId ?? null,
          certificateIssuedAt: e.certificateIssuedAt ?? null,

          course: e.courseId
            ? {
                id: String(e.courseId._id),
                name: e.courseId.name,
                code: e.courseId.code,
                fee: e.courseId.fee,
              }
            : null,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Server error: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 },
    );
  }
}
