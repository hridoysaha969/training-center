import { redirect } from "next/navigation";
import { requireRole } from "@/lib/rbac";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function StaffPage() {
  const session = await getServerSession(authOptions);
  const admin = await requireRole(["SUPER_ADMIN"]);

  if (!admin) {
    // if not logged in OR not super admin
    redirect("/admin"); // or redirect("/admin/login") if you prefer
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">Manage Staff</h1>
      <p className="text-sm text-muted-foreground">
        Only SUPER_ADMIN can access this page.
      </p>
    </div>
  );
}
