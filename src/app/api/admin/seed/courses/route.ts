import { NextResponse } from "next/server";
import { Course } from "@/models/Course";
import { requireRole } from "@/lib/rbac";
import { connectDB } from "@/lib/mongodb";

export async function POST() {
  const admin = await requireRole(["SUPER_ADMIN"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  const courses = [
    {
      id: "advanced-office-management",
      name: "Advanced Office Management",
      code: "AOM",
      durationMonths: 6,
      fee: 5000,
    },
    {
      id: "computer-office-application-basic",
      name: "Computer & Office Application (Basic)",
      code: "COA",
      durationMonths: 3,
      fee: 3000,
    },
    {
      id: "bangla-english-typing",
      name: "Bangla & English Typing",
      code: "BET",
      durationMonths: 3,
      fee: 1500,
    },
    {
      id: "web-development-fundamentals",
      name: "Web Development Fundamentals",
      code: "WDF",
      durationMonths: 6,
      fee: 7500,
    },
    {
      id: "freelancing-ai-tools",
      name: "Freelancing & AI Tools",
      code: "FAI",
      durationMonths: 6,
      fee: 9500,
    },
  ];

  for (const c of courses) {
    await Course.updateOne(
      { code: c.code },
      { $set: { ...c, isActive: true } },
      { upsert: true },
    );
  }

  return NextResponse.json({ success: true, message: "Courses seeded" });
}
