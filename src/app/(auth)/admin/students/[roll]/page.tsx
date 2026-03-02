import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import StudentPageAction from "@/components/admin/student-page-action";
import { requireAdmin } from "@/lib/rbac";

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

      resultStatus?: "PENDING" | "PASS" | "FAIL";
      certificateId?: string | null;
      certificateIssuedAt?: string | Date | null;

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

export default async function StudentDetailsPage({
  params,
}: {
  params: Promise<{ roll: string }>;
}) {
  const { roll } = await params;

  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/admin/students/${encodeURIComponent(
      roll,
    )}`,
    { cache: "no-store" },
  );

  if (res.status === 404) return notFound();
  if (!res.ok) {
    // You can build a nicer error UI later
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Student Details</h1>
        <p className="text-sm text-muted-foreground">
          Failed to load student. Status: {res.status}
        </p>
        <Button asChild variant="outline">
          <Link href="/admin/students">Back</Link>
        </Button>
      </div>
    );
  }

  const json = (await res.json()) as StudentDetailsResponse;
  const s = json.data!.student;
  const enrollments = json.data!.enrollments;

  const certificatesIssuedCount = enrollments.filter((e) =>
    Boolean((e as any).certificateId),
  ).length;

  const certificateIssued = certificatesIssuedCount > 0;

  const latestIssuedCertificate = enrollments
    .filter((e) => Boolean((e as any).certificateId))
    .sort((a: any, b: any) => {
      const ad = a.certificateIssuedAt
        ? new Date(a.certificateIssuedAt).getTime()
        : 0;
      const bd = b.certificateIssuedAt
        ? new Date(b.certificateIssuedAt).getTime()
        : 0;
      return bd - ad;
    })[0];

  const admin = await requireAdmin();
  const canEdit = admin?.role === "SUPER_ADMIN";

  function toInputDate(v: string | Date) {
    const d = new Date(v);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  const initialEdit = {
    roll: s.roll,
    admissionDate: formatDate(s.admissionDate),
    batches: enrollments.map((e) => e.batchName),
    certificateId: s.certificateId,

    fullName: s.fullName,
    dateOfBirth: toInputDate(s.dateOfBirth),
    gender: s.gender,
    phone: s.phone,
    email: s.email || "",
    presentAddress: s.presentAddress,
    nidOrBirthId: s.nidOrBirthId,
    photoUrl: s.photoUrl,

    guardianName: s.guardian.name,
    guardianRelation: s.guardian.relation,
    guardianPhone: s.guardian.phone,
    guardianOccupation: s.guardian.occupation,
    guardianAddress: s.guardian.address,

    qualification: s.academic.qualification,
    passingYear: s.academic.passingYear,
    instituteName: s.academic.instituteName,
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">{s.fullName}</h1>

            <Badge variant={certificateIssued ? "default" : "secondary"}>
              {certificateIssued ? "Certificate Issued" : "Not Issued"}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Roll: <span className="font-medium text-foreground">{s.roll}</span>
            {" • "}
            Admission:{" "}
            <span className="font-medium text-foreground">
              {formatDate(s.admissionDate)}
            </span>
          </p>

          <p className="text-sm text-muted-foreground">
            Certificates:{" "}
            <span className="font-medium text-foreground">
              {certificatesIssuedCount}
            </span>
            {latestIssuedCertificate?.certificateId ? (
              <>
                {" • "}
                Latest:{" "}
                <span className="font-medium text-foreground">
                  {latestIssuedCertificate.certificateId}
                </span>
              </>
            ) : null}
          </p>
        </div>
        <StudentPageAction
          roll={s.roll}
          initialEdit={initialEdit}
          canEdit={canEdit}
        />{" "}
        {/* Action buttons (Edit, Print, etc.) */}
      </div>

      <Separator />

      {/* Top section: Photo + Quick Info */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Photo */}
        <Card className="shadow-none lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Student Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-muted">
              <Image
                src={s.photoUrl}
                alt={s.fullName}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
              />
            </div>
          </CardContent>
        </Card>

        {/* Quick Info */}
        <Card className="shadow-none lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Quick Info</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Phone</p>
              <p className="text-sm font-medium">{s.phone}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{s.email || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="text-sm font-medium">{s.gender}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Date of Birth</p>
              <p className="text-sm font-medium">{formatDate(s.dateOfBirth)}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Present Address</p>
              <p className="text-sm font-medium">{s.presentAddress}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Details cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Guardian */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Guardian</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Name</p>
              <p className="text-sm font-medium">{s.guardian.name}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Relation</p>
                <p className="text-sm font-medium">{s.guardian.relation}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">{s.guardian.phone}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Occupation</p>
              <p className="text-sm font-medium">{s.guardian.occupation}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm font-medium">{s.guardian.address}</p>
            </div>
          </CardContent>
        </Card>

        {/* Academic */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Academic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Qualification</p>
              <p className="text-sm font-medium">{s.academic.qualification}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Passing Year</p>
                <p className="text-sm font-medium">{s.academic.passingYear}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Institute</p>
                <p className="text-sm font-medium">
                  {s.academic.instituteName}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Identification */}
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="text-base">Identification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">NID / Birth ID</p>
              <p className="break-all text-sm font-medium">{s.nidOrBirthId}</p>
            </div>

            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                Verification feature can be added later (verifiedBy +
                verifiedAt).
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-base">Enrollments</CardTitle>
        </CardHeader>

        <CardContent>
          {enrollments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No enrollments found.
            </p>
          ) : (
            <div className="space-y-3">
              {enrollments.map((en: any) => {
                const running = en.status === "RUNNING";

                const courseName = en.course?.name ?? "Unknown course";
                const courseCode = en.course?.code ?? "—";

                const result: "PENDING" | "PASS" | "FAIL" =
                  en.resultStatus ?? "PENDING";
                const certificateId = en.certificateId ?? null;
                const certificateIssuedAt = en.certificateIssuedAt ?? null;

                const resultVariant =
                  result === "PASS"
                    ? "default"
                    : result === "FAIL"
                      ? "destructive"
                      : "outline";

                return (
                  <div
                    key={en.id}
                    className="rounded-xl border bg-muted/20 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      {/* left */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-medium">
                            {courseName}{" "}
                            <span className="text-xs text-muted-foreground">
                              ({courseCode})
                            </span>
                          </div>

                          <Badge
                            variant={running ? "default" : "secondary"}
                            className="rounded-full text-xs"
                          >
                            {running ? "Running" : "Completed"}
                          </Badge>

                          <Badge
                            variant={resultVariant as any}
                            className="rounded-full text-xs"
                          >
                            {result === "PENDING"
                              ? "Result: Pending"
                              : `Result: ${result}`}
                          </Badge>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          Batch:{" "}
                          <span className="font-medium text-foreground">
                            {en.batchName}
                          </span>
                          {" • "}
                          Start:{" "}
                          <span className="font-medium text-foreground">
                            {formatDate(en.startDate)}
                          </span>
                        </div>
                      </div>

                      {/* right */}
                      <div className="space-y-1 text-sm sm:text-right">
                        <div className="text-xs text-muted-foreground">
                          Certificate
                        </div>

                        <div className="font-medium">
                          {certificateId ? certificateId : "—"}
                        </div>

                        {certificateIssuedAt ? (
                          <div className="text-xs text-muted-foreground">
                            Issued: {formatDate(certificateIssuedAt)}
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            Not issued
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
