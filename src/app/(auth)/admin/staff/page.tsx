import { redirect } from "next/navigation";
import { requireRole } from "@/lib/rbac";
import StaffManagementClient from "@/components/admin/staff-management-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Management | Admin | Excel Computer & IT Center",
  description: "Manage staff accounts and roles.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};


export default async function StaffPage() {
  const admin = await requireRole(["SUPER_ADMIN"]);

  if (!admin) {
    // if not logged in OR not super admin
    redirect("/admin"); // or redirect("/admin/login") if you prefer
  }

  return <StaffManagementClient />;
}
