import { sendCallRequestMail } from "@/utils/sendCallReqMail";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload.name || !payload.phone || !payload.course) {
    return NextResponse.json(
      {
        success: false,
        message: "Name, phone, and course are required fields.",
      },
      { status: 400 },
    );
  }

  try {
    await sendCallRequestMail(payload);

    return NextResponse.json({
      success: true,
      message: "Call request sent successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to send call request email.",
      },
      { status: 500 },
    );
  }
  // Here you would typically save the request to a database or send a notification
}
