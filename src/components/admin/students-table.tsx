"use client";
import { StudentRow } from "@/data/mock-tables";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function taka(n: number) {
  return `৳ ${n.toLocaleString("en-US")}`;
}

function getPagination(current: number, total: number) {
  const pages: (number | "dots")[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }

  pages.push(1);

  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) pages.push("dots");

  for (let i = left; i <= right; i++) pages.push(i);

  if (right < total - 1) pages.push("dots");

  pages.push(total);
  return pages;
}

export default function StudentsTable({ rows }: { rows: StudentRow[] }) {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"ALL" | "PAID" | "DUE">("ALL");
  const [course, setCourse] = useState<string>("ALL");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const courseOptions = useMemo(() => {
    const set = new Set(rows.map((r) => r.course));
    return ["ALL", ...Array.from(set)];
  }, [rows]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return rows.filter((r) => {
      const matchQuery =
        !query ||
        r.roll.toLowerCase().includes(query) ||
        r.name.toLowerCase().includes(query) ||
        r.phone.toLowerCase().includes(query);

      const matchStatus = status === "ALL" ? true : r.status === status;
      const matchCourse = course === "ALL" ? true : r.course === course;

      return matchQuery && matchStatus && matchCourse;
    });
  }, [rows, q, status, course]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  // reset page if filters reduce results
  if (page > totalPages) setPage(totalPages);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const pages = useMemo(
    () => getPagination(page, totalPages),
    [page, totalPages],
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search by roll, name, phone..."
            className="sm:max-w-xs"
          />

          <div className="flex gap-2">
            <Select
              value={status}
              onValueChange={(v) => {
                setStatus(v as any);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="DUE">Due</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={course}
              onValueChange={(v) => {
                setCourse(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-50">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                {courseOptions.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "ALL" ? "All Courses" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 lg:justify-end">
          <p className="text-sm text-muted-foreground">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setQ("");
              setStatus("ALL");
              setCourse("ALL");
              setPage(1);
            }}
          >
            Reset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Roll</TableHead>
              <TableHead>Student</TableHead>
              <TableHead className="hidden lg:table-cell">Phone</TableHead>
              <TableHead className="hidden xl:table-cell">Course</TableHead>
              <TableHead>Admission</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((r) => (
                <TableRow
                  key={r.roll}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/admin/students/${r.roll}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      router.push(`/admin/students/${r.roll}`);
                  }}
                  className="cursor-pointer transition-colors hover:bg-muted/60"
                >
                  <TableCell className="font-medium">{r.roll}</TableCell>
                  <TableCell>{r.name}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {r.phone}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {r.course}
                  </TableCell>
                  <TableCell>{formatDate(r.admissionDate)}</TableCell>
                  <TableCell className="text-right">{taka(r.fee)}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={r.status === "PAID" ? "default" : "secondary"}
                    >
                      {r.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Page <span className="font-medium">{page}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>

          {pages.map((p, idx) =>
            p === "dots" ? (
              <span
                key={`dots-${idx}`}
                className="px-2 text-sm text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
              >
                {p}
              </Button>
            ),
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
