import { NextResponse } from "next/server";
import { requireRole } from "@/lib/rbac";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await requireRole(["SUPER_ADMIN"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Forbidden" },
      { status: 403 },
    );
  }

  const { id } = await params;

  await connectDB();

  // Prevent deleting yourself
  if (admin.id === id) {
    return NextResponse.json(
      { success: false, message: "You cannot delete your own account." },
      { status: 400 },
    );
  }

  // Prevent deleting last super admin
  const superAdminCount = await Admin.countDocuments({
    role: "SUPER_ADMIN",
  });

  const target = await Admin.findById(id);
  if (!target) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 },
    );
  }

  if (target.role === "SUPER_ADMIN" && superAdminCount <= 1) {
    return NextResponse.json(
      { success: false, message: "At least one SUPER_ADMIN must exist." },
      { status: 400 },
    );
  }

  await Admin.findByIdAndDelete(id);

  return NextResponse.json({
    success: true,
    message: "Admin user deleted",
  });
}
