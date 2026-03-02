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

type EnrollmentItem = {
  id: string;
  batchName: string;
  startDate: string;
  status: "RUNNING" | "COMPLETED";
  resultStatus: "PENDING" | "PASS" | "FAIL";
  resultNote: string;
  certificateId: string | null;
  certificateIssuedAt: string | null;
  course: null | { id: string; name: string; code: string; fee: number };
};

type SearchResponse = {
  success: boolean;
  message?: string;
  data?: {
    student: any;
    enrollments: EnrollmentItem[];
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
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState<string>("");

  const [saving, setSaving] = useState(false);

  // local result selection (UI only for now)
  const [resultStatus, setResultStatus] = useState<"PENDING" | "PASS" | "FAIL">(
    "PENDING",
  );
  const [resultNote, setResultNote] = useState("");

  const selectedEnrollment = useMemo(() => {
    return enrollments.find((e) => e.id === selectedEnrollmentId) || null;
  }, [enrollments, selectedEnrollmentId]);

  const issued = Boolean(selectedEnrollment?.certificateId);

  const canIssue = useMemo(() => {
    if (!selectedEnrollment) return false;
    if (issued) return false;

    // ✅ must be COMPLETED + PASS on the enrollment itself (saved state)
    return (
      selectedEnrollment.status === "COMPLETED" &&
      selectedEnrollment.resultStatus === "PASS"
    );
  }, [selectedEnrollment, issued]);

  const reset = () => {
    setStudent(null);
    setEnrollments([]);
    setSelectedEnrollmentId("");
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
        { cache: "no-store" },
      );

      const json = (await res.json()) as SearchResponse;

      if (!json?.success) return;

      setStudent(json.data?.student ?? null);

      const list = json.data?.enrollments ?? [];
      setEnrollments(list);

      // auto-select latest enrollment (first item)
      if (list.length > 0) {
        setSelectedEnrollmentId(list[0].id);
        setResultStatus(list[0].resultStatus ?? "PENDING");
        setResultNote(list[0].resultNote ?? "");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSelectEnrollment = (id: string) => {
    setSelectedEnrollmentId(id);

    const e = enrollments.find((x) => x.id === id);
    setResultStatus((e?.resultStatus as any) ?? "PENDING");
    setResultNote(e?.resultNote ?? "");
  };

  const issueCertificate = async () => {
    if (!selectedEnrollment?.id) return;

    try {
      setIssuing(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/certificates/issue`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enrollmentId: selectedEnrollment.id }),
        },
      );

      const json = await res.json();
      if (!json?.success) return;

      // update selected enrollment in UI
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === selectedEnrollment.id
            ? {
                ...e,
                certificateId: json.data.certificateId,
                certificateIssuedAt: json.data.certificateIssuedAt,
              }
            : e,
        ),
      );
    } finally {
      setIssuing(false);
    }
  };

  const saveResult = async () => {
    if (!selectedEnrollment?.id) return;

    try {
      setSaving(true);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/certificates/result`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            enrollmentId: selectedEnrollment.id,
            resultStatus, // PASS | FAIL
            resultNote,
          }),
        },
      );

      const json = await res.json();
      if (!json?.success) return;

      // update enrollment list from server response
      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === selectedEnrollment.id
            ? {
                ...e,
                status: json.data.status,
                resultStatus: json.data.resultStatus,
                resultNote: json.data.resultNote,
              }
            : e,
        ),
      );
    } finally {
      setSaving(false);
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
                  <div className="text-base font-semibold">
                    {student.fullName}
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

              {/* Enrollment selector */}
              <div className="rounded-xl border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-medium">Select Enrollment</div>
                  {selectedEnrollment?.status ? (
                    <Badge variant="outline">{selectedEnrollment.status}</Badge>
                  ) : null}
                </div>

                <Separator className="my-3" />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 text-sm text-muted-foreground">
                      Enrollment (Course)
                    </div>
                    <Select
                      value={selectedEnrollmentId}
                      onValueChange={onSelectEnrollment}
                      disabled={enrollments.length === 0}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select enrollment..." />
                      </SelectTrigger>
                      <SelectContent>
                        {enrollments.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.course?.name ?? "Course"} • {e.batchName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="text-muted-foreground">Certificate No.</div>
                    <div className="font-medium">
                      {selectedEnrollment?.certificateId
                        ? selectedEnrollment.certificateId
                        : "—"}
                    </div>
                    {selectedEnrollment?.certificateIssuedAt ? (
                      <div className="text-xs text-muted-foreground">
                        Issued at:{" "}
                        {formatDate(selectedEnrollment.certificateIssuedAt)}
                      </div>
                    ) : null}
                    <div className="pt-1">
                      {issued ? (
                        <Badge>Issued</Badge>
                      ) : (
                        <Badge variant="secondary">Not issued</Badge>
                      )}
                    </div>
                  </div>
                </div>

                {selectedEnrollment ? (
                  <>
                    <Separator className="my-4" />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Course
                        </div>
                        <div className="font-medium">
                          {selectedEnrollment.course?.name ?? "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Batch
                        </div>
                        <div className="font-medium">
                          {selectedEnrollment.batchName}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Start date
                        </div>
                        <div className="font-medium">
                          {selectedEnrollment.startDate
                            ? formatDate(selectedEnrollment.startDate)
                            : "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">
                          Current result
                        </div>
                        <div className="font-medium">
                          {selectedEnrollment.resultStatus ?? "PENDING"}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No enrollments found for this student.
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
                      disabled={!selectedEnrollment || issued}
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
                      * Certificate can be issued only when Enrollment is
                      COMPLETED and Result is PASS.
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
                      disabled={!selectedEnrollment || issued}
                    />
                    <div className="mt-2 text-xs text-muted-foreground">
                      (We’ll save this to enrollment in the next step.)
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

                  <Button
                    variant="outline"
                    disabled={
                      !selectedEnrollment ||
                      issued ||
                      saving ||
                      resultStatus === "PENDING"
                    }
                    onClick={saveResult}
                  >
                    {saving ? "Saving..." : "Save result"}
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
                          this enrollment. Once issued, it cannot be changed.
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
