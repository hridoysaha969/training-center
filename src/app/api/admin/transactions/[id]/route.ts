import "@/models/Admin";
import "@/models/Student";
import "@/models/Enrollment";
import "@/models/Investment";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireRole } from "@/lib/rbac";
import { connectDB } from "@/lib/mongodb";
import { LedgerTransaction } from "@/models/LedgerTransaction";
import { Investment } from "@/models/Investment";
import { Student } from "@/models/Student";
import { Enrollment } from "@/models/Enrollment";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params; // ✅ correct
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid transaction id" },
      { status: 400 },
    );
  }

  // IMPORTANT:
  // In your LedgerTransaction schema you used ref: "Admin"
  // So populate model name should be "Admin" (not AdminUser)
  const tx = await LedgerTransaction.findById(id)
    .populate("createdBy", "name email role")
    .populate("refStudentId", "roll fullName phone")
    .populate(
      "refEnrollmentId",
      "batchName startDate status courseId studentId",
    )
    .populate(
      "refInvestmentId",
      "title amount description invoiceImageUrl date",
    )
    .lean();

  if (!tx) {
    return NextResponse.json(
      { success: false, message: "Transaction not found" },
      { status: 404 },
    );
  }

  // Normalize a common shape for the UI
  const invoiceImageUrl = (tx as any).refInvestmentId?.invoiceImageUrl || null;

  return NextResponse.json({
    success: true,
    data: {
      id: String((tx as any)._id),
      type: (tx as any).type,
      source: (tx as any).source,

      title: (tx as any).title,
      note: (tx as any).note || "",
      amount: Number((tx as any).amount || 0),
      date: (tx as any).date,

      createdBy: (tx as any).createdBy
        ? {
            id: String((tx as any).createdBy._id),
            name: (tx as any).createdBy.name,
            email: (tx as any).createdBy.email,
            role: (tx as any).createdBy.role,
          }
        : null,

      invoiceImageUrl,

      // optional related entities (UI can show when available)
      student: (tx as any).refStudentId
        ? {
            id: String((tx as any).refStudentId._id),
            roll: (tx as any).refStudentId.roll,
            fullName: (tx as any).refStudentId.fullName,
            phone: (tx as any).refStudentId.phone,
          }
        : null,

      enrollment: (tx as any).refEnrollmentId
        ? {
            id: String((tx as any).refEnrollmentId._id),
            batchName: (tx as any).refEnrollmentId.batchName,
            startDate: (tx as any).refEnrollmentId.startDate,
            status: (tx as any).refEnrollmentId.status,
          }
        : null,

      investment: (tx as any).refInvestmentId
        ? {
            id: String((tx as any).refInvestmentId._id),
            title: (tx as any).refInvestmentId.title,
            amount: Number((tx as any).refInvestmentId.amount || 0),
            description: (tx as any).refInvestmentId.description || "",
            date: (tx as any).refInvestmentId.date,
            invoiceImageUrl:
              (tx as any).refInvestmentId.invoiceImageUrl || null,
          }
        : null,
    },
  });
}
