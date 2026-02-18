import nodemailer from "nodemailer";

type AdmissionData = {
  student: {
    name: string;
    dob: string;
    binOrNid: string;
    gender: string;
    mobile: string;
    email: string;
    address: string;
  };
  guardian: {
    guardianName: string;
    relation: string;
    phone: string;
    email: string;
    occupation: string;
    address: string;
  };
  academic: {
    educationLevel: string;
    institute: string;
    board: string;
    passingYear: string;
    computerExperience: string;
    hasLaptop: string;
  };
  createdAt: string;
};

// Example template function type
export function messageTemplate(data: AdmissionData): string {
  const { student, guardian, academic, createdAt } = data;

  const formattedDate = new Date(createdAt).toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:5px;">
    <div style="max-width:700px; margin:auto; background:white; border-radius:8px; overflow:hidden; border:1px solid #e5e7eb;">
      
      <!-- Header -->
      <div style="background:#111827; color:white; padding:16px 18px;">
        <h2 style="margin:0;">New Admission Submission</h2>
        <p style="margin:4px 0 0; font-size:13px; opacity:.8;">
          Excel Computer & IT Center
        </p>
      </div>

      <div style="padding:24px;">
        
        <!-- Student Info -->
        <h3 style="margin-top:0; border-bottom:1px solid #e5e7eb; padding-bottom:6px;">Student Information</h3>
        <table width="100%" cellpadding="6" style="border-collapse:collapse; font-size:14px;">
          <tr><td><strong>Name:</strong></td><td>${student.name}</td></tr>
          <tr><td><strong>Date of Birth:</strong></td><td>${student.dob}</td></tr>
          <tr><td><strong>Gender:</strong></td><td>${student.gender}</td></tr>
          <tr><td><strong>Mobile:</strong></td><td>${student.mobile}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${student.email}</td></tr>
          <tr><td><strong>NID/BIN:</strong></td><td>${student.binOrNid}</td></tr>
          <tr><td><strong>Address:</strong></td><td>${student.address}</td></tr>
        </table>

        <!-- Guardian Info -->
        <h3 style="margin-top:24px; border-bottom:1px solid #e5e7eb; padding-bottom:6px;">Guardian Information</h3>
        <table width="100%" cellpadding="6" style="border-collapse:collapse; font-size:14px;">
          <tr><td><strong>Name:</strong></td><td>${guardian.guardianName}</td></tr>
          <tr><td><strong>Relation:</strong></td><td>${guardian.relation}</td></tr>
          <tr><td><strong>Phone:</strong></td><td>${guardian.phone}</td></tr>
          <tr><td><strong>Email:</strong></td><td>${guardian.email}</td></tr>
          <tr><td><strong>Occupation:</strong></td><td>${guardian.occupation}</td></tr>
          <tr><td><strong>Address:</strong></td><td>${guardian.address}</td></tr>
        </table>

        <!-- Academic Info -->
        <h3 style="margin-top:24px; border-bottom:1px solid #e5e7eb; padding-bottom:6px;">Academic Information</h3>
        <table width="100%" cellpadding="6" style="border-collapse:collapse; font-size:14px;">
          <tr><td><strong>Education Level:</strong></td><td>${academic.educationLevel}</td></tr>
          <tr><td><strong>Institute:</strong></td><td>${academic.institute}</td></tr>
          <tr><td><strong>Board:</strong></td><td>${academic.board}</td></tr>
          <tr><td><strong>Passing Year:</strong></td><td>${academic.passingYear}</td></tr>
          <tr><td><strong>Computer Experience:</strong></td><td>${academic.computerExperience}</td></tr>
          <tr><td><strong>Has Laptop:</strong></td><td>${academic.hasLaptop}</td></tr>
        </table>

        <!-- Footer Info -->
        <div style="margin-top:24px; font-size:13px; color:#6b7280; border-top:1px solid #e5e7eb; padding-top:12px;">
          Submitted at: ${formattedDate}
        </div>

      </div>

      <!-- Footer -->
      <div style="background:#f9fafb; padding:12px 24px; font-size:12px; color:#6b7280; text-align:center;">
        This email was generated automatically by Excel Computer & IT Center.
      </div>

    </div>
  </div>
  `;
}

export async function sendMessage(data: AdmissionData): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP credentials are missing in environment variables");
  }

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `Excel Computer <${process.env.SMTP_USER}>`,
    to: process.env.QUOTE_RECEIVER_EMAIL,
    replyTo: data.student.email,
    subject: `New Admission: ${data.student.name}`,
    html: messageTemplate(data),
  });
}
