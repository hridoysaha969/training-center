import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { connectDB } from "@/lib/mongodb";
import { Student } from "@/models/Student";
import { Counter } from "@/models/Counter";

// ECITC-26-001
function yyNow() {
  return String(new Date().getFullYear()).slice(-2);
}
function pad3(n: number) {
  return String(n).padStart(3, "0");
}

export async function POST(req: NextRequest) {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  const body = await req.json().catch(() => null);
  const roll = String(body?.roll || "").trim();

  if (!roll) {
    return NextResponse.json(
      { success: false, message: "Roll is required" },
      { status: 400 },
    );
  }

  const student = await Student.findOne({ roll });
  if (!student) {
    return NextResponse.json(
      { success: false, message: "Student not found" },
      { status: 404 },
    );
  }

  // already issued -> never change
  if (student.certificateId) {
    return NextResponse.json(
      {
        success: false,
        message: "Certificate already issued and cannot be changed.",
      },
      { status: 409 },
    );
  }

  const yy = yyNow();
  const key = `certificate:${yy}`;

  // atomic seq increment for the current year
  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  const serial = counter.seq; // 1,2,3...
  const certificateId = `ECITC-${yy}-${pad3(serial)}`;

  student.certificateId = certificateId;
  student.certificateIssuedAt = new Date();
  student.certificateIssuedBy = (admin as any).id; // your requireRole returns {id}
  await student.save();

  return NextResponse.json({
    success: true,
    message: "Certificate issued successfully.",
    data: {
      roll: student.roll,
      certificateId,
      certificateIssuedAt: student.certificateIssuedAt,
    },
  });
}
