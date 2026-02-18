import nodemailer from "nodemailer";

export type CallRequestPayload = {
  name: string;
  phone: string;
  course: string;
  createdAt?: string; // optional, if you have it
};

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function callRequestTemplate(data: CallRequestPayload): string {
  const createdAt = data.createdAt
    ? new Date(data.createdAt).toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
      });

  const name = escapeHtml(data.name);
  const phone = escapeHtml(data.phone);
  const course = escapeHtml(data.course);

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;padding:20px;">
    <div style="max-width:680px;margin:auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
      
      <div style="background:#111827;color:#ffffff;padding:18px 24px;">
        <h2 style="margin:0;font-size:18px;line-height:1.3;">New Call Back Request</h2>
        <p style="margin:6px 0 0;font-size:13px;opacity:.85;">Excel Computer & IT Center</p>
      </div>

      <div style="padding:22px 24px;">
        <p style="margin:0 0 14px;font-size:14px;color:#111827;">
          A new call back request has been submitted from Excel Computer & IT Center.
        </p>

        <table width="100%" cellpadding="8" style="border-collapse:collapse;font-size:14px;">
          <tr style="background:#f9fafb;">
            <td style="width:180px;border:1px solid #e5e7eb;"><strong>Name</strong></td>
            <td style="border:1px solid #e5e7eb;">${name}</td>
          </tr>
          <tr>
            <td style="width:180px;border:1px solid #e5e7eb;"><strong>Phone</strong></td>
            <td style="border:1px solid #e5e7eb;">
              <a href="tel:${phone}" style="color:#2563eb;text-decoration:none;">${phone}</a>
            </td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="width:180px;border:1px solid #e5e7eb;"><strong>Interested Course</strong></td>
            <td style="border:1px solid #e5e7eb;">${course}</td>
          </tr>
        </table>

        <div style="margin-top:16px;padding:12px 14px;background:#f9fafb;border:1px dashed #d1d5db;border-radius:8px;">
          <p style="margin:0;font-size:13px;color:#374151;">
            <strong>Suggested Next Step:</strong> Call the student within business hours and confirm course schedule, fees, and seat availability.
          </p>
        </div>

        <p style="margin:18px 0 0;font-size:12px;color:#6b7280;">
          Submitted at: ${createdAt}
        </p>
      </div>

      <div style="background:#f9fafb;padding:12px 24px;font-size:12px;color:#6b7280;text-align:center;">
        This email was generated automatically by Excel Computer & IT Center.
      </div>
    </div>
  </div>
  `;
}

export async function sendCallRequestMail(
  data: CallRequestPayload,
): Promise<void> {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const receiver = process.env.QUOTE_RECEIVER_EMAIL;

  if (!smtpUser || !smtpPass)
    throw new Error("SMTP credentials are missing (SMTP_USER/SMTP_PASS).");
  if (!receiver)
    throw new Error("Receiver email is missing (QUOTE_RECEIVER_EMAIL).");

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: { user: smtpUser, pass: smtpPass },
  });

  const subject = `Call Back Request: ${data.name} — ${data.course}`;

  await transporter.sendMail({
    from: `Excel Computer & IT Center <${smtpUser}>`,
    to: receiver,
    // replyTo is optional here because you only have phone.
    // If you later add email field, set replyTo to that email.
    subject,
    html: callRequestTemplate(data),
  });
}
