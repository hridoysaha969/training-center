"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RefreshCw, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { optimizeImage } from "@/lib/image/optimize";
import { useCapture } from "@/contexts/capture-context";

function ratioFor(type: string) {
  if (type === "invoice") return { label: "5 : 7", w: 5, h: 7 };
  return { label: "3 : 4", w: 3, h: 4 };
}

export default function CapturePage({ params }: { params: { type: string } }) {
  const { type } = useParams<{ type: string }>();
  const router = useRouter();
  const meta = useMemo(() => ratioFor(type), [type]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [torchOn, setTorchOn] = useState(false);
  const [starting, setStarting] = useState(true);
  const [err, setErr] = useState<string>("");

  const { setCapture, clear } = useCapture();

  async function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  async function startStream(mode: "user" | "environment") {
    setStarting(true);
    setErr("");

    await stopStream();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (e: any) {
      setErr(
        e?.message ||
          "Camera access failed. Please allow permission and try again.",
      );
    } finally {
      setStarting(false);
    }
  }

  async function toggleTorch() {
    try {
      const track = streamRef.current?.getVideoTracks()?.[0];
      if (!track) return;

      // torch is not supported everywhere (mostly Android Chrome)

      const cap = track.getCapabilities?.();
      // @ts-expect-error - not in TS lib
      if (!cap?.torch) return;

      // @ts-expect-error - not in TS lib
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn((v) => !v);
    } catch {
      // silently ignore (device/browser limitation)
    }
  }

  function captureToBlobCropped(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const video = videoRef.current;
      if (!video) return reject(new Error("Video not ready"));

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return reject(new Error("Video metadata not ready"));

      // Crop to target aspect ratio from the *center* of video frame
      const targetAR = meta.w / meta.h;
      const videoAR = vw / vh;

      let sx = 0,
        sy = 0,
        sw = vw,
        sh = vh;

      if (videoAR > targetAR) {
        // too wide -> crop width
        sw = Math.round(vh * targetAR);
        sx = Math.round((vw - sw) / 2);
      } else {
        // too tall -> crop height
        sh = Math.round(vw / targetAR);
        sy = Math.round((vh - sh) / 2);
      }

      // Output size (passport-like): student smaller, invoice bigger
      const outH = type === "invoice" ? 2000 : 1200;
      const outW = Math.round(outH * targetAR);

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(video, sx, sy, sw, sh, 0, 0, outW, outH);

      canvas.toBlob(
        (b) => {
          if (!b) return reject(new Error("Capture failed"));
          resolve(b);
        },
        "image/jpeg",
        0.92,
      );
    });
  }

  async function handleCapture() {
    setErr("");
    try {
      clear();

      const raw = await captureToBlobCropped();

      const maxLongSide = type === "invoice" ? 2200 : 1200;
      const optimized = await optimizeImage(raw, {
        maxBytes: 500 * 1024,
        maxLongSide,
        initialQuality: 0.84,
      });

      const previewUrl = URL.createObjectURL(optimized);

      setCapture({
        type: type === "invoice" ? "invoice" : "student",
        file: optimized,
        previewUrl,
      });

      router.push(`/preview/${type}`);
    } catch (e: any) {
      setErr(e?.message || "Capture failed. Please try again.");
    }
  }

  async function flipCamera() {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    setTorchOn(false);
    await startStream(next);
  }

  useEffect(() => {
    // start camera on mount
    startStream(facingMode);

    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-dvh bg-black">
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-black/60 px-3 py-3 backdrop-blur">
        <Link href="/capture" className="inline-flex">
          <Button variant="ghost" size="icon" className="rounded-2xl">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>

        <div className="text-center">
          <p className="text-xs text-zinc-400">Camera</p>
          <p className="text-sm font-medium capitalize">
            {type === "invoice" ? "Invoice" : "Student"} Capture
          </p>
        </div>

        <Badge
          variant="outline"
          className="rounded-full border-white/20 text-white"
        >
          {meta.label}
        </Badge>
      </div>

      <div className="relative flex min-h-[calc(100dvh-64px)] items-center justify-center px-4 pb-28 pt-6">
        {/* Live video */}
        <div className="relative z-10 w-full max-w-105">
          <div className="relative mx-auto overflow-hidden rounded-3xl border border-white/15 bg-black">
            <div
              className="relative w-full"
              style={{ aspectRatio: `${meta.w} / ${meta.h}` }}
            >
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Grid + vignette */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute inset-0 opacity-35">
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div key={i} className="border border-white/10" />
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 shadow-[inset_0_0_90px_rgba(0,0,0,0.75)]" />
              </div>

              {starting && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="rounded-2xl border border-white/15 bg-black/50 px-4 py-2 text-xs text-zinc-200 backdrop-blur">
                    Starting camera…
                  </div>
                </div>
              )}
            </div>
          </div>

          {err ? (
            <div className="mt-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {err}
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between gap-3">
            <Button
              type="button"
              onClick={flipCamera}
              variant="secondary"
              className="flex-1 rounded-2xl bg-white/10 text-white hover:bg-white/15"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Flip
            </Button>

            <Button
              type="button"
              onClick={toggleTorch}
              variant="secondary"
              className="flex-1 rounded-2xl bg-white/10 text-white hover:bg-white/15"
            >
              <Zap className="mr-2 h-4 w-4" />
              {torchOn ? "Torch On" : "Torch"}
            </Button>
          </div>
        </div>

        {/* Bottom shutter */}
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/70 px-4 pb-6 pt-4 backdrop-blur">
          <div className="mx-auto flex max-w-105 items-center justify-center">
            <button
              onClick={handleCapture}
              className="group relative h-16 w-16 rounded-full border-2 border-white/70 bg-white/10 shadow-[0_0_0_10px_rgba(255,255,255,0.06)] transition active:scale-95 disabled:opacity-50"
              aria-label="Capture"
              type="button"
              disabled={starting || !!err}
            >
              <span className="absolute inset-2 rounded-full bg-white/80 transition group-active:bg-white" />
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-zinc-400">
            Captures and auto-optimizes under 500KB before upload.
          </p>
        </div>
      </div>
    </div>
  );
}
