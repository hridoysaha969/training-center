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

export default function OverviewTables() {
  const router = useRouter();

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Latest Admissions */}
      <Card className="shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Latest Admissions</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/students">View all</Link>
          </Button>
        </CardHeader>

        <CardContent>
          {latestAdmissions.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">
              No admissions yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Roll</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead className="hidden xl:table-cell">
                      Course
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Fee</TableHead>
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
                      <TableCell className="hidden xl:table-cell">
                        {row.course}
                      </TableCell>
                      <TableCell>{formatDate(row.date)}</TableCell>
                      <TableCell className="text-right">
                        {taka(row.fee)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={
                            row.status === "PAID" ? "default" : "secondary"
                          }
                        >
                          {row.status}
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

      {/* Latest Transactions */}
      <Card className="shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Latest Transactions</CardTitle>
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin/transactions">View all</Link>
          </Button>
        </CardHeader>

        <CardContent>
          {latestTransactions.length === 0 ? (
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
                    <TableHead className="hidden xl:table-cell">
                      Method
                    </TableHead>
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
                        router.push(`/admin/transactions/${row.id}`)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter")
                          router.push(`/admin/transactions/${row.id}`);
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
                      <TableCell className="font-medium">{row.title}</TableCell>
                      <TableCell>{formatDate(row.date)}</TableCell>
                      <TableCell className="hidden xl:table-cell">
                        {row.method}
                      </TableCell>
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
