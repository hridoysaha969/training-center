"use client";

import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { CalendarIcon, Download, Filter, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  mockCashFlow,
  mockRecentTransactions,
  mockSummary,
  mockTopExpenses,
} from "@/data/mock-reports";
import { cn } from "@/lib/cn";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";

function taka(n: number) {
  return `৳ ${n.toLocaleString("en-US")}`;
}

function ymLabel(ym: string) {
  // ym: "2026-02"
  const [y, m] = ym.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
}

export default function ReportsPage() {
  // Filters (UI)
  const [rangePreset, setRangePreset] = useState<
    "THIS_MONTH" | "LAST_MONTH" | "LAST_6_MONTHS" | "CUSTOM"
  >("THIS_MONTH");

  const [from, setFrom] = useState<Date | undefined>(undefined);
  const [to, setTo] = useState<Date | undefined>(undefined);

  const [type, setType] = useState<"ALL" | "CREDIT" | "DEBIT">("ALL");
  const [source, setSource] = useState<"ALL" | "ADMISSION" | "INVESTMENT">(
    "ALL",
  );
  const [query, setQuery] = useState("");

  const appliedLabel = useMemo(() => {
    if (rangePreset !== "CUSTOM") return rangePreset.replaceAll("_", " ");
    if (!from || !to) return "CUSTOM RANGE";
    return `${format(from, "dd MMM yyyy")} → ${format(to, "dd MMM yyyy")}`;
  }, [rangePreset, from, to]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Track cash in/out, revenue, admissions and export records for
            audits.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <RefreshCcw size={16} />
            Refresh
          </Button>
          <Button className="gap-2">
            <Download size={16} />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter size={16} />
            Filters
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 lg:grid-cols-12">
          {/* Range preset */}
          <div className="space-y-2 lg:col-span-3">
            <Label>Date range</Label>
            <Select
              value={rangePreset}
              onValueChange={(v: any) => setRangePreset(v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="THIS_MONTH">This month</SelectItem>
                <SelectItem value="LAST_MONTH">Last month</SelectItem>
                <SelectItem value="LAST_6_MONTHS">Last 6 months</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Applied: {appliedLabel}
            </p>
          </div>

          {/* Custom range pickers */}
          <div
            className={cn(
              "grid gap-4 lg:col-span-5 sm:grid-cols-2",
              rangePreset !== "CUSTOM" && "opacity-50 pointer-events-none",
            )}
          >
            <div className="space-y-2">
              <Label>From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <CalendarIcon size={16} />
                    {from ? format(from, "dd MMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={from}
                    onSelect={setFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <CalendarIcon size={16} />
                    {to ? format(to, "dd MMM yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <Calendar
                    mode="single"
                    selected={to}
                    onSelect={setTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2 lg:col-span-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v: any) => setType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="CREDIT">Cash In</SelectItem>
                <SelectItem value="DEBIT">Cash Out</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Source */}
          <div className="space-y-2 lg:col-span-2">
            <Label>Source</Label>
            <Select value={source} onValueChange={(v: any) => setSource(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="ADMISSION">Admission</SelectItem>
                <SelectItem value="INVESTMENT">Investment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="space-y-2 lg:col-span-12">
            <Label>Search</Label>
            <Input
              placeholder="Search by title (e.g., rent, projector, admission fee...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <Separator className="lg:col-span-12" />

          <div className="flex flex-wrap items-center justify-between gap-2 lg:col-span-12">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Range: {appliedLabel}</Badge>
              <Badge variant="secondary">Type: {type}</Badge>
              <Badge variant="secondary">Source: {source}</Badge>
              {query ? <Badge variant="secondary">Query: {query}</Badge> : null}
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setRangePreset("THIS_MONTH");
                setFrom(undefined);
                setTo(undefined);
                setType("ALL");
                setSource("ALL");
                setQuery("");
              }}
            >
              Reset filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Cash In
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-2xl font-semibold">
              {taka(mockSummary.totalCashIn)}
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10">
              CREDIT
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Cash Out
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-2xl font-semibold">
              {taka(mockSummary.totalCashOut)}
            </div>
            <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/10">
              DEBIT
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Net Revenue
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-2xl font-semibold">
              {taka(mockSummary.netRevenue)}
            </div>
            <Badge variant="secondary">CREDIT - DEBIT</Badge>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Admissions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div className="text-2xl font-semibold">
              {mockSummary.totalAdmissions}
            </div>
            <Badge variant="secondary">Students</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Tabs: report sections */}
      <Tabs defaultValue="cashflow" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:grid-cols-3">
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="admissions">Admissions</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Chart placeholder card */}
            <Card className="shadow-none lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Cash In vs Cash Out</CardTitle>
                <Badge variant="secondary">Last 6 months</Badge>
              </CardHeader>
              <CardContent>
                {/* Placeholder for chart */}
                <div className="grid gap-2">
                  {mockCashFlow.map((m) => (
                    <div key={m.month} className="rounded-lg border p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{ymLabel(m.month)}</span>
                        <span className="text-muted-foreground">
                          In: {taka(m.credit)} • Out: {taka(m.debit)}
                        </span>
                      </div>

                      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-foreground/20"
                          style={{
                            width: `${Math.min(100, (m.credit / Math.max(1, m.credit + m.debit)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Chart UI will be connected to your real bar chart component
                  later.
                </p>
              </CardContent>
            </Card>

            {/* Breakdown */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Top Expenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockTopExpenses.map((e) => (
                  <div
                    key={e.title}
                    className="flex items-start justify-between gap-3 rounded-lg border p-3"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{e.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(e.date), "dd MMM yyyy")}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                      {taka(e.amount)}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Admissions Tab */}
        <TabsContent value="admissions" className="space-y-4">
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Admissions Summary</CardTitle>
              <Badge variant="secondary">Coming from Student collection</Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">This range</p>
                  <p className="mt-1 text-xl font-semibold">41</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Avg / month</p>
                  <p className="mt-1 text-xl font-semibold">7</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Best month</p>
                  <p className="mt-1 text-xl font-semibold">Jan 2026</p>
                </div>
                <div className="rounded-xl border p-4">
                  <p className="text-xs text-muted-foreground">Worst month</p>
                  <p className="mt-1 text-xl font-semibold">Sep 2025</p>
                </div>
              </div>

              <div className="mt-4 rounded-xl border p-4 text-sm text-muted-foreground">
                We’ll plug in your line chart component here: last 6 months
                student admissions.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card className="shadow-none">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Recent Transactions</CardTitle>
              <Button variant="outline" size="sm">
                Export PDF
              </Button>
            </CardHeader>

            <CardContent>
              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRecentTransactions.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>
                          <Badge
                            className={cn(
                              t.type === "CREDIT"
                                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/10"
                                : "bg-rose-500/10 text-rose-700 dark:text-rose-300 hover:bg-rose-500/10",
                            )}
                          >
                            {t.type === "CREDIT" ? "Cash In" : "Cash Out"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {t.source === "ADMISSION"
                              ? "Admission"
                              : "Investment"}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{t.title}</TableCell>
                        <TableCell>
                          {format(new Date(t.date), "dd MMM yyyy")}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {taka(t.amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* <p className="mt-3 text-xs text-muted-foreground">
                Later we’ll connect this to <code>/api/admin/transactions</code>{" "}
                with pagination and filters.
              </p> */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
