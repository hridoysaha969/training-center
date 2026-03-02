import "../../../../../models/Course"; // just import, no variable needed

import { NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { Student } from "@/models/Student";
import { Enrollment } from "@/models/Enrollment";
import { connectDB } from "@/lib/mongodb";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ roll: string }> },
) {
  const roll = (await params).roll?.trim();
  if (!roll) {
    return NextResponse.json(
      { success: false, message: "Invalid roll" },
      { status: 400 },
    );
  }
  console.log("Fetching details for roll:", roll);

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
      enrollments: enrollments.map((e: any) => ({
        id: String(e._id),
        batchName: e.batchName,
        startDate: e.startDate,
        status: e.status,

        // ✅ new (certificate per enrollment)
        resultStatus: e.resultStatus ?? "PENDING",
        resultNote: e.resultNote ?? "",
        certificateId: e.certificateId ?? null,
        certificateIssuedAt: e.certificateIssuedAt ?? null,

        course: e.courseId
          ? {
              id: String(e.courseId._id),
              name: e.courseId.name,
              code: e.courseId.code,
              durationMonths: e.courseId.durationMonths,
              fee: e.courseId.fee,
            }
          : null,
      })),
    },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ roll: string }> },
) {
  const admin = await requireRole(["SUPER_ADMIN"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 },
    );
  }

  const { roll } = await params;
  const body = await req.json();

  await connectDB();

  // Map payload → schema fields (adjust to your schema names)
  const update = {
    fullName: body.fullName,
    dateOfBirth: body.dateOfBirth,
    gender: body.gender,
    phone: body.phone,
    email: body.email,
    presentAddress: body.presentAddress,
    nidOrBirthId: body.nidOrBirthId,
    photoUrl: body.photoUrl,

    guardian: {
      name: body.guardianName,
      relation: body.guardianRelation,
      phone: body.guardianPhone,
      occupation: body.guardianOccupation,
      address: body.guardianAddress,
    },

    academic: {
      qualification: body.qualification,
      passingYear: body.passingYear,
      instituteName: body.instituteName,
    },
  };

  const updated = await Student.findOneAndUpdate(
    { roll },
    { $set: update },
    { new: true },
  );

  if (!updated) {
    return NextResponse.json(
      { success: false, message: "Student not found" },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    message: "Student updated successfully",
  });
}
