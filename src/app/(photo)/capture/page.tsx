"use client";

import Link from "next/link";
import { Camera, FileText, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function AppHeader() {
  return (
    <div className="sticky top-0 z-20 border-b border-zinc-800/70 bg-zinc-950/70 backdrop-blur">
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-400">Admin Capture</p>
            <h1 className="text-lg font-semibold tracking-tight">
              Photo Uploader
            </h1>
          </div>

          <Badge variant="secondary" className="rounded-full gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Protected
          </Badge>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  desc,
  ratio,
  icon,
  href,
}: {
  title: string;
  desc: string;
  ratio: string;
  icon: React.ReactNode;
  href: string;
}) {
  return (
    <Card className="rounded-3xl border-zinc-800 bg-zinc-950">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="grid gap-1">
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-zinc-400">{desc}</p>
          </div>

          <div className="grid place-items-center rounded-2xl text-white border border-zinc-800 bg-zinc-900/40 p-3">
            {icon}
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-3">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/30 px-4 py-3">
          <div>
            <p className="text-xs text-zinc-400">Capture Ratio</p>
            <p className="text-sm font-medium">{ratio}</p>
          </div>
          <Badge
            variant="outline"
            className="rounded-full border-zinc-700 text-white"
          >
            Camera
          </Badge>
        </div>

        <Link href={href} className="w-full">
          <Button className="w-full rounded-2xl">Open Camera</Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function MobileHome() {
  return (
    <div className="min-h-dvh">
      <AppHeader />

      <div className="px-4 pb-6 pt-5">
        {/* Hero */}
        <div className="rounded-3xl border border-zinc-800 bg-linear-to-b from-zinc-900/30 to-zinc-950 p-5">
          <p className="text-xs text-zinc-400">Workflow</p>
          <h2 className="mt-1 text-base font-semibold">
            Capture → Preview → Submit
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            Optimized upload for Cloudinary (target under 500KB).
          </p>
        </div>

        {/* Actions */}
        <div className="mt-5 grid gap-4">
          <ActionCard
            title="Take Student Photo"
            desc="Passport-style portrait capture"
            ratio="3 : 4"
            href="/capture/student"
            icon={<Camera className="h-5 w-5" />}
          />

          <ActionCard
            title="Take Invoice Photo"
            desc="Document photo capture"
            ratio="5 : 7"
            href="/capture/invoice"
            icon={<FileText className="h-5 w-5" />}
          />
        </div>

        {/* Footer hint */}
        <p className="mt-6 text-center text-xs text-zinc-500">
          Tip: Use good lighting for sharper images & smaller file size.
        </p>
      </div>
    </div>
  );
}
