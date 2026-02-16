import { NextRequest, NextResponse } from "next/server";
import { Student } from "@/models/Student"; // adjust path to your Student model
import { connectDB } from "@/lib/mongodb";

type SortKey = "admissionDate" | "createdAt" | "fullName" | "roll";
type SortDir = "asc" | "desc";

function toInt(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    // pagination
    const page = toInt(searchParams.get("page"), 1);
    const limit = Math.min(toInt(searchParams.get("limit"), 10), 100);
    const skip = (page - 1) * limit;

    // search + filters
    const q = (searchParams.get("q") || "").trim();
    const course = (searchParams.get("course") || "").trim(); // only works if you store course somewhere
    const gender = (searchParams.get("gender") || "").trim(); // MALE/FEMALE/OTHER

    // certificate filter: "ALL" | "ISSUED" | "NOT_ISSUED"
    const certificate = (searchParams.get("certificate") || "ALL").trim();

    // date range
    const from = searchParams.get("from"); // yyyy-mm-dd
    const to = searchParams.get("to"); // yyyy-mm-dd

    // sorting
    const sortBy = (searchParams.get("sortBy") || "admissionDate") as SortKey;
    const sortDir = (searchParams.get("sortDir") || "desc") as SortDir;

    const filter: any = {};

    // If you don't have "course" in Student schema, remove this block
    if (course && course !== "ALL") filter.course = course;

    if (gender && ["MALE", "FEMALE", "OTHER"].includes(gender)) {
      filter.gender = gender;
    }

    if (certificate === "ISSUED") {
      filter.certificateId = { $exists: true, $nin: [null, ""] };
    } else if (certificate === "NOT_ISSUED") {
      filter.$or = [
        { certificateId: { $exists: false } },
        { certificateId: null },
        { certificateId: "" },
      ];
    }

    if (from || to) {
      filter.admissionDate = {};
      if (from) filter.admissionDate.$gte = new Date(from);
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        filter.admissionDate.$lte = end;
      }
    }

    if (q) {
      const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const rx = new RegExp(safe, "i");
      filter.$or = [
        ...(filter.$or || []), // keep OR from certificate filter if present
        { roll: rx },
        { fullName: rx },
        { phone: rx },
        { nidOrBirthId: rx },
        { email: rx },
      ];
    }

    const sort: Record<string, 1 | -1> = {
      [sortBy]: sortDir === "asc" ? 1 : -1,
      _id: -1,
    };

    const [items, total] = await Promise.all([
      Student.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(
          "roll fullName phone gender admissionDate photoUrl certificateId certificateIssuedAt createdAt",
        )
        .lean(),
      Student.countDocuments(filter),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    // map to a table-friendly row shape
    const rows = items.map((s: any) => ({
      roll: s.roll,
      name: s.fullName,
      phone: s.phone,
      course: s.course ?? "N/A", // if not present
      admissionDate: s.admissionDate,
      fee: Number(s.fee ?? 0), // ✅ always number
      status: s.status ?? "DUE", // if not present
    }));

    return NextResponse.json({
      success: true,
      data: {
        rows,
        meta: {
          page,
          limit,
          total,
          totalPages,
          hasPrev: page > 1,
          hasNext: page < totalPages,
        },
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Server error" },
      { status: 500 },
    );
  }
}
