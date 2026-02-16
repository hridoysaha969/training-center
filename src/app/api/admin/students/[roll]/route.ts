import "../../../../../models/Course"; // just import, no variable needed

import { NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { Student } from "@/models/Student";
import { Enrollment } from "@/models/Enrollment";
import { connectDB } from "@/lib/mongodb";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ roll: string }> },
) {
  //   const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);
  //   if (!admin) {
  //     return NextResponse.json(
  //       { success: false, message: "Unauthorized" },
  //       { status: 401 }
  //     );
  //   }

  const roll = (await params).roll?.trim();
  if (!roll) {
    return NextResponse.json(
      { success: false, message: "Invalid roll" },
      { status: 400 },
    );
  }

  await connectDB();

  const student = await Student.findOne({ roll }).lean();
  if (!student) {
    return NextResponse.json(
      { success: false, message: "Student not found" },
      { status: 404 },
    );
  }

  const enrollments = await Enrollment.find({ studentId: student._id })
    .populate("courseId", "name code durationMonths fee")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    success: true,
    data: {
      student: {
        id: String(student._id),
        roll: student.roll,
        fullName: student.fullName,
        dateOfBirth: student.dateOfBirth,
        nidOrBirthId: student.nidOrBirthId,
        gender: student.gender,
        phone: student.phone,
        email: student.email || "",
        presentAddress: student.presentAddress,
        photoUrl: student.photoUrl,
        admissionDate: student.admissionDate,
        certificateId: student.certificateId || null,
        certificateIssuedAt: student.certificateIssuedAt || null,
        guardian: student.guardian,
        academic: student.academic,
      },
      enrollments: enrollments.map((e) => ({
        id: String(e._id),
        batchName: e.batchName,
        startDate: e.startDate,
        status: e.status,
        course: e.courseId
          ? {
              id: String((e.courseId as any)._id),
              name: (e.courseId as any).name,
              code: (e.courseId as any).code,
              durationMonths: (e.courseId as any).durationMonths,
              fee: (e.courseId as any).fee,
            }
          : null,
      })),
    },
  });
}
