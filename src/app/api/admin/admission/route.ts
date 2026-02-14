import { generateBatch, generateRoll } from "@/lib/generators";
import { connectDB } from "@/lib/mongodb";
import { requireRole } from "@/lib/rbac";
import { admissionSchema } from "@/lib/validators/admission";
import { Course } from "@/models/Course";
import { Enrollment } from "@/models/Enrollment";
import { Student } from "@/models/Student";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const admin = await requireRole(["SUPER_ADMIN", "STAFF"]);
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

  // Duplicate check (server-side)
  const exists = await Student.exists({
    nidOrBirthId: data.nidOrBirthId.trim(),
  });
  if (exists) {
    return NextResponse.json(
      { success: false, message: "Duplicate NID/Birth ID found" },
      { status: 409 },
    );
  }

  // Load course from DB (source of truth)
  const course = await Course.findById(data.courseId);
  if (!course || !course.isActive) {
    return NextResponse.json(
      { success: false, message: "Invalid or inactive course" },
      { status: 400 },
    );
  }

  const admissionDate = new Date(); // server sets this, not client
  const roll = await generateRoll(admissionDate);
  const batchName = await generateBatch(course.code, admissionDate);

  // create student + enrollment
  const student = await Student.create({
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
  });

  await Enrollment.create({
    studentId: student._id,
    courseId: course._id,
    batchName,
    startDate: admissionDate,
    status: "RUNNING",
    createdBy: admin.id,
  });

  return NextResponse.json({
    success: true,
    message: "Admission created",
    data: {
      roll: student.roll,
      studentId: String(student._id),
      batchName,
      course: {
        id: String(course._id),
        name: course.name,
        code: course.code,
        fee: course.fee,
      },
    },
  });
}
