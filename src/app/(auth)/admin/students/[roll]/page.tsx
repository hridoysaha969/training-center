import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

export default async function StudentDetailsPage({
  params,
}: {
  params: { roll: string };
}) {
  const roll = (await params).roll?.trim();
  // Server-side fetch from your own API (keeps RBAC consistent)
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

  const certificateIssued = !!s.certificateId;

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
            Certificate:{" "}
            <span className="font-medium text-foreground">
              {s.certificateId ?? "—"}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/students">Back</Link>
          </Button>

          {/* Later: role protected actions */}
          <Button variant="outline">Edit</Button>
          <Button>Print</Button>
        </div>
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

      {/* Enrollments chips (your preferred design) */}
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
            <div className="flex flex-wrap gap-2">
              {enrollments.map((en) => {
                const running = en.status === "RUNNING";
                const courseName = en.course?.name ?? "Unknown course";

                return (
                  <div
                    key={en.id}
                    className="flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-sm"
                  >
                    <span className="font-medium">{courseName}</span>

                    <Badge
                      variant={running ? "default" : "secondary"}
                      className="rounded-full text-xs"
                    >
                      {running ? "Running" : "Completed"}
                    </Badge>

                    <span className="text-xs text-muted-foreground">
                      {en.batchName}
                    </span>
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
