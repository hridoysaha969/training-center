import { generateRoll } from "@/lib/generators";
import { connectDB } from "@/lib/mongodb";
import { requireRole } from "@/lib/rbac";
import { admissionSchema } from "@/lib/validators/admission";
import { Batch } from "@/models/Batch";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import { LedgerTransaction } from "@/models/LedgerTransaction";
import { Student } from "@/models/Student";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

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

  const parsed = admissionSchema.safeParse(body);
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

  // Server-side duplicate guard
  const duplicate = await Student.exists({
    nidOrBirthId: data.nidOrBirthId.trim(),
  });
  if (duplicate) {
    return NextResponse.json(
      { success: false, message: "Duplicate NID/Birth ID found" },
      { status: 409 },
    );
  }

  const course = await Course.findById(data.courseId);
  if (!course || !course.isActive) {
    return NextResponse.json(
      { success: false, message: "Invalid or inactive course" },
      { status: 400 },
    );
  }

  const batch = await Batch.findById(data.batchId);
  if (!batch) {
    return NextResponse.json(
      { success: false, message: "Batch not found" },
      { status: 404 },
    );
  }

  // auto-close if endDate is passed
  if (
    batch?.endDate &&
    new Date() > batch.endDate &&
    batch.status !== "CLOSED"
  ) {
    batch.status = "CLOSED";
    await batch.save();
  }

  if (String(batch.courseId) !== String(course._id)) {
    return NextResponse.json(
      { success: false, message: "Selected batch does not match the course" },
      { status: 400 },
    );
  }

  if (batch.status !== "RUNNING") {
    return NextResponse.json(
      {
        success: false,
        message: "This batch is closed. Please select a running batch.",
      },
      { status: 400 },
    );
  }

  const admissionDate = new Date();

  const session = await mongoose.startSession();
  try {
    let studentDoc: any = null;
    let enrollmentDoc: any = null;

    await session.withTransaction(async () => {
      const roll = await generateRoll(admissionDate);

      // Create student
      studentDoc = await Student.create(
        [
          {
            roll,
            fullName: data.fullName.trim(),
            dateOfBirth: new Date(data.dateOfBirth),
            nidOrBirthId: data.nidOrBirthId.trim(),
            gender: data.gender,
            phone: data.phone.trim(),
            email: data.email?.trim() || undefined,
            presentAddress: data.presentAddress.trim(),
            photoUrl: data.photoUrl.trim(),

            guardian: {
              name: data.guardianName.trim(),
              relation: data.guardianRelation.trim(),
              phone: data.guardianPhone.trim(),
              occupation: data.guardianOccupation.trim(),
              address: data.guardianAddress.trim(),
            },

            academic: {
              qualification: data.qualification.trim(),
              passingYear: data.passingYear.trim(),
              instituteName: data.instituteName.trim(),
            },

            admissionDate,
            createdBy: admin.id,
          },
        ],
        { session },
      ).then((arr) => arr[0]);

      // capacity check inside transaction (safer)
      const currentCount = await Enrollment.countDocuments({
        batchId: batch._id,
      }).session(session);
      if (currentCount >= (batch.capacity || 20)) {
        // Throw to abort transaction
        throw Object.assign(new Error("BATCH_FULL"), { code: "BATCH_FULL" });
      }

      // Create enrollment
      enrollmentDoc = await Enrollment.create(
        [
          {
            studentId: studentDoc._id,
            courseId: course._id,
            batchId: batch._id,
            batchName: batch.name,
            startDate: admissionDate,
            status: "RUNNING",
            createdBy: admin.id,
          },
        ],
        { session },
      ).then((arr) => arr[0]);

      // Create ledger CREDIT (cash in)
      await LedgerTransaction.create(
        [
          {
            type: "CREDIT",
            source: "ADMISSION",
            amount: course.fee,
            title: `Admission fee - ${course.name}`,
            date: admissionDate,
            createdBy: admin.id,
            refStudentId: studentDoc._id,
            refEnrollmentId: enrollmentDoc._id,
          },
        ],
        { session },
      );
    });

    return NextResponse.json({
      success: true,
      message: "Admission created",
      data: {
        roll: studentDoc.roll,
        studentId: String(studentDoc._id),
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
    // common: duplicate key due to race
    if (e?.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Duplicate detected. Try again." },
        { status: 409 },
      );
    }

    if (e?.code === "BATCH_FULL" || e?.message === "BATCH_FULL") {
      return NextResponse.json(
        {
          success: false,
          message: "Batch is full. Please select another batch.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create admission" },
      { status: 500 },
    );
  } finally {
    session.endSession();
  }
}
