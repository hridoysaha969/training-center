"use client";
import { StudentRow } from "@/data/mock-tables";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

type StudentItem = {
  _id: string;
  roll: string;
  fullName: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone: string;
  email?: string;
  nidOrBirthId: string;
  admissionDate: string;
};

type Pagination = {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
};

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

export default function StudentsTable() {
  const router = useRouter();

  // UI filters (local)
  const [q, setQ] = useState("");
  const [gender, setGender] = useState<"ALL" | "MALE" | "FEMALE" | "OTHER">(
    "ALL",
  );

  // pagination state (drives API)
  const [page, setPage] = useState(1);
  const limit = 10;

  // server data
  const [items, setItems] = useState<StudentItem[]>([]);
  const [meta, setMeta] = useState<Pagination>({
    page: 1,
    limit,
    totalItems: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);

  // fetch whenever page changes
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `/api/admin/students?page=${page}&limit=${limit}`,
          {
            cache: "no-store",
          },
        );

        const json = await res.json();

        if (!json?.success) {
          setItems([]);
          setMeta({ page, limit, totalItems: 0, totalPages: 1 });
          return;
        }

        setItems(json.data.items);
        setMeta(json.data.pagination);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [page]);

  // local filtering (simple: filters current page)
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return items.filter((r) => {
      const roll = String(r.roll ?? "").toLowerCase();
      const name = String(r.fullName ?? "").toLowerCase();
      const phone = String(r.phone ?? "").toLowerCase();
      const nid = String(r.nidOrBirthId ?? "").toLowerCase();
      const email = String(r.email ?? "").toLowerCase();

      const matchQuery =
        !query ||
        roll.includes(query) ||
        name.includes(query) ||
        phone.includes(query) ||
        nid.includes(query) ||
        email.includes(query);

      const matchGender = gender === "ALL" ? true : r.gender === gender;

      return matchQuery && matchGender;
    });
  }, [items, q, gender]);

  const totalPages = meta.totalPages;

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
            placeholder="Search by roll, name, phone, NID, email..."
            className="sm:max-w-xs"
          />

          <div className="flex gap-2">
            <Select
              value={gender}
              onValueChange={(v) => {
                setGender(v as any);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 lg:justify-end">
          <p className="text-sm text-muted-foreground">
            {meta.totalItems} result{meta.totalItems === 1 ? "" : "s"}
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setQ("");
              setGender("ALL");
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
              <TableHead className="hidden xl:table-cell">Gender</TableHead>
              <TableHead className="hidden xl:table-cell">NID/Birth</TableHead>
              <TableHead>Admission</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  Loading students...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
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
                  <TableCell>{r.fullName}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {r.phone}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {r.gender}
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    {r.nidOrBirthId}
                  </TableCell>
                  <TableCell>{formatDate(r.admissionDate)}</TableCell>
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
