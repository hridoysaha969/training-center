import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export type AdminRole = "SUPER_ADMIN" | "STAFF";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const role = (session.user as any).role as AdminRole | undefined;
  const id = (session.user as any).id as string | undefined;

  if (!role || !id) return null;

  return { session, role, id };
}

export async function requireRole(allowed: AdminRole[]) {
  const admin = await requireAdmin();
  if (!admin) return null;

  if (!allowed.includes(admin.role)) return null;

  return admin;
}
