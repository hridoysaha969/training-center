// src/app/(auth)/admin/reassign/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
import { toast } from "sonner";

type CourseItem = {
  id: string; // <-- your API returns `id` (not _id)
  name: string;
  code: string;
  fee: number;
  durationMonths?: number;
};

type StudentItem = {
  _id: string;
  roll: string;
  fullName: string;
  phone: string;
  admissionDate: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function taka(n?: number | null) {
  const amount = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return `৳ ${amount.toLocaleString("en-US")}`;
}

export default function Reassign() {
  const router = useRouter();

  const [roll, setRoll] = useState("");
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [student, setStudent] = useState<StudentItem | null>(null);
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [courseId, setCourseId] = useState<string>("");

  const canSubmit = useMemo(() => {
    return Boolean(student) && Boolean(courseId) && !submitting;
  }, [student, courseId, submitting]);

  // Load active courses (expects you have an endpoint; if not, create it or swap to your existing one)
  useEffect(() => {
    const run = async () => {
      try {
        const res = await fetch("/api/admin/courses", { cache: "no-store" });
        const json = await res.json();

        if (json?.success) setCourses(json.data || []);
        else setCourses([]);
      } catch {
        setCourses([]);
      }
    };
    run();
  }, []);

  const selectedCourse = useMemo(() => {
    return courses.find((c) => String(c.id) === String(courseId)) || null;
  }, [courses, courseId]);

  const clear = () => {
    setStudent(null);
    setCourseId("");
  };

  const searchStudent = async () => {
    const r = roll.trim();
    if (!r) return;

    try {
      setSearching(true);
      clear();

      // Reuse your existing certificate search endpoint (it returns student + enrollment)
      const res = await fetch(`/api/admin/certificates/search?roll=${r}`, {
        cache: "no-store",
      });
      const json = await res.json();

      if (!json?.success) {
        setStudent(null);
        return;
      }

      const s = json.data.student as any;

      setStudent({
        _id: s._id,
        roll: s.roll,
        fullName: s.fullName,
        phone: s.phone,
        admissionDate: s.admissionDate,
      });
    } finally {
      setSearching(false);
    }
  };

  const submit = async () => {
    if (!student?.roll || !courseId) return;

    try {
      setSubmitting(true);

      const res = await fetch("/api/admin/reassign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roll: student.roll,
          courseId,
        }),
      });

      const json = await res.json();

      // show error toast
      if (!json?.success) {
        toast.error(json?.message || "Failed to reassign student");
        return;
      }

      // ✅ success toast
      toast.success("Student reassigned successfully");

      router.push(`/admin/students/${student.roll}`);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Re-assign Student</h1>
          <p className="text-sm text-muted-foreground">
            Enroll an existing student into another course and record cash in.
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
                if (e.key === "Enter") searchStudent();
              }}
            />
            <Button
              onClick={searchStudent}
              disabled={searching || !roll.trim()}
            >
              {searching ? "Searching..." : "Search"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {!student ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Search by roll to re-assign a student.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Student Summary */}
              <div className="flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-base font-semibold">
                      {student.fullName}
                    </div>
                    <Badge variant="outline">Roll: {student.roll}</Badge>
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

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/admin/students/${student.roll}`)
                    }
                    className="cursor-pointer"
                  >
                    View student
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clear}>
                    Clear
                  </Button>
                </div>
              </div>

              {/* Choose Course */}
              <div className="rounded-xl border p-4">
                <div className="font-medium">Select course</div>
                <Separator className="my-3" />

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <div className="mb-2 text-sm text-muted-foreground">
                      Course
                    </div>
                    <Select value={courseId} onValueChange={setCourseId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course..." />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name} ({c.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="mb-2 text-sm text-muted-foreground">
                      Fee
                    </div>
                    <div className="rounded-md border px-3 py-2 text-sm">
                      {selectedCourse ? taka(selectedCourse.fee) : "—"}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Re-assign creates a new Cash In ledger record.
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button disabled={!canSubmit}>
                        {submitting ? "Submitting..." : "Assign"}
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Confirm re-assign and cash in?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will create a new enrollment for{" "}
                          <span className="font-medium">
                            {student.fullName}
                          </span>{" "}
                          and record a Cash In transaction for the course fee.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={submitting}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          disabled={submitting}
                          onClick={submit}
                        >
                          Confirm
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <Button
                    variant="outline"
                    onClick={() => {
                      setCourseId("");
                    }}
                    disabled={submitting}
                  >
                    Reset course
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
