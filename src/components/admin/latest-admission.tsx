"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

type AdmissionRow = {
  roll: string;
  name: string;
  phone: string;
  date: string; // admission date ISO
  fee: number;
  status: "PAID" | "DUE";
};

export default function LatestAdmissionsCard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [latestAdmissions, setLatestAdmissions] = useState<AdmissionRow[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/admin/students?page=1&limit=10", {
          cache: "no-store",
        });

        const json = await res.json();

        if (!json?.success) {
          setLatestAdmissions([]);
          return;
        }

        const items = (json.data?.items || []) as any[];

        const mapped: AdmissionRow[] = items.map((s) => ({
          roll: s.roll,
          name: s.fullName ?? s.name ?? "-",
          phone: s.phone ?? "-", // not in Student schema (fallback)
          date: s.admissionDate,
          fee: Number(s.fee ?? 0), // not in Student schema (fallback)
          status: (s.status ?? "PAID") as "PAID" | "DUE", // fallback
        }));

        setLatestAdmissions(mapped);
      } catch {
        setLatestAdmissions([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <>
      {/* Latest Admissions */}
      <Card className="shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Latest Admissions</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/students">View all</Link>
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading admissions...
            </div>
          ) : latestAdmissions.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No admissions yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll</TableHead>
                    <TableHead>Name</TableHead>

                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Admission Date</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {latestAdmissions.map((row) => (
                    <TableRow
                      key={row.roll}
                      role="button"
                      tabIndex={0}
                      onClick={() => router.push(`/admin/students/${row.roll}`)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          router.push(`/admin/students/${row.roll}`);
                      }}
                      className="cursor-pointer transition-colors hover:bg-muted/60"
                    >
                      <TableCell className="font-medium">{row.roll}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{formatDate(row.date)}</TableCell>

                      <TableCell className="text-right">
                        <Badge
                          variant={
                            row.status === "PAID" ? "default" : "secondary"
                          }
                        >
                          {row.status || "PAID"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
