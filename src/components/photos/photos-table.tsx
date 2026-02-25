"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Copy,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner"; // if you already use sonner/toast in project

type PhotoRow = {
  id: string;
  type: "STUDENT" | "INVOICE";
  url: string;
  publicId: string;
  bytes: number;
  width: number;
  height: number;
  format: string;
  createdAt: string;
};

function kb(n: number) {
  return `${Math.round(n / 1024)} KB`;
}

function dt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function copyText(text: string) {
  // Clipboard API requires HTTPS (or localhost)
  await navigator.clipboard.writeText(text);
}

export default function DesktopPhotosTable() {
  const [type, setType] = useState<"ALL" | "STUDENT" | "INVOICE">("ALL");
  const [rows, setRows] = useState<PhotoRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const typeParam = useMemo(() => {
    if (type === "ALL") return "";
    return type;
  }, [type]);

  async function fetchFirst() {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (typeParam) qs.set("type", typeParam);
      qs.set("limit", "30");

      const res = await fetch(`/api/photos?${qs.toString()}`);
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to fetch");
      }

      setRows(data.items || []);
      setCursor(data.nextCursor || null);
      setHasMore(Boolean(data.nextCursor));
    } catch (e: any) {
      toast?.error?.(e?.message || "Failed to load photos");
    } finally {
      setLoading(false);
    }
  }

  async function loadMore() {
    if (!cursor) return;
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (typeParam) qs.set("type", typeParam);
      qs.set("limit", "30");
      qs.set("cursor", cursor);

      const res = await fetch(`/api/photos?${qs.toString()}`);
      const data = await res.json();

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Failed to fetch");
      }

      setRows((prev) => [...prev, ...(data.items || [])]);
      setCursor(data.nextCursor || null);
      setHasMore(Boolean(data.nextCursor));
    } catch (e: any) {
      toast?.error?.(e?.message || "Failed to load more");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  return (
    <div className="w-full max-w-6xl">
      <Card className="rounded-2xl border-zinc-800 bg-zinc-950">
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div className="grid gap-1">
            <CardTitle className="text-lg">Uploaded Photos</CardTitle>
            <p className="text-sm text-zinc-400">
              Copy Cloudinary URLs for desktop usage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Tabs
              value={type}
              onValueChange={(v) => setType(v as any)}
              className="hidden md:block"
            >
              <TabsList className="bg-zinc-900/40 ">
                <TabsTrigger
                  value="ALL"
                  className="text-zinc-400 hover:text-zinc-300"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="STUDENT"
                  className="text-zinc-400 hover:text-zinc-300"
                >
                  Student
                </TabsTrigger>
                <TabsTrigger
                  value="INVOICE"
                  className="text-zinc-400 hover:text-zinc-300"
                >
                  Invoice
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              onClick={fetchFirst}
              variant="secondary"
              className="rounded-xl bg-zinc-900/40 text-zinc-400 hover:bg-transparent"
              disabled={loading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-hidden rounded-2xl border border-zinc-800">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-30 text-zinc-300">Type</TableHead>
                  <TableHead className="text-zinc-300">URL</TableHead>
                  <TableHead className="w-30 text-zinc-300">Size</TableHead>
                  <TableHead className="w-35 text-zinc-300">Created</TableHead>
                  <TableHead className="w-42.5 text-zinc-300" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center">
                      <div className="inline-flex items-center gap-2 text-zinc-400">
                        <ImageIcon className="h-4 w-4" />
                        No uploads found.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((r) => (
                    <TableRow key={r.id} className="hover:bg-transparent">
                      <TableCell>
                        <Badge
                          variant={
                            r.type === "STUDENT" ? "secondary" : "outline"
                          }
                          className="rounded-full"
                        >
                          {r.type}
                        </Badge>
                      </TableCell>

                      <TableCell className="max-w-130">
                        <div className="truncate font-medium text-zinc-500">
                          {r.url}
                        </div>
                        <div className="mt-1 text-xs text-zinc-500">
                          {r.width}×{r.height} • {r.format}
                        </div>
                      </TableCell>

                      <TableCell className="text-zinc-300">
                        {kb(r.bytes)}
                      </TableCell>

                      <TableCell className="text-xs text-zinc-400">
                        {dt(r.createdAt)}
                      </TableCell>

                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            className="rounded-full py-2.5 px-3 text-xs"
                            onClick={async () => {
                              try {
                                await copyText(r.url);
                                toast?.success?.("Copied URL");
                              } catch {
                                toast?.error?.(
                                  "Copy failed. Use HTTPS or copy manually.",
                                );
                              }
                            }}
                          >
                            <Copy className="mr-0.5 h-3 w-3" />
                            Copy
                          </Button>

                          <a href={r.url} target="_blank" rel="noreferrer">
                            <Button
                              variant="outline"
                              className="rounded-xl border-zinc-700"
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open
                            </Button>
                          </a>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-zinc-500">
              Tip: Copy works only on HTTPS (or localhost).
            </p>

            {hasMore ? (
              <Button
                onClick={loadMore}
                variant="secondary"
                className="rounded-xl bg-zinc-900/40"
                disabled={loading}
              >
                {loading ? "Loading..." : "Load more"}
              </Button>
            ) : (
              <span className="text-xs text-zinc-500">End of list</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
