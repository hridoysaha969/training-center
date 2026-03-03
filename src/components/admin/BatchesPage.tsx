"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CalendarClock, Plus, Search, RefreshCcw, Pencil } from "lucide-react";

import { cn } from "@/lib/cn";
import { BATCH_SCHEDULES, makeBatchName } from "@/lib/batchSchedules";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type CourseOption = {
  id: string;
  name: string;
  code: string;
};

type BatchRow = {
  id: string;
  name: string;
  schedule: string;
  status: "RUNNING" | "CLOSED";
  capacity: number;
  studentCount: number;
  startDate: string | null;
  endDate: string | null;
  course: null | { id: string; name: string; code: string };
};

type BatchListResponse = {
  success: boolean;
  message?: string;
  data?: {
    items: BatchRow[];
    pagination: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
    };
  };
};

type CourseListResponse = {
  success: boolean;
  message?: string;
  data?: CourseOption[];
};

function formatDate(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

export default function BatchesPage() {
  // create dialog state
  const [open, setOpen] = useState(false);

  // courses
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // create batch form fields
  const [courseId, setCourseId] = useState<string>("");
  const [serial, setSerial] = useState<number>(1);
  const [schedule, setSchedule] = useState<(typeof BATCH_SCHEDULES)[number]>(
    BATCH_SCHEDULES[0],
  );
  const [startDate, setStartDate] = useState<string>(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState<string>(""); // YYYY-MM-DD
  const [capacity, setCapacity] = useState<number>(20);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === courseId),
    [courses, courseId],
  );

  const previewName = useMemo(() => {
    if (!selectedCourse?.code) return "Select a course";
    const safeSerial = Number.isFinite(serial) ? serial : 1;
    return makeBatchName(
      selectedCourse.code,
      Math.max(1, Math.min(99, safeSerial)),
    );
  }, [selectedCourse, serial]);

  const canCreate = useMemo(() => {
    if (!courseId) return false;
    if (!schedule) return false;
    if (!serial || serial < 1 || serial > 99) return false;
    if (capacity < 1 || capacity > 200) return false;
    if (startDate && endDate && endDate < startDate) return false;
    return true;
  }, [courseId, schedule, serial, capacity, startDate, endDate]);

  const resetCreateForm = () => {
    setCourseId("");
    setSerial(1);
    setSchedule(BATCH_SCHEDULES[0]);
    setStartDate("");
    setEndDate("");
    setCapacity(20);
  };

  // list filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"ALL" | "RUNNING" | "CLOSED">("ALL");
  const [from, setFrom] = useState(""); // YYYY-MM-DD
  const [to, setTo] = useState(""); // YYYY-MM-DD
  const [courseFilterId, setCourseFilterId] = useState<"ALL" | string>("ALL");

  // list data
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<BatchRow[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  async function loadCourses() {
    setCoursesLoading(true);
    try {
      const res = await fetch("/api/admin/courses", { cache: "no-store" });
      const json = (await res.json()) as CourseListResponse;

      if (!res.ok || !json.success || !json.data) {
        toast.error(json.message || "Failed to load courses");
        setCourses([]);
        return;
      }

      setCourses(json.data);
    } catch {
      toast.error("Network error while loading courses");
      setCourses([]);
    } finally {
      setCoursesLoading(false);
    }
  }

  async function loadBatches(nextPage = page) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(nextPage));
      params.set("limit", String(limit));

      if (q.trim()) params.set("q", q.trim());
      if (status !== "ALL") params.set("status", status);
      if (courseFilterId !== "ALL") params.set("courseId", courseFilterId);
      if (from) params.set("from", from);
      if (to) params.set("to", to);

      const res = await fetch(`/api/admin/batches?${params.toString()}`, {
        cache: "no-store",
      });
      const json = (await res.json()) as BatchListResponse;

      if (res.status === 401 || res.status === 403) {
        toast.error("Unauthorized. Please login again.");
        return;
      }

      if (!res.ok || !json.success || !json.data) {
        toast.error(json.message || "Failed to load batches");
        setItems([]);
        setTotalPages(1);
        return;
      }

      setItems(json.data.items);
      setTotalPages(json.data.pagination.totalPages);
    } catch {
      toast.error("Network error while loading batches");
      setItems([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    loadBatches(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, from, to, courseFilterId]);

  useEffect(() => {
    loadBatches(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  async function createBatch() {
    if (!canCreate) return;

    try {
      const res = await fetch("/api/admin/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          serial,
          schedule,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          capacity,
        }),
      });

      const json = await res.json().catch(() => null);

      if (res.status === 409) {
        toast.error("Batch already exists");
        return;
      }

      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to create batch");
        return;
      }

      toast.success("Batch created", { description: previewName });

      setOpen(false);
      resetCreateForm();

      // refresh list
      setPage(1);
      loadBatches(1);
    } catch {
      toast.error("Network error while creating batch");
    }
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Batches</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage course batches. Closed batches cannot accept new
            students.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => {
              loadCourses();
              loadBatches(page);
            }}
          >
            <RefreshCcw size={16} />
            Refresh
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Create Batch
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-140">
              <DialogHeader>
                <DialogTitle>Create batch</DialogTitle>
                <DialogDescription>
                  Select a course, choose schedule and assign a serial number.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                {/* Course select */}
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Select
                    value={courseId}
                    onValueChange={setCourseId}
                    disabled={coursesLoading}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          coursesLoading ? "Loading..." : "Select course"
                        }
                      />
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

                {/* Serial + Preview */}
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-2 sm:col-span-1">
                    <Label>Serial</Label>
                    <Input
                      type="number"
                      min={1}
                      max={99}
                      value={serial}
                      onChange={(e) => setSerial(Number(e.target.value || 1))}
                    />
                    <p className="text-xs text-muted-foreground">
                      1–99 (auto: {pad2(serial || 1)})
                    </p>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label>Preview</Label>
                    <div className="flex h-10 items-center rounded-md border bg-muted/40 px-3 text-sm font-medium">
                      {previewName}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Batch name is unique. Duplicate is blocked.
                    </p>
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-2">
                  <Label>Time schedule</Label>
                  <Select
                    value={schedule}
                    onValueChange={(v: any) => setSchedule(v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {BATCH_SCHEDULES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Dates */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Start date (optional)</Label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>End date (optional)</Label>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    {startDate && endDate && endDate < startDate ? (
                      <p className="text-xs text-rose-600">
                        End date can’t be before start date
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Capacity */}
                <div className="space-y-2">
                  <Label>Capacity</Label>
                  <Input
                    type="number"
                    min={1}
                    max={200}
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value || 20))}
                  />
                  <p className="text-xs text-muted-foreground">
                    Default is 20. You can adjust per batch if needed.
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    resetCreateForm();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  disabled={!canCreate}
                  onClick={createBatch}
                >
                  Create batch
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Search size={16} />
            Search & Filters
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 lg:grid-cols-12">
          <div className="space-y-2 lg:col-span-4">
            <Label>Search batch</Label>
            <Input
              value={q}
              onChange={(e) => {
                setPage(1);
                setQ(e.target.value);
              }}
              placeholder="Batch-AOM-01..."
            />
          </div>

          <div className="space-y-2 lg:col-span-3">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v: any) => {
                setPage(1);
                setStatus(v);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="RUNNING">Running</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 lg:col-span-5">
            <Label>Course</Label>
            <Select
              value={courseFilterId}
              onValueChange={(v: any) => {
                setPage(1);
                setCourseFilterId(v);
              }}
              disabled={coursesLoading}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={coursesLoading ? "Loading..." : "All courses"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All courses</SelectItem>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator className="lg:col-span-12" />

          <div className="grid gap-3 sm:grid-cols-2 lg:col-span-6">
            <div className="space-y-2">
              <Label>Start date from</Label>
              <Input
                type="date"
                value={from}
                onChange={(e) => {
                  setPage(1);
                  setFrom(e.target.value);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Start date to</Label>
              <Input
                type="date"
                value={to}
                onChange={(e) => {
                  setPage(1);
                  setTo(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-end gap-2 lg:col-span-6">
            <Button
              variant="outline"
              onClick={() => {
                setQ("");
                setStatus("ALL");
                setFrom("");
                setTo("");
                setCourseFilterId("ALL");
                setPage(1);
              }}
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Batch list</CardTitle>
          <Badge variant="secondary" className="gap-2">
            <CalendarClock size={14} />
            {loading ? "Loading..." : `${items.length} shown`}
          </Badge>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading batches...
            </div>
          ) : items.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No batches found.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Course
                    </TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden xl:table-cell">
                      Start
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">End</TableHead>
                    <TableHead className="text-right">Students</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {items.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.name}</TableCell>

                      <TableCell className="hidden md:table-cell">
                        {b.course?.name ?? "—"}
                        <span className="ml-2 text-xs text-muted-foreground">
                          {b.course?.code ? `(${b.course.code})` : ""}
                        </span>
                      </TableCell>

                      <TableCell>{b.schedule}</TableCell>

                      <TableCell>
                        <Badge
                          className={cn(
                            b.status === "RUNNING"
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
                              : "bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/10",
                          )}
                        >
                          {b.status === "RUNNING" ? "Running" : "Closed"}
                        </Badge>
                      </TableCell>

                      <TableCell className="hidden xl:table-cell">
                        {formatDate(b.startDate)}
                      </TableCell>

                      <TableCell className="hidden xl:table-cell">
                        {formatDate(b.endDate)}
                      </TableCell>

                      <TableCell className="text-right font-medium">
                        {b.studentCount}/{b.capacity}
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-xl"
                          title="Edit dates (coming next)"
                          onClick={() =>
                            toast.message("Edit dates coming next")
                          }
                        >
                          <Pencil size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Page <span className="font-medium text-foreground">{page}</span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{totalPages}</span>
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
