import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { connectDB } from "@/lib/mongodb";
import { LedgerTransaction } from "@/models/LedgerTransaction";

export async function GET(req: NextRequest) {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  const page = Math.max(1, Number(req.nextUrl.searchParams.get("page") || 1));

  const limit = Math.min(
    100,
    Number(req.nextUrl.searchParams.get("limit") || 10),
  );

  const skip = (page - 1) * limit;

  const [totalItems, items] = await Promise.all([
    LedgerTransaction.countDocuments(),
    LedgerTransaction.find({})
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
    },
  });
}
