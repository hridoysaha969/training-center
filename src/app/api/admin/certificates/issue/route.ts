import "@/models"; // registers all models

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { requireRole } from "@/lib/rbac";
import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/models/Enrollment";
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
  const enrollmentId = String(body?.enrollmentId || "").trim();

  if (!enrollmentId || !mongoose.Types.ObjectId.isValid(enrollmentId)) {
    return NextResponse.json(
      { success: false, message: "Valid enrollmentId is required" },
      { status: 400 },
    );
  }

  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    return NextResponse.json(
      { success: false, message: "Enrollment not found" },
      { status: 404 },
    );
  }

  // already issued -> never change
  if ((enrollment as any).certificateId) {
    return NextResponse.json(
      {
        success: false,
        message: "Certificate already issued for this enrollment.",
      },
      { status: 409 },
    );
  }

  // ✅ MUST be COMPLETED + PASS
  if ((enrollment as any).status !== "COMPLETED") {
    return NextResponse.json(
      { success: false, message: "Enrollment must be COMPLETED." },
      { status: 400 },
    );
  }

  if ((enrollment as any).resultStatus !== "PASS") {
    return NextResponse.json(
      { success: false, message: "Result must be PASS." },
      { status: 400 },
    );
  }

  const yy = yyNow();
  const key = `certificate:${yy}`;

  const counter = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  const certificateId = `ECITC-${yy}-${pad3(counter.seq)}`;

  (enrollment as any).certificateId = certificateId;
  (enrollment as any).certificateIssuedAt = new Date();
  (enrollment as any).certificateIssuedBy = (admin as any).id;

  await enrollment.save();

  return NextResponse.json({
    success: true,
    message: "Certificate issued successfully.",
    data: {
      enrollmentId: String(enrollment._id),
      certificateId,
      certificateIssuedAt: (enrollment as any).certificateIssuedAt,
    },
  });
}