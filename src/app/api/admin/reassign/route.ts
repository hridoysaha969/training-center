import { connectDB } from "@/lib/mongodb";
import { requireRole } from "@/lib/rbac";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import { LedgerTransaction } from "@/models/LedgerTransaction";
import { Student } from "@/models/Student";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z } from "zod";

const reassignSchema = z.object({
  roll: z.string().min(1),
  courseId: z.string().min(1),
});

export async function POST(req: Request) {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON" },
      { status: 400 },
    );
  }

  const parsed = reassignSchema.safeParse(body);
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

  const { roll, courseId } = parsed.data;

  const student = await Student.findOne({ roll: roll.trim() });
  if (!student) {
    return NextResponse.json(
      { success: false, message: "Student not found" },
      { status: 404 },
    );
  }

  const course = await Course.findById(courseId);
  if (!course || !course.isActive) {
    return NextResponse.json(
      { success: false, message: "Invalid or inactive course" },
      { status: 400 },
    );
  }

  // prevent duplicate enrollment for same course (your schema index will also enforce)
  const exists = await Enrollment.exists({
    studentId: student._id,
    courseId: course._id,
  });
  if (exists) {
    return NextResponse.json(
      { success: false, message: "Student already enrolled in this course" },
      { status: 409 },
    );
  }

  const now = new Date();

  const session = await mongoose.startSession();
  try {
    let enrollmentDoc: any = null;

    await session.withTransaction(async () => {
      // simple batch name: reuse your generator if you want
      // if you have generateBatch(course.code, now) use it here
      const batchName = `${course.code}-${String(now.getFullYear()).slice(-2)}${String(
        now.getMonth() + 1,
      ).padStart(2, "0")}-01`;

      enrollmentDoc = await Enrollment.create(
        [
          {
            studentId: student._id,
            courseId: course._id,
            batchName,
            startDate: now,
            status: "RUNNING",
            createdBy: admin.id,
          },
        ],
        { session },
      ).then((arr) => arr[0]);

      await LedgerTransaction.create(
        [
          {
            type: "CREDIT",
            source: "ADMISSION",
            amount: course.fee,
            title: `Admission fee - ${course.name}`,
            date: now,
            createdBy: admin.id,
            refStudentId: student._id,
            refEnrollmentId: enrollmentDoc._id,
          },
        ],
        { session },
      );
    });

    return NextResponse.json({
      success: true,
      message: "Student reassigned successfully",
      data: {
        roll: student.roll,
        studentId: String(student._id),
        enrollmentId: String(enrollmentDoc._id),
        batchName: enrollmentDoc.batchName,
        course: {
          id: String(course._id),
          name: course.name,
          code: course.code,
          fee: course.fee,
        },
      },
    });
  } catch (e: any) {
    if (e?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicate detected. Student may already be enrolled.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to reassign student" },
      { status: 500 },
    );
  } finally {
    session.endSession();
  }
}
