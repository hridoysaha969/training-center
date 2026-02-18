"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { latestAdmissions, latestTransactions } from "@/data/mock-tables";
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
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import LatestAdmissionsCard from "./latest-admission";

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

export function truncateText(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength).trimEnd() + "…";
}

export default function OverviewTables() {
  const router = useRouter();

  const [latestTransactions, setLatestTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/transactions?page=1&limit=10`,
          {
            cache: "no-store",
          },
        );
        const json = await res.json();
        setLatestTransactions(json?.success ? json.data.items : []);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Latest Admissions */}
      <LatestAdmissionsCard />

      {/* Latest Transactions */}
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Latest Transactions</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/transactions">View all</Link>
          </Button>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              Loading transactions...
            </div>
          ) : latestTransactions.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No transactions yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Date</TableHead>

                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {latestTransactions.map((row, idx) => (
                    <TableRow
                      key={idx}
                      role="button"
                      tabIndex={0}
                      onClick={() =>
                        router.push(`/admin/transactions/${row._id}`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          router.push(`/admin/transactions/${row._id}`);
                      }}
                      className={cn(
                        row.type === "CREDIT"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-pointer transition-colors hover:bg-muted/60"
                          : "bg-rose-500/10 text-rose-600 dark:text-rose-400 cursor-pointer transition-colors hover:bg-muted/60",
                      )}
                    >
                      <TableCell>
                        <span className="font-medium">
                          {row.type === "CREDIT" ? "Cash In" : "Cash Out"}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">
                        {truncateText(row.title, 20)}
                      </TableCell>
                      <TableCell>{formatDate(row.date)}</TableCell>

                      <TableCell className="text-right">
                        {taka(row.amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
