import { connectDB } from "@/lib/mongodb";
import { requireRole } from "@/lib/rbac";
import { Student } from "@/models/Student";
import { NextResponse } from "next/server";
import z from "zod";

const querySchema = z.object({
  n: z.string().min(6),
});

export async function GET(req: Request) {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);

  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({ n: url.searchParams.get("n") });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid query" },
      { status: 400 },
    );
  }

  await connectDB();

  const nid = parsed.data.n.trim();
  const exists = await Student.exists({ nidOrBirthId: nid });

  return NextResponse.json({ success: true, exists: !!exists });
}
