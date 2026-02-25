export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import { connectDB } from "@/lib/mongodb";
import { PhotoAsset } from "@/models/PhotoAsset";
import { requireAdmin } from "@/lib/rbac"; // you already have this

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    const form = await req.formData();
    const file = form.get("file") as File | null;
    const type = (form.get("type") as string | null) || "STUDENT";

    if (!file) {
      return NextResponse.json(
        { success: false, message: "File is required" },
        { status: 400 },
      );
    }

    if (!["STUDENT", "INVOICE"].includes(type)) {
      return NextResponse.json(
        { success: false, message: "Invalid type" },
        { status: 400 },
      );
    }

    // Convert to base64 data URL
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    const folder = process.env.CLOUDINARY_FOLDER || "excel-itc";

    const uploaded = await cloudinary.uploader.upload(dataUrl, {
      folder: `${folder}/photos`,
      resource_type: "image",
    });

    await connectDB();

    const doc = await PhotoAsset.create({
      type,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      bytes: uploaded.bytes,
      width: uploaded.width,
      height: uploaded.height,
      format: uploaded.format,
      createdBy: admin.id,
    });

    return NextResponse.json({ success: true, photo: doc }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e?.message || "Upload failed" },
      { status: 500 },
    );
  }
}
