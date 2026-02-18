// src/app/(auth)/admin/transactions/[id]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function taka(n?: number | null) {
  const amount = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return `৳ ${amount.toLocaleString("en-US")}`;
}

type TxDetails = {
  id: string;
  type: "CREDIT" | "DEBIT";
  source: "ADMISSION" | "INVESTMENT";
  title: string;
  note: string;
  amount: number;
  date: string;
  createdBy: null | { id: string; name: string; email: string; role?: string };
  invoiceImageUrl: string | null;

  student: null | {
    id: string;
    roll: string;
    fullName: string;
    phone?: string;
  };

  enrollment: null | {
    id: string;
    batchName: string;
    startDate: string;
    status: "RUNNING" | "COMPLETED";
  };

  investment: null | {
    id: string;
    title: string;
    amount: number;
    description: string;
    date: string;
    invoiceImageUrl: string | null;
  };
};

export default function TransactionDetailsPage({ id }: { id: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [tx, setTx] = useState<TxDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/transactions/${id}`,
          {
            cache: "no-store",
          },
        );

        const json = await res.json();
        if (!json?.success) {
          setTx(null);
          setError(json?.message || "Failed to load transaction");
          return;
        }

        setTx(json.data as TxDetails);
      } catch {
        setTx(null);
        setError("Failed to load transaction");
      } finally {
        setLoading(false);
      }
    };

    if (id) run();
  }, [id]);

  const badge = useMemo(() => {
    if (!tx) return null;
    const label = tx.type === "CREDIT" ? "Cash In" : "Cash Out";
    const variant = tx.type === "CREDIT" ? "default" : "secondary";
    return { label, variant } as const;
  }, [tx]);

  return (
    <div className="space-y-4 p-4">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-semibold">Transaction Details</h1>
            {tx && badge ? (
              <Badge variant={badge.variant}>{badge.label}</Badge>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground">
            ID: <span className="font-medium">{id}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.back()}>
            Back
          </Button>
          <Button asChild variant="ghost">
            <Link href="/admin/transactions">All Transactions</Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <Card className="shadow-none">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Loading transaction...
          </CardContent>
        </Card>
      ) : error ? (
        <Card className="shadow-none">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      ) : !tx ? (
        <Card className="shadow-none">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Transaction not found.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main */}
          <Card className="shadow-none lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-muted-foreground">Title</div>
                  <div className="font-medium">{tx.title}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="font-medium">{taka(tx.amount)}</div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Date</div>
                  <div className="font-medium">
                    {formatDate(tx.date)} • {formatTime(tx.date)}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-muted-foreground">Source</div>
                  <div className="font-medium">{tx.source}</div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-xs text-muted-foreground">
                  Description / Note
                </div>
                <div className="text-sm leading-relaxed">
                  {tx.note?.trim() ? (
                    tx.note
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>

              {(tx.student || tx.enrollment || tx.investment) && (
                <>
                  <Separator />
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Related</div>

                    {tx.student ? (
                      <div className="rounded-lg border p-3">
                        <div className="text-xs text-muted-foreground">
                          Student
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2">
                          <span className="font-medium">
                            {tx.student.fullName}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm">
                            Roll:{" "}
                            <span className="font-medium">
                              {tx.student.roll}
                            </span>
                          </span>
                          {tx.student.phone ? (
                            <>
                              <span className="text-muted-foreground">•</span>
                              <span className="text-sm">
                                {tx.student.phone}
                              </span>
                            </>
                          ) : null}
                        </div>

                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              router.push(`/admin/students/${tx.student!.roll}`)
                            }
                          >
                            View student
                          </Button>
                        </div>
                      </div>
                    ) : null}

                    {tx.enrollment ? (
                      <div className="rounded-lg border p-3">
                        <div className="text-xs text-muted-foreground">
                          Enrollment
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                          <span className="font-medium">
                            {tx.enrollment.batchName}
                          </span>
                          <span className="text-muted-foreground">•</span>
                          <span>{formatDate(tx.enrollment.startDate)}</span>
                          <span className="text-muted-foreground">•</span>
                          <span>{tx.enrollment.status}</span>
                        </div>
                      </div>
                    ) : null}

                    {tx.investment ? (
                      <div className="rounded-lg border p-3">
                        <div className="text-xs text-muted-foreground">
                          Investment
                        </div>
                        <div className="mt-1 font-medium">
                          {tx.investment.title}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {tx.investment.description?.trim()
                            ? tx.investment.description
                            : "—"}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Side */}
          <div className="space-y-4">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Created By</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {tx.createdBy ? (
                  <>
                    <div className="font-medium">{tx.createdBy.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {tx.createdBy.email}
                    </div>
                    {tx.createdBy.role ? (
                      <Badge variant="outline">{tx.createdBy.role}</Badge>
                    ) : null}
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">—</div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Invoice</CardTitle>
              </CardHeader>
              <CardContent>
                {tx.invoiceImageUrl ? (
                  <a
                    href={tx.invoiceImageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block overflow-hidden rounded-lg border"
                  >
                    {/* using plain img keeps it simple; you can swap to next/image later */}
                    <img
                      src={tx.invoiceImageUrl}
                      alt="Invoice"
                      className="h-auto w-full"
                    />
                  </a>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No invoice attached.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
