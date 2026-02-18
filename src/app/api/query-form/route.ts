import { sendMessage } from "@/utils/sendForm";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { payload, fingerprint } = await request.json();

  if (!payload || !fingerprint) {
    return NextResponse.json(
      {
        error: "Missing payload or fingerprint",
        success: false,
      },
      { status: 400 },
    );
  }

  try {
    await sendMessage(payload);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to process the message",
        success: false,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Admission data received and processed.",
    success: true,
  });
}
