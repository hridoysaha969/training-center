"use client";

import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { courses } from "@/config/courses";
import {
  admissionSchema,
  type AdmissionInput,
} from "@/lib/validators/admission";
import { checkDuplicateNid } from "@/data/mock-duplicates";

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

function taka(n: number) {
  return `৳ ${n.toLocaleString("en-US")}`;
}

// UI-only roll generator (later server-side atomic)
function makeMockRoll() {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const rand = String(Math.floor(100 + Math.random() * 900)); // 3 digits
  return `${yy}${mm}${rand}`;
}

// UI-only batch preview (server will compute true batchNo based on counter)
function batchPreview(courseCode?: string) {
  if (!courseCode) return "Select a course";
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  return `${courseCode}-${yy}${mm}-01`;
}

export default function AdmissionPage() {
  const initialRollRef = useRef(makeMockRoll());

  const form = useForm<AdmissionInput>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      roll: initialRollRef.current,

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
  const [nidCheck, setNidCheck] = useState<{
    status: "idle" | "checking" | "ok" | "duplicate";
    message?: string;
  }>({ status: "idle" });

  const courseId = form.watch("courseId");
  const photoUrl = form.watch("photoUrl");
  const nid = form.watch("nidOrBirthId");

  const course = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courseId],
  );

  const canSubmit =
    form.formState.isValid &&
    !!courseId &&
    nidCheck.status !== "duplicate" &&
    nidCheck.status !== "checking";

  async function runDuplicateCheck(nidValue: string) {
    const v = nidValue.trim();
    if (v.length < 6) {
      setNidCheck({ status: "idle" });
      return;
    }

    setNidCheck({ status: "checking", message: "Checking duplicate..." });

    try {
      const exists = await checkDuplicateNid(v);
      if (exists) {
        setNidCheck({
          status: "duplicate",
          message: "This NID/Birth Registration Number already exists.",
        });
        // also set form error so user sees it as validation issue
        form.setError("nidOrBirthId", {
          type: "manual",
          message: "Duplicate detected. Please verify student record.",
        });
      } else {
        setNidCheck({ status: "ok", message: "Looks unique." });
        // clear manual error if any
        const err = form.formState.errors.nidOrBirthId;
        if (err?.type === "manual") form.clearErrors("nidOrBirthId");
      }
    } catch {
      setNidCheck({ status: "idle" });
      toast.error("Failed to check duplicate. Try again.");
    }
  }

  // This is called after user confirms
  async function finalizeSubmit(values: AdmissionInput) {
    try {
      // Later backend:
      // POST /api/admission
      // (server generates roll + batch atomically)
      console.log("FINAL SUBMIT:", values);

      toast.success("Admission submitted successfully.");

      // Reset form with a fresh roll
      const newRoll = makeMockRoll();
      form.reset({
        roll: newRoll,
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

      // optional: bring user back to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Failed to submit admission.");
    }
  }

  async function onSubmit(values: AdmissionInput) {
    // Ensure duplicate check is done before confirm
    await runDuplicateCheck(values.nidOrBirthId);

    // If duplicate, stop
    if (nidCheck.status === "duplicate") {
      toast.error("Duplicate NID/Birth ID found. Cannot submit.");
      return;
    }

    // Open confirm dialog
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
                        Roll is auto-generated and cannot be edited.
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
                          {courses.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name} ({c.durationMonths} months)
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

                {/* <Button type="submit" className="w-full" disabled={!canSubmit}>
                  Submit Admission
                </Button>

                {nidCheck.status === "checking" && (
                  <p className="text-xs text-muted-foreground">
                    Checking duplicate NID/Birth ID...
                  </p>
                )} */}
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
                          setNidCheck({ status: "idle" }); // reset hint while typing
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

                    <div className="mt-3 grid gap-3 lg:grid-cols-3 items-start">
                      <div className="overflow-hidden aspect-square col-span-1 rounded-xl border bg-muted">
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
              onClick={() => {
                const newRoll = makeMockRoll();
                form.reset({ ...form.getValues(), roll: newRoll });
                setNidCheck({ status: "idle" });
              }}
            >
              Reset Fields
            </Button>

            <Button type="submit" disabled={!canSubmit}>
              Submit Admission
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
