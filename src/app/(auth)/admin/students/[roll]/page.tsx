import Link from "next/link";
import { Button } from "@/components/ui/button";
import { studentDetailsMock } from "@/data/mock-student-details";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default async function StudentDetailsPage({
  params,
}: {
  params: { roll: string };
}) {
  const roll = (await params).roll; // e.g. "2602001"

  // UI-first: later we’ll fetch by params.roll
  const data = studentDetailsMock;
  const s = data.student;

  const paid = s.status === "PAID";

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">{s.fullName}</h1>
            <Badge variant={paid ? "default" : "secondary"}>
              {paid ? "Paid" : "Due"}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">
            Roll: <span className="font-medium text-foreground">{roll}</span>
            {" • "}
            Certificate:{" "}
            <span className="font-medium text-foreground">
              {s.certificateId}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/students">Back</Link>
          </Button>
          <Button variant="outline">Edit</Button>
          <Button>Print</Button>
        </div>
      </div>

      <Separator />

      {/* Top section: Photo + Quick facts */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Photo card */}
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

            <p className="mt-3 text-xs text-muted-foreground">
              Photo preview (URL-based). Later we can add upload.
            </p>
          </CardContent>
        </Card>

        {/* Quick facts */}
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
              <p className="text-sm font-medium">{s.dateOfBirth}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Present Address</p>
              <p className="text-sm font-medium">{s.presentAddress}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next steps placeholders (we'll build step-by-step) */}
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

            <div className="rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                Tip: Later we can support multiple education records
                (SSC/HSC/etc).
              </p>
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

            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Verification</p>
                <p className="mt-1 text-sm font-medium">Not Verified</p>
              </div>

              <div className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground">Last Updated</p>
                <p className="mt-1 text-sm font-medium">—</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Document Pending</Badge>
              <Badge variant="outline">Manual Check</Badge>
            </div>

            <p className="text-xs text-muted-foreground">
              Later we’ll add “Verify ID” action (SUPER_ADMIN) and store
              verifiedBy + verifiedAt.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-none">
        <CardContent>
          {data.enrollments.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No enrollments found.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.enrollments.map((en) => {
                const running = en.status === "RUNNING";

                return (
                  <div
                    key={en.id}
                    className="flex items-center gap-2 rounded-full border bg-muted/40 px-3 py-1.5 text-sm"
                  >
                    {/* Course name */}
                    <span className="font-medium">{en.courseName}</span>

                    {/* Status badge */}
                    <Badge
                      variant={running ? "default" : "secondary"}
                      className="rounded-full text-xs"
                    >
                      {running ? "Running" : "Completed"}
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-4 text-xs text-muted-foreground">
            A student can enroll in multiple courses. Enrollment logic will be
            handled in Admission flow.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
