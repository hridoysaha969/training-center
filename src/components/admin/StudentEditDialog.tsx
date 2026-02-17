"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

type EditStudentForm = {
  // readonly
  roll: string;
  admissionDate: string;
  batches: string[]; // show as readonly chips
  certificateId?: string | null;

  // editable (student)
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  presentAddress: string;
  nidOrBirthId: string;
  photoUrl: string;

  // editable (guardian)
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianOccupation: string;
  guardianAddress: string;

  // editable (academic)
  qualification: string;
  passingYear: string;
  instituteName: string;
};

function toInputDate(v: string | Date) {
  const d = new Date(v);
  // yyyy-mm-dd
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function StudentEditDialog({
  initial,
  disabled,
  onSave,
}: {
  initial: EditStudentForm;
  disabled?: boolean;
  onSave?: (payload: EditStudentForm) => void; // UI only for now
}) {
  const [open, setOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState<EditStudentForm>(initial);

  React.useEffect(() => {
    // keep in sync when page data changes
    setForm(initial);
  }, [initial]);

  const dirty = React.useMemo(
    () => JSON.stringify(form) !== JSON.stringify(initial),
    [form, initial],
  );

  function set<K extends keyof EditStudentForm>(
    key: K,
    value: EditStudentForm[K],
  ) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function closeAndReset() {
    setForm(initial);
    setOpen(false);
  }

  async function handleSave() {
    // UI-only behavior (later we will call API)
    setSaving(true);
    try {
      onSave?.(form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => (v ? setOpen(true) : closeAndReset())}
    >
      <DialogTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl h-full">
        <DialogHeader className="px-6 pt-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <DialogTitle className="text-lg">Edit student</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Update student details. Roll, admission date, and batch are
                locked.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full">
                Roll: <span className="ml-1 font-semibold">{form.roll}</span>
              </Badge>
              {form.certificateId ? (
                <Badge className="rounded-full">Certificate Issued</Badge>
              ) : (
                <Badge variant="outline" className="rounded-full">
                  No Certificate
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[50vh]">
          <div className="space-y-6 px-6 py-5">
            {/* Locked summary */}
            <div className="rounded-xl border bg-muted/30 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Admission Date
                  </p>
                  <p className="text-sm font-medium">{form.admissionDate}</p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Batch</p>
                  <div className="flex flex-wrap gap-2">
                    {form.batches.length ? (
                      form.batches.map((b) => (
                        <span
                          key={b}
                          className="rounded-full border bg-background px-3 py-1 text-xs"
                        >
                          {b}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Certificate ID
                  </p>
                  <p className="text-sm font-medium">
                    {form.certificateId ?? "—"}
                  </p>
                </div>
              </div>
            </div>

            <Tabs defaultValue="student">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="guardian">Guardian</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
              </TabsList>

              {/* Student */}
              <TabsContent value="student" className="mt-4 space-y-5">
                <Section
                  title="Basic info"
                  desc="Name, contact and identification info."
                >
                  <Grid2>
                    <Field>
                      <Label>Full name</Label>
                      <Input
                        value={form.fullName}
                        onChange={(e) => set("fullName", e.target.value)}
                        placeholder="Student full name"
                      />
                    </Field>

                    <Field>
                      <Label>Gender</Label>
                      <Select
                        value={form.gender}
                        onValueChange={(v) => set("gender", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>

                    <Field>
                      <Label>Date of birth</Label>
                      <Input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) => set("dateOfBirth", e.target.value)}
                      />
                    </Field>

                    <Field>
                      <Label>Phone</Label>
                      <Input
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                      />
                    </Field>

                    <Field>
                      <Label>Email</Label>
                      <Input
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                      />
                    </Field>

                    <Field>
                      <Label>NID / Birth ID</Label>
                      <Input
                        value={form.nidOrBirthId}
                        onChange={(e) => set("nidOrBirthId", e.target.value)}
                      />
                    </Field>
                  </Grid2>

                  <Field>
                    <Label>Present address</Label>
                    <Textarea
                      value={form.presentAddress}
                      onChange={(e) => set("presentAddress", e.target.value)}
                      rows={3}
                    />
                  </Field>
                </Section>

                <Section
                  title="Photo"
                  desc="Keep a valid image URL (later: upload)."
                >
                  <Grid2>
                    <Field>
                      <Label>Photo URL</Label>
                      <Input
                        value={form.photoUrl}
                        onChange={(e) => set("photoUrl", e.target.value)}
                        placeholder="https://..."
                      />
                      <p className="mt-2 text-xs text-muted-foreground">
                        Tip: Use a square/portrait image for best printing.
                      </p>
                    </Field>

                    <div className="rounded-xl border bg-muted/20 p-3">
                      <p className="text-xs text-muted-foreground">Preview</p>
                      <div className="mt-2 aspect-7/9 w-35 overflow-hidden rounded-lg border bg-background">
                        {/* image preview: keep simple UI-only */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={form.photoUrl}
                          alt="preview"
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (
                              e.currentTarget as HTMLImageElement
                            ).style.opacity = "0.2";
                          }}
                        />
                      </div>
                    </div>
                  </Grid2>
                </Section>
              </TabsContent>

              {/* Guardian */}
              <TabsContent value="guardian" className="mt-4 space-y-5">
                <Section
                  title="Guardian info"
                  desc="Contact and address information."
                >
                  <Grid2>
                    <Field>
                      <Label>Name</Label>
                      <Input
                        value={form.guardianName}
                        onChange={(e) => set("guardianName", e.target.value)}
                      />
                    </Field>

                    <Field>
                      <Label>Relation</Label>
                      <Input
                        value={form.guardianRelation}
                        onChange={(e) =>
                          set("guardianRelation", e.target.value)
                        }
                      />
                    </Field>

                    <Field>
                      <Label>Phone</Label>
                      <Input
                        value={form.guardianPhone}
                        onChange={(e) => set("guardianPhone", e.target.value)}
                      />
                    </Field>

                    <Field>
                      <Label>Occupation</Label>
                      <Input
                        value={form.guardianOccupation}
                        onChange={(e) =>
                          set("guardianOccupation", e.target.value)
                        }
                      />
                    </Field>
                  </Grid2>

                  <Field>
                    <Label>Address</Label>
                    <Textarea
                      value={form.guardianAddress}
                      onChange={(e) => set("guardianAddress", e.target.value)}
                      rows={3}
                    />
                  </Field>
                </Section>
              </TabsContent>

              {/* Academic */}
              <TabsContent value="academic" className="mt-4 space-y-5">
                <Section
                  title="Academic info"
                  desc="Education background (editable)."
                >
                  <Grid2>
                    <Field>
                      <Label>Qualification</Label>
                      <Input
                        value={form.qualification}
                        onChange={(e) => set("qualification", e.target.value)}
                      />
                    </Field>

                    <Field>
                      <Label>Passing year</Label>
                      <Input
                        value={form.passingYear}
                        onChange={(e) => set("passingYear", e.target.value)}
                        placeholder="2024"
                      />
                    </Field>

                    <Field className="sm:col-span-2">
                      <Label>Institute name</Label>
                      <Input
                        value={form.instituteName}
                        onChange={(e) => set("instituteName", e.target.value)}
                      />
                    </Field>
                  </Grid2>
                </Section>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        <Separator />

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-muted-foreground">
            {dirty ? "You have unsaved changes." : "No changes yet."}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={closeAndReset} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !dirty}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4">
      <div className="mb-4">
        <p className="text-sm font-semibold">{title}</p>
        {desc ? <p className="text-xs text-muted-foreground">{desc}</p> : null}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Grid2({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className ?? "space-y-2"}>{children}</div>;
}
