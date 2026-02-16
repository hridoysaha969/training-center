import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { requireRole } from "@/lib/rbac";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

import {
  adminListQuerySchema,
  createAdminSchema,
} from "@/lib/validators/admin";

// Helper: escape regex special chars to avoid regex injection/perf issues
function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// -------------------- GET /api/admins --------------------
export async function GET(req: Request) {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const url = new URL(req.url);
  const raw = Object.fromEntries(url.searchParams.entries());

  const parsed = adminListQuerySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid query",
        errors: parsed.error.flatten(),
      },
      { status: 422 },
    );
  }

  const { search, role, page, limit } = parsed.data;

  await connectDB();

  const filter: Record<string, any> = {};
  if (role) filter.role = role;

  if (search) {
    const s = escapeRegex(search);
    filter.$or = [
      { name: { $regex: s, $options: "i" } },
      { email: { $regex: s, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Admin.find(filter)
      .select("name email role isActive createdAt updatedAt") // password is select:false anyway
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Admin.countDocuments(filter),
  ]);

  return NextResponse.json({
    success: true,
    data: items.map((x) => ({ ...x, _id: String(x._id) })),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}

// -------------------- POST /api/admins --------------------
export async function POST(req: Request) {
  // Who can create?
  // - SUPER_ADMIN can create any role
  // - ADMIN can create STAFF only (recommended)
  const creator = await requireRole(["SUPER_ADMIN"]);
  if (!creator) {
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

  const parsed = createAdminSchema.safeParse(body);
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

  // Enforce role creation policy
  if (creator.role === "ADMIN" && data.role !== "STAFF") {
    return NextResponse.json(
      { success: false, message: "Admins can only create STAFF accounts" },
      { status: 403 },
    );
  }

  await connectDB();

  const email = data.email.trim().toLowerCase();

  const existing = await Admin.findOne({ email }).select("_id").lean();
  if (existing) {
    return NextResponse.json(
      { success: false, message: "Email already exists" },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const created = await Admin.create({
    name: data.name.trim(),
    email,
    password: passwordHash,
    role: data.role,
    isActive: data.isActive ?? true,
  });

  return NextResponse.json(
    {
      success: true,
      message: "User created successfully",
      data: {
        id: String(created._id),
        name: created.name,
        email: created.email,
        role: created.role,
        isActive: created.isActive,
        createdAt: created.createdAt,
      },
    },
    { status: 201 },
  );
}
