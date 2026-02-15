import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { requireRole } from "@/lib/rbac";

import { investmentSchema } from "@/lib/validators/investment";
import { Investment } from "@/models/Investment";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import mongoose from "mongoose";
import { LedgerTransaction } from "@/models/LedgerTransaction";

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

  const parsed = investmentSchema.safeParse(body);
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

  const data = parsed.data;

  await connectDB();

  // confirm password (must select +password or +passwordHash depending on your schema)
  const adminUser = await Admin.findById(admin.id).select("+password");
  if (!adminUser) {
    return NextResponse.json(
      { success: false, message: "Admin not found" },
      { status: 404 },
    );
  }

  const ok = await bcrypt.compare(data.password, adminUser.password);
  if (!ok) {
    return NextResponse.json(
      { success: false, message: "Invalid password" },
      { status: 401 },
    );
  }

  const date = new Date(data.date);

  const session = await mongoose.startSession();
  try {
    let investmentDoc: any = null;

    await session.withTransaction(async () => {
      investmentDoc = await Investment.create(
        [
          {
            title: data.title.trim(),
            amount: data.amount,
            description: data.description?.trim() || undefined,
            invoiceImageUrl: data.invoiceImageUrl?.trim() || undefined,
            date,
            createdBy: admin.id,
          },
        ],
        { session },
      ).then((arr) => arr[0]);

      await LedgerTransaction.create(
        [
          {
            type: "DEBIT",
            source: "INVESTMENT",
            amount: investmentDoc.amount,
            title: investmentDoc.title,
            note: investmentDoc.description,
            date: investmentDoc.date,
            createdBy: admin.id,
            refInvestmentId: investmentDoc._id,
          },
        ],
        { session },
      );
    });

    return NextResponse.json({
      success: true,
      message: "Investment recorded successfully",
      data: {
        id: String(investmentDoc._id),
        title: investmentDoc.title,
        amount: investmentDoc.amount,
        date: investmentDoc.date,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to record investment" },
      { status: 500 },
    );
  } finally {
    session.endSession();
  }
}
