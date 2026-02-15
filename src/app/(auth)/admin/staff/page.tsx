import { redirect } from "next/navigation";
import { requireRole } from "@/lib/rbac";
import StaffManagementClient from "@/components/admin/staff-management-client";

export default async function StaffPage() {
  const admin = await requireRole(["SUPER_ADMIN"]);

  if (!admin) {
    // if not logged in OR not super admin
    redirect("/admin"); // or redirect("/admin/login") if you prefer
  }

  return <StaffManagementClient />;
}
