export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { PhotoAsset } from "@/models/PhotoAsset";
import { requireAdmin } from "@/lib/rbac";

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type"); // STUDENT | INVOICE | null
    const limit = Math.min(Number(searchParams.get("limit") || 30), 100);
    const cursor = searchParams.get("cursor"); // createdAt cursor string (ISO)

    const filter: any = {};
    if (type === "STUDENT" || type === "INVOICE") filter.type = type;
    if (cursor) filter.createdAt = { $lt: new Date(cursor) };

    await connectDB();

    const rows = await PhotoAsset.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = rows.length > limit;
    const items = hasMore ? rows.slice(0, limit) : rows;

    const nextCursor = hasMore ? items[items.length - 1].createdAt : null;

    return NextResponse.json(
      {
        success: true,
        items: items.map((x) => ({
          id: String(x._id),
          type: x.type,
          url: x.url,
          publicId: x.publicId,
          bytes: x.bytes,
          width: x.width,
          height: x.height,
          format: x.format,
          createdAt: x.createdAt,
        })),
        nextCursor,
      },
      { status: 200 },
    );
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Failed to fetch photos" },
      { status: 500 },
    );
  }
}
