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

    // latest enrollment for this student (for result + course context)
    const enrollment = await Enrollment.findOne({ studentId: student._id })
      .sort({ createdAt: -1 })
      .populate("courseId", "title name fee") // adjust fields to your Course schema
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        student,
        enrollment: enrollment
          ? {
              _id: String((enrollment as any)._id),
              batchName: (enrollment as any).batchName,
              startDate: (enrollment as any).startDate,
              status: (enrollment as any).status,
              resultStatus: (enrollment as any).resultStatus,
              resultNote: (enrollment as any).resultNote || "",
              course: (enrollment as any).courseId
                ? {
                    _id: String((enrollment as any).courseId._id),
                    name:
                      (enrollment as any).courseId.title ||
                      (enrollment as any).courseId.name ||
                      "Course",
                    fee:
                      (enrollment as any).courseId.fee ??
                      (enrollment as any).courseId.price ??
                      null,
                  }
                : null,
            }
          : null,
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
