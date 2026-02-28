"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCapture } from "@/contexts/capture-context";

function ratioLabel(type: string) {
  return type === "invoice" ? "5 : 7" : "3 : 4";
}

export default function PreviewPage({ params }: { params: { type: string } }) {
  const { type } = useParams<{ type: string }>();

  const router = useRouter();
  const { file, previewUrl, clear } = useCapture();
  const label = ratioLabel(type);

  async function submit() {
    if (!file) return;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("type", type === "invoice" ? "INVOICE" : "STUDENT");

    const res = await fetch("/api/photos/upload", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    if (!res.ok || !data?.success) {
      alert(data?.message || "Upload failed");
      return;
    }

    clear();
    router.push("/capture"); // later you can route to list page / success screen
  }

  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800/70 bg-zinc-950/70 px-3 py-3 backdrop-blur">
        <Link href={`/capture/${type}`} className="inline-flex">
          <Button variant="ghost" size="icon" className="rounded-2xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="text-center">
          <p className="text-xs text-zinc-400">Preview</p>
          <p className="text-sm font-medium capitalize">
            {type === "invoice" ? "Invoice" : "Student"} Photo
          </p>
        </div>

        <Badge variant="outline" className="rounded-full border-zinc-700">
          {label}
        </Badge>
      </div>

      <div className="px-4 py-5">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/20 p-3">
          <div
            className="w-full overflow-hidden rounded-2xl border border-zinc-800 bg-black"
            style={{
              aspectRatio: type === "invoice" ? "5 / 7" : "3 / 4",
            }}
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Captured preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center">
                <p className="text-xs text-zinc-400">
                  No photo found. Please capture again.
                </p>
              </div>
            )}
          </div>

          <div className="mt-3 grid gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">File Size</p>
              <p className="text-xs font-medium">
                {file ? `${Math.round(file.size / 1024)} KB` : "-"}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-zinc-400">Target</p>
              <p className="text-xs font-medium">Under 500KB</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <Link href={`/capture/${type}`} className="block">
            <Button
              onClick={() => clear()}
              variant="secondary"
              className="w-full rounded-2xl"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Retake
            </Button>
          </Link>

          <Button
            onClick={submit}
            className="w-full rounded-2xl"
            disabled={!file}
          >
            <UploadCloud className="mr-2 h-4 w-4" />
            Submit Photo
          </Button>
        </div>
      </div>
    </div>
  );
}
