// src/app/(auth)/admin/certificates/page.tsx
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SearchResponse = {
  success: boolean;
  message?: string;
  data?: {
    student: any;
    enrollment: any | null;
  };
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function CertificatesPage() {
  const router = useRouter();

  const [roll, setRoll] = useState("");
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);

  const [student, setStudent] = useState<any | null>(null);
  const [enrollment, setEnrollment] = useState<any | null>(null);

  // local result selection (UI only for now)
  const [resultStatus, setResultStatus] = useState<"PENDING" | "PASS" | "FAIL">(
    "PENDING",
  );
  const [resultNote, setResultNote] = useState("");

  const issued = Boolean(student?.certificateId);

  const canIssue = useMemo(() => {
    // keep it simple:
    // - must have student
    // - cannot issue if already issued
    // - optional: only allow if PASS
    return Boolean(student) && !issued && resultStatus === "PASS";
  }, [student, issued, resultStatus]);

  const reset = () => {
    setStudent(null);
    setEnrollment(null);
    setResultStatus("PENDING");
    setResultNote("");
  };

  const search = async () => {
    const r = roll.trim();
    if (!r) return;

    try {
      setLoading(true);
      reset();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/certificates/search?roll=${r}`,
        {
          cache: "no-store",
        },
      );

      const json = (await res.json()) as SearchResponse;

      if (!json?.success) {
        setStudent(null);
        setEnrollment(null);
        return;
      }

      setStudent(json.data?.student ?? null);
      setEnrollment(json.data?.enrollment ?? null);

      // If enrollment already has a result, prefill
      const rs = json.data?.enrollment?.resultStatus as
        | "PENDING"
        | "PASS"
        | "FAIL"
        | undefined;
      if (rs) setResultStatus(rs);

      const rn = json.data?.enrollment?.resultNote as string | undefined;
      if (typeof rn === "string") setResultNote(rn);
    } finally {
      setLoading(false);
    }
  };

  const issueCertificate = async () => {
    if (!student?.roll) return;

    try {
      setIssuing(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/certificates/issue`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roll: student.roll }),
        },
      );

      const json = await res.json();

      if (!json?.success) return;

      // update UI immediately
      setStudent((prev: any) =>
        prev
          ? {
              ...prev,
              certificateId: json.data.certificateId,
              certificateIssuedAt: json.data.certificateIssuedAt,
            }
          : prev,
      );
    } finally {
      setIssuing(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Certificates</h1>
          <p className="text-sm text-muted-foreground">
            Search a student by roll, update result, and issue certificate.
          </p>
        </div>
      </div>

      <Card className="shadow-none">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Find student</CardTitle>
          <div className="flex w-full gap-2 sm:w-auto">
            <Input
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
              placeholder="Enter roll..."
              className="sm:w-60"
              onKeyDown={(e) => {
                if (e.key === "Enter") search();
              }}
            />
            <Button onClick={search} disabled={loading || !roll.trim()}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!student ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Search a student by roll to manage certificate issuing.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Student summary */}
              <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-base font-semibold">
                      {student.fullName}
                    </div>
                    {issued ? (
                      <Badge>Issued</Badge>
                    ) : (
                      <Badge variant="secondary">Not issued</Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Roll: <span className="font-medium">{student.roll}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Phone: <span className="font-medium">{student.phone}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Admission:{" "}
                    <span className="font-medium">
                      {formatDate(student.admissionDate)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="text-muted-foreground">Certificate No.</div>
                  <div className="font-medium">
                    {student.certificateId ? student.certificateId : "—"}
                  </div>
                  {student.certificateIssuedAt ? (
                    <div className="text-xs text-muted-foreground">
                      Issued at: {formatDate(student.certificateIssuedAt)}
                    </div>
                  ) : null}

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(`/admin/students/${student.roll}`)
                      }
                    >
                      View student
                    </Button>
                  </div>
                </div>
              </div>

              {/* Enrollment (minimal) */}
              <div className="rounded-xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium">Enrollment</div>
                  {enrollment?.status ? (
                    <Badge variant="outline">{enrollment.status}</Badge>
                  ) : null}
                </div>

                <Separator className="my-3" />

                {enrollment ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Course
                      </div>
                      <div className="font-medium">
                        {enrollment.course?.name ?? "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Batch</div>
                      <div className="font-medium">
                        {enrollment.batchName ?? "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Start date
                      </div>
                      <div className="font-medium">
                        {enrollment.startDate
                          ? formatDate(enrollment.startDate)
                          : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">
                        Current result
                      </div>
                      <div className="font-medium">
                        {enrollment.resultStatus ?? "PENDING"}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No enrollment found for this student.
                  </div>
                )}
              </div>

              {/* Result + Issue */}
              <div className="rounded-xl border p-4">
                <div className="font-medium">Result & Issue</div>
                <Separator className="my-3" />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 text-sm text-muted-foreground">
                      Result status
                    </div>
                    <Select
                      value={resultStatus}
                      onValueChange={(v) => setResultStatus(v as any)}
                      disabled={!enrollment || issued}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select result" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="PASS">Pass</SelectItem>
                        <SelectItem value="FAIL">Fail</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="mt-2 text-xs text-muted-foreground">
                      * Certificate can be issued only when result is PASS.
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-sm text-muted-foreground">
                      Note (optional)
                    </div>
                    <Input
                      value={resultNote}
                      onChange={(e) => setResultNote(e.target.value)}
                      placeholder="Result note..."
                      disabled={!enrollment || issued}
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      (We’ll save this to enrollment in next step.)
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={!student}
                    onClick={() => {
                      setRoll("");
                      reset();
                    }}
                  >
                    Clear
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={!canIssue || issuing}>
                        {issuing ? "Issuing..." : "Issue certificate"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Issue certificate permanently?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will generate a certificate number and save it to
                          the student profile. Once issued, it cannot be
                          changed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={issuing}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          disabled={issuing}
                          onClick={issueCertificate}
                        >
                          Confirm issue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
