import { NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export async function GET() {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  // Using Mongo aggregate so it's fast even with big data
  const [agg] = await Admin.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        superAdmin: {
          $sum: { $cond: [{ $eq: ["$role", "SUPER_ADMIN"] }, 1, 0] },
        },
        admin: { $sum: { $cond: [{ $eq: ["$role", "ADMIN"] }, 1, 0] } },
        staff: { $sum: { $cond: [{ $eq: ["$role", "STAFF"] }, 1, 0] } },
        active: { $sum: { $cond: ["$isActive", 1, 0] } },
        inactive: { $sum: { $cond: ["$isActive", 0, 1] } },
      },
    },
    {
      $project: {
        _id: 0,
        total: 1,
        superAdmin: 1,
        admin: 1,
        staff: 1,
        active: 1,
        inactive: 1,
      },
    },
  ]);

  return NextResponse.json({
    success: true,
    data: agg ?? {
      total: 0,
      superAdmin: 0,
      admin: 0,
      staff: 0,
      active: 0,
      inactive: 0,
    },
  });
}
