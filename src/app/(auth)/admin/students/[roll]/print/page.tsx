import Image from "next/image";
import { notFound } from "next/navigation";
import AutoPrint from "./AutoPrint";

type StudentDetailsResponse = {
  success: boolean;
  data?: {
    student: {
      roll: string;
      fullName: string;
      dateOfBirth: string | Date;
      nidOrBirthId: string;
      gender: string;
      phone: string;
      email: string;
      presentAddress: string;
      photoUrl: string;
      admissionDate: string | Date;
      certificateId: string | null;
      certificateIssuedAt: string | Date | null;
      guardian: {
        name: string;
        relation: string;
        phone: string;
        occupation: string;
        address: string;
      };
      academic: {
        qualification: string;
        passingYear: string;
        instituteName: string;
      };
    };
    enrollments: Array<{
      id: string;
      batchName: string;
      startDate: string | Date;
      status: "RUNNING" | "COMPLETED";
      course: null | {
        id: string;
        name: string;
        code: string;
        durationMonths: number;
        fee: number;
      };
    }>;
  };
};

function formatDate(d: any) {
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function StudentPrintPage({
  params,
}: {
  params: Promise<{ roll: string }>;
}) {
  const { roll } = await params;

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/admin/students/${encodeURIComponent(roll)}`,
    { cache: "no-store" },
  );

  if (res.status === 404) return notFound();
  if (!res.ok) return notFound();

  const json = (await res.json()) as StudentDetailsResponse;
  const s = json.data!.student;
  const enrollments = json.data!.enrollments;

  const primary = enrollments[0];
  const courseName = primary?.course?.name ?? "—";
  const batchName = primary?.batchName ?? "—";

  return (
    <div className="print-scope mx-auto max-w-225 bg-white p-6 text-black">
      {/* Admit Card */}
      <div className="rounded-2xl border border-black/15 p-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full font-extrabold">
              <Image
                src="/excel-computer.png"
                alt="Logo"
                width={24}
                height={24}
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-lg font-extrabold leading-tight">
                Excel Computer
              </h1>
              <p className="text-xs text-black/70">& IT Training Center</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-extrabold tracking-[0.22em]">
              ADMIT CARD
            </div>
            <div className="mt-2 grid gap-1 text-xs">
              <div className="flex items-center justify-end gap-2">
                <span className="text-black/60">Issue Date</span>
                <span className="font-bold">{formatDate(new Date())}</span>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="text-black/60">Roll</span>
                <span className="font-bold">{s.roll}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="my-4 h-px bg-black/10" />

        {/* Body */}
        <div className="grid gap-6 md:grid-cols-[200px_1fr]">
          {/* Photo */}
          <div className="grid gap-3">
            <div
              className="relative overflow-hidden rounded-lg border border-black/20"
              style={{ width: "35mm", height: "40mm" }}
            >
              <Image
                src={s.photoUrl}
                alt={s.fullName}
                fill
                className="object-cover"
                sizes="140px"
                priority
              />
            </div>
          </div>

          {/* Details */}
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Student Name" value={s.fullName} />
              <Field label="Gender" value={s.gender} />
              <Field label="Date of Birth" value={formatDate(s.dateOfBirth)} />
              <Field label="Phone" value={s.phone} />
              <Field label="Email" value={s.email || "—"} />
              <Field label="NID / Birth ID" value={s.nidOrBirthId} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Course" value={courseName} />
              <Field label="Batch" value={batchName} />
              <Field
                label="Admission Date"
                value={formatDate(s.admissionDate)}
              />
              <Field label="Institute" value={s.academic.instituteName} />
            </div>

            {/* <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-xs text-black/60">Present Address</p>
              <p className="mt-1 text-sm font-semibold">{s.presentAddress}</p>
            </div> */}

            <div className="rounded-2xl border border-black/10 p-4">
              <p className="text-xs text-black/60">Guardian</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Name" value={s.guardian.name} />
                <Field label="Relation" value={s.guardian.relation} />
                <Field label="Phone" value={s.guardian.phone} />
                <Field label="Occupation" value={s.guardian.occupation} />
              </div>
              <p className="mt-3 text-xs text-black/60">
                Address:{" "}
                <span className="text-black/80">{s.guardian.address}</span>
              </p>
            </div>

            {/* Signatures */}
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              <SignLine label="Student Signature" />
              <SignLine label="Authorized Signature" />
            </div>

            <p className="text-xs text-black/60">
              • Bring this admit card for every class/exam. • Tampering
              invalidates the card. • Contact office for corrections.
            </p>
          </div>
        </div>
      </div>

      {/* Print on load (we’ll wire this in Step 2) */}
      <AutoPrint />
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-black/60">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

function SignLine({ label }: { label: string }) {
  return (
    <div>
      <div className="h-px w-full bg-black/30" />
      <p className="mt-2 text-[11px] text-black/60">{label}</p>
    </div>
  );
}
