import "@/models";

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { requireRole } from "@/lib/rbac";
import { connectDB } from "@/lib/mongodb";
import { Enrollment } from "@/models/Enrollment";

import { z } from "zod";

const bodySchema = z.object({
  enrollmentId: z.string().min(1),
  resultStatus: z.enum(["PASS", "FAIL"]), // keep strict; no PENDING save
  resultNote: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  const body = await req.json().catch(() => null);
  const parsed = bodySchema.safeParse(body);

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

  const { enrollmentId, resultStatus, resultNote } = parsed.data;

  if (!mongoose.Types.ObjectId.isValid(enrollmentId)) {
    return NextResponse.json(
      { success: false, message: "Invalid enrollmentId" },
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

  // if certificate already issued -> result must not change
  if ((enrollment as any).certificateId) {
    return NextResponse.json(
      {
        success: false,
        message: "Certificate already issued. Result cannot be changed.",
      },
      { status: 409 },
    );
  }

  (enrollment as any).resultStatus = resultStatus;
  (enrollment as any).resultNote = resultNote?.trim() || "";
  (enrollment as any).status = "COMPLETED";

  (enrollment as any).resultUpdatedAt = new Date();
  (enrollment as any).resultUpdatedBy = (admin as any).id;

  await enrollment.save();

  return NextResponse.json({
    success: true,
    message: "Result updated successfully.",
    data: {
      enrollmentId: String(enrollment._id),
      status: (enrollment as any).status,
      resultStatus: (enrollment as any).resultStatus,
      resultNote: (enrollment as any).resultNote,
      resultUpdatedAt: (enrollment as any).resultUpdatedAt,
    },
  });
}
