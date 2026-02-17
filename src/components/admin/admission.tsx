"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  admissionSchema,
  type AdmissionInput,
} from "@/lib/validators/admission";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

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
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

type DbCourse = {
  id: string; // ObjectId string
  name: string;
  code: string;
  durationMonths: 3 | 6;
  fee: number;
};

function taka(n: number) {
  return `৳ ${n.toLocaleString("en-US")}`;
}

const ROLL_PLACEHOLDER = "AUTO";

function batchPreview(courseCode?: string) {
  if (!courseCode) return "Select a course";
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `${courseCode}-${yy}${mm}-**`;
}

type NidCheckState =
  | { status: "idle"; message?: string }
  | { status: "checking"; message?: string }
  | { status: "ok"; message?: string }
  | { status: "duplicate"; message?: string };

export default function AdmissionPage() {
  const router = useRouter();

  const form = useForm<AdmissionInput>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      roll: ROLL_PLACEHOLDER,

      fullName: "",
      dateOfBirth: "",
      nidOrBirthId: "",
      gender: "MALE",
      phone: "",
      email: "",
      presentAddress: "",
      photoUrl: "",

      guardianName: "",
      guardianRelation: "",
      guardianPhone: "",
      guardianOccupation: "",
      guardianAddress: "",

      qualification: "",
      passingYear: "",
      instituteName: "",

      courseId: "",
    },
    mode: "onChange",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingValuesRef = useRef<AdmissionInput | null>(null);

  // Duplicate check state
  const [nidCheck, setNidCheck] = useState<NidCheckState>({ status: "idle" });
  const [submitting, setSubmitting] = useState(false);

  const [dbCourses, setDbCourses] = useState<DbCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const courseId = form.watch("courseId");
  const photoUrl = form.watch("photoUrl");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/courses");
        const json = await res.json();
        if (res.ok && json?.success) setDbCourses(json.data);
        else toast.error(json?.message || "Failed to load courses");
      } catch {
        toast.error("Failed to load courses");
      } finally {
        setCoursesLoading(false);
      }
    })();
  }, []);

  const course = useMemo(
    () => dbCourses.find((c) => c.id === courseId),
    [dbCourses, courseId],
  );

  const canSubmit =
    form.formState.isValid &&
    !!courseId &&
    nidCheck.status !== "duplicate" &&
    nidCheck.status !== "checking" &&
    !submitting;

  async function runDuplicateCheck(nidValue: string) {
    const v = nidValue.trim();
    if (v.length < 6) {
      setNidCheck({ status: "idle" });
      return;
    }

    setNidCheck({ status: "checking", message: "Checking duplicate..." });

    try {
      const res = await fetch(
        `/api/admin/students/exists?n=${encodeURIComponent(v)}`,
        { method: "GET" },
      );

      if (res.status === 401 || res.status === 403) {
        setNidCheck({ status: "idle" });
        toast.error("Session expired. Please login again.");
        router.push("/admin/login");
        return;
      }

      const json = await res.json();

      if (!res.ok || !json?.success) {
        setNidCheck({ status: "idle" });
        toast.error(json?.message || "Failed to check duplicate.");
        return;
      }

      if (json.exists) {
        setNidCheck({
          status: "duplicate",
          message: "This NID/Birth Registration Number already exists.",
        });
        form.setError("nidOrBirthId", {
          type: "manual",
          message: "Duplicate detected. Please verify student record.",
        });
      } else {
        setNidCheck({ status: "ok", message: "Looks unique." });
        const err = form.formState.errors.nidOrBirthId;
        if (err?.type === "manual") form.clearErrors("nidOrBirthId");
      }
    } catch {
      setNidCheck({ status: "idle" });
      toast.error("Network error. Try again.");
    }
  }

  // This is called after user confirms
  async function finalizeSubmit(values: AdmissionInput) {
    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/admission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const json = await res.json().catch(() => null);

      if (res.status === 401 || res.status === 403) {
        toast.error("Unauthorized. Please login again.");
        router.push("/admin/login");
        return;
      }

      if (res.status === 409) {
        // duplicate NID/Birth ID (server-side check)
        setNidCheck({
          status: "duplicate",
          message: "This NID/Birth Registration Number already exists.",
        });
        form.setError("nidOrBirthId", {
          type: "manual",
          message: "Duplicate detected. Please verify student record.",
        });
        toast.error(json?.message || "Duplicate detected.");
        return;
      }

      if (res.status === 422) {
        toast.error("Validation failed. Please check the form.");
        // optional: if backend returns zod flatten errors
        return;
      }

      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to create admission.");
        return;
      }

      const roll = json.data?.roll as string | undefined;
      const batchName = json.data?.batchName as string | undefined;

      toast.success("Admission created successfully.", {
        description: roll
          ? `Roll: ${roll}${batchName ? ` • Batch: ${batchName}` : ""}`
          : undefined,
        action: roll
          ? {
              label: "View Student",
              onClick: () => router.push(`/admin/students/${roll}`),
            }
          : undefined,
      });

      // ✅ Clear form after submission (as you requested)
      form.reset({
        roll: ROLL_PLACEHOLDER,
        fullName: "",
        dateOfBirth: "",
        nidOrBirthId: "",
        gender: "MALE",
        phone: "",
        email: "",
        presentAddress: "",
        photoUrl: "",
        guardianName: "",
        guardianRelation: "",
        guardianPhone: "",
        guardianOccupation: "",
        guardianAddress: "",
        qualification: "",
        passingYear: "",
        instituteName: "",
        courseId: "",
      });

      setNidCheck({ status: "idle" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Network error while submitting.");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(values: AdmissionInput) {
    // Ensure duplicate check has been performed at least once
    await runDuplicateCheck(values.nidOrBirthId);

    // If duplicate, stop
    if (nidCheck.status === "duplicate") {
      toast.error("Duplicate NID/Birth ID found. Cannot submit.");
      return;
    }

    pendingValuesRef.current = values;
    setConfirmOpen(true);
  }

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-semibold">Student Admission</h1>
        <p className="text-sm text-muted-foreground">
          Register a student. Roll & batch are auto-assigned. Certificate is
          issued later.
        </p>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Top: Admission Info + Preview */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Admission info */}
            <Card className="shadow-none lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Admission Info</CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="roll"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Roll (Auto)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          readOnly
                          className="cursor-not-allowed"
                        />
                      </FormControl>
                      <FormDescription>
                        Roll is generated on submit (server-side).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select course" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dbCourses.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Course controls fee + batch assignment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Preview */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Preview</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-xl border p-3">
                  <p className="text-xs text-muted-foreground">Course Fee</p>
                  <p className="mt-1 text-lg font-semibold">
                    {course ? taka(course.fee) : "—"}
                  </p>
                </div>

                <div className="rounded-xl border p-3">
                  <p className="text-xs text-muted-foreground">Batch (Auto)</p>
                  <p className="mt-1 text-sm font-medium">
                    {batchPreview(course?.code)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Final batch number is computed server-side (20 students per
                    batch).
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Student Info */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Student Information</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Student full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="01XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="student@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* NID/Birth ID with duplicate check on blur */}
              <FormField
                control={form.control}
                name="nidOrBirthId"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>NID / Birth Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="NID or Birth Reg. Number"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur();
                          runDuplicateCheck(e.target.value);
                        }}
                        onChange={(e) => {
                          field.onChange(e);
                          setNidCheck({ status: "idle" });
                        }}
                      />
                    </FormControl>

                    {nidCheck.status === "ok" && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400">
                        ✅ {nidCheck.message}
                      </p>
                    )}

                    {nidCheck.status === "duplicate" && (
                      <p className="text-xs text-rose-600 dark:text-rose-400">
                        ❌ {nidCheck.message}
                      </p>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="presentAddress"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Present Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo URL + Preview */}
              <FormField
                control={form.control}
                name="photoUrl"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Student Photo URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>
                      We accept a photo URL (no upload). Preview will appear
                      below.
                    </FormDescription>
                    <FormMessage />

                    <div className="mt-3 grid gap-3 lg:grid-cols-4">
                      {/* <div className="rounded-xl border bg-muted/30 p-3 text-xs text-muted-foreground">
                        Tip: Use a direct image URL. If preview fails, the URL
                        may not allow hotlinking.
                      </div> */}

                      <div className="overflow-hidden col-span-1 rounded-xl border bg-muted">
                        {photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={photoUrl}
                            alt="Student preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                            Photo preview
                          </div>
                        )}
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Guardian Info */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Guardian Information</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 lg:grid-cols-2">
              {[
                ["guardianName", "Guardian Name", "Guardian full name"],
                ["guardianRelation", "Relation", "Father / Mother / ..."],
                ["guardianPhone", "Guardian Phone", "01XXXXXXXXX"],
                ["guardianOccupation", "Guardian Occupation", "Occupation"],
              ].map(([name, label, ph]) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input placeholder={ph} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <FormField
                control={form.control}
                name="guardianAddress"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Guardian Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Academic Info */}
          <Card className="shadow-none">
            <CardHeader>
              <CardTitle className="text-base">Academic Information</CardTitle>
            </CardHeader>

            <CardContent className="grid gap-4 lg:grid-cols-2">
              <FormField
                control={form.control}
                name="qualification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Qualification</FormLabel>
                    <FormControl>
                      <Input placeholder="SSC / HSC / Diploma ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passingYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passing Year</FormLabel>
                    <FormControl>
                      <Input placeholder="2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instituteName"
                render={({ field }) => (
                  <FormItem className="lg:col-span-2">
                    <FormLabel>Institute Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="College / School / University"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Bottom action row */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => {
                form.reset({
                  roll: "AUTO",
                  fullName: "",
                  dateOfBirth: "",
                  nidOrBirthId: "",
                  gender: "MALE",
                  phone: "",
                  email: "",
                  presentAddress: "",
                  photoUrl: "",
                  guardianName: "",
                  guardianRelation: "",
                  guardianPhone: "",
                  guardianOccupation: "",
                  guardianAddress: "",
                  qualification: "",
                  passingYear: "",
                  instituteName: "",
                  courseId: "",
                });
                setNidCheck({ status: "idle" });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Clear Form
            </Button>

            <Button type="submit" disabled={!canSubmit || coursesLoading}>
              {submitting ? "Submitting..." : "Submit Admission"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirm Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Admission</AlertDialogTitle>
            <AlertDialogDescription>
              Please confirm the student admission. This will create the student
              record and enrollment.
              <br />
              <span className="text-muted-foreground">
                Certificate is issued later from Certificate page.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const values = pendingValuesRef.current;
                setConfirmOpen(false);
                if (values) finalizeSubmit(values);
              }}
            >
              Confirm & Submit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
