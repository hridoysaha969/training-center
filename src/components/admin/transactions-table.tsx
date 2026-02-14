"use client";

import { TransactionRow, TxMethod, TxType } from "@/data/mock-tables";
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
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/cn";

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

function inRange(dateISO: string, from?: string, to?: string) {
  if (!from && !to) return true;
  const d = new Date(dateISO).getTime();
  if (from) {
    const f = new Date(from).getTime();
    if (d < f) return false;
  }
  if (to) {
    const t = new Date(to).getTime();
    // include end date
    if (d > t + 24 * 60 * 60 * 1000 - 1) return false;
  }
  return true;
}

export default function TransactionsTable({
  rows,
}: {
  rows: TransactionRow[];
}) {
  const router = useRouter();

  const [q, setQ] = useState("");
  const [type, setType] = useState<"ALL" | TxType>("ALL");
  const [method, setMethod] = useState<"ALL" | TxMethod>("ALL");
  const [from, setFrom] = useState<string>("");
  const [to, setTo] = useState<string>("");

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const methodOptions = useMemo(() => {
    const set = new Set(rows.map((r) => r.method));
    return ["ALL", ...Array.from(set)] as const;
  }, [rows]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();

    return rows.filter((r) => {
      const matchQuery =
        !query ||
        r.id.toLowerCase().includes(query) ||
        r.title.toLowerCase().includes(query) ||
        (r.note ?? "").toLowerCase().includes(query) ||
        r.method.toLowerCase().includes(query);

      const matchType = type === "ALL" ? true : r.type === type;
      const matchMethod = method === "ALL" ? true : r.method === method;
      const matchDate = inRange(r.date, from || undefined, to || undefined);

      return matchQuery && matchType && matchMethod && matchDate;
    });
  }, [rows, q, type, method, from, to]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  if (page > totalPages) setPage(totalPages);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const pages = useMemo(
    () => getPagination(page, totalPages),
    [page, totalPages],
  );

  const monthPreset = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const toISO = (d: Date) => d.toISOString().slice(0, 10);
    setFrom(toISO(start));
    setTo(toISO(end));
    setPage(1);
  };

  const reset = () => {
    setQ("");
    setType("ALL");
    setMethod("ALL");
    setFrom("");
    setTo("");
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title, note, method, id..."
            className="lg:max-w-sm"
          />

          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={type}
              onValueChange={(v) => {
                setType(v as any);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-42.5">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="CREDIT">Cash In (Credit)</SelectItem>
                <SelectItem value="DEBIT">Cash Out (Debit)</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={method}
              onValueChange={(v) => {
                setMethod(v as any);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                {methodOptions.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m === "ALL" ? "All Methods" : m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={monthPreset}>
              This month
            </Button>

            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          </div>
        </div>

        {/* Date range */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm text-muted-foreground">Date:</div>
            <Input
              type="date"
              value={from}
              onChange={(e) => {
                setFrom(e.target.value);
                setPage(1);
              }}
              className="w-42.5"
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="date"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
                setPage(1);
              }}
              className="w-42.5"
            />
          </div>

          <div className="text-sm text-muted-foreground">
            {filtered.length} result{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        <Separator />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden lg:table-cell">Note</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="hidden xl:table-cell">Method</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paged.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              paged.map((r) => (
                <TableRow
                  key={r.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/admin/transactions/${r.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter")
                      router.push(`/admin/transactions/${r.id}`);
                  }}
                  className={cn(
                    "cursor-pointer transition-colors hover:bg-muted/60",
                    {
                      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400":
                        r.type === "CREDIT",
                      "bg-rose-500/10 text-rose-600 dark:text-rose-400":
                        r.type === "DEBIT",
                    },
                  )}
                >
                  <TableCell>
                    <span className="font-medium">
                      {r.type === "CREDIT" ? "Cash In" : "Cash Out"}
                    </span>
                  </TableCell>

                  <TableCell className="font-medium">{r.title}</TableCell>

                  <TableCell className="hidden lg:table-cell">
                    <span className="text-muted-foreground">
                      {r.note ?? "-"}
                    </span>
                  </TableCell>

                  <TableCell>{formatDate(r.date)}</TableCell>

                  <TableCell className="hidden xl:table-cell">
                    {r.method}
                  </TableCell>

                  <TableCell className="text-right">{taka(r.amount)}</TableCell>
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
