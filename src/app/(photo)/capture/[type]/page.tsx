"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Zap,
  ShieldAlert,
  Camera,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { optimizeImage } from "@/lib/image/optimize";
import { useCapture } from "@/contexts/capture-context";

type PermissionStateX = "granted" | "denied" | "prompt" | "unknown";

function ratioFor(type: string) {
  if (type === "invoice") return { label: "5 : 7", w: 5, h: 7 };
  return { label: "3 : 4", w: 3, h: 4 };
}

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
}

function isSafari() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  const isSafari = /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
  return isSafari;
}

function isIOSSafari() {
  return isIOS() && isSafari();
}

export default function CapturePage({ params }: { params: { type: string } }) {
  const { type } = useParams<{ type: string }>();

  const router = useRouter();
  const meta = useMemo(() => ratioFor(type), [type]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [facingMode, setFacingMode] = useState<"user" | "environment">(
    "environment",
  );
  const [torchOn, setTorchOn] = useState(false);

  const [perm, setPerm] = useState<PermissionStateX>("unknown");
  const [streamStarted, setStreamStarted] = useState(false);
  const [starting, setStarting] = useState(false);
  const [err, setErr] = useState<string>("");

  const iosSafari = useMemo(() => isIOSSafari(), []);
  const permissionsApiAvailable = useMemo(
    () => typeof navigator !== "undefined" && !!navigator.permissions?.query,
    [],
  );

  const { setCapture, clear } = useCapture();

  async function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStreamStarted(false);
  }

  async function checkPermission() {
    try {
      // If Permissions API is missing (common iOS Safari), treat as unknown
      // and rely on Start button + getUserMedia outcome.
      if (!navigator.permissions?.query) {
        setPerm("unknown");
        return;
      }

      const status = await navigator.permissions.query({ name: "camera" });
      setPerm((status.state as PermissionState) || "unknown");

      status.onchange = () => {
        setPerm((status.state as PermissionState) || "unknown");
      };
    } catch {
      setPerm("unknown");
    }
  }

  async function startStream(mode: "user" | "environment") {
    setStarting(true);
    setErr("");

    await stopStream();

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setErr("Camera API not supported on this browser.");
        setPerm("unknown");
        return;
      }

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

      setStreamStarted(true);
      setTorchOn(false);
      setPerm("granted");
    } catch (e: any) {
      const name = e?.name || "";

      if (name === "NotAllowedError" || name === "SecurityError") {
        setPerm("denied");
        setErr(
          iosSafari
            ? "Camera permission is blocked in Safari settings."
            : "Camera permission is blocked.",
        );
      } else if (name === "NotFoundError") {
        setErr("No camera device found.");
      } else {
        setErr(e?.message || "Failed to start camera.");
      }
    } finally {
      setStarting(false);
    }
  }

  async function toggleTorch() {
    try {
      const track = streamRef.current?.getVideoTracks()?.[0];
      if (!track) return;

      // torch is mostly Android Chrome; iOS Safari usually won’t support it
      const cap = track.getCapabilities?.();
      // @ts-expect-error
      if (!cap?.torch) return;

      // @ts-expect-error
      await track.applyConstraints({ advanced: [{ torch: !torchOn }] });
      setTorchOn((v) => !v);
    } catch {
      // ignore unsupported devices
    }
  }

  async function flipCamera() {
    const next = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    setTorchOn(false);
    await startStream(next);
  }

  // Crop center to target ratio + export fixed dimension
  function cropToRatio(
    img: HTMLImageElement,
    ratioW: number,
    ratioH: number,
    outH: number,
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const targetAR = ratioW / ratioH;
      const imgAR = iw / ih;

      let sx = 0,
        sy = 0,
        sw = iw,
        sh = ih;

      if (imgAR > targetAR) {
        sw = Math.round(ih * targetAR);
        sx = Math.round((iw - sw) / 2);
      } else {
        sh = Math.round(iw / targetAR);
        sy = Math.round((ih - sh) / 2);
      }

      const outW = Math.round(outH * targetAR);

      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, outW, outH);

      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Crop failed"))),
        "image/jpeg",
        0.92,
      );
    });
  }

  function captureFromVideoCropped(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const video = videoRef.current;
      if (!video) return reject(new Error("Video not ready"));

      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (!vw || !vh) return reject(new Error("Video metadata not ready"));

      const targetAR = meta.w / meta.h;
      const videoAR = vw / vh;

      let sx = 0,
        sy = 0,
        sw = vw,
        sh = vh;

      if (videoAR > targetAR) {
        sw = Math.round(vh * targetAR);
        sx = Math.round((vw - sw) / 2);
      } else {
        sh = Math.round(vw / targetAR);
        sy = Math.round((vh - sh) / 2);
      }

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
        (b) => (b ? resolve(b) : reject(new Error("Capture failed"))),
        "image/jpeg",
        0.92,
      );
    });
  }

  async function handleCapture() {
    setErr("");
    try {
      clear();

      const raw = await captureFromVideoCropped();

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

  // iOS Safari fallback: use file input capture
  async function handleFilePicked(file: File) {
    setErr("");
    try {
      clear();

      // Load picked image into <img> then crop to ratio + optimize
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const el = new Image();
        el.onload = () => {
          URL.revokeObjectURL(url);
          resolve(el);
        };
        el.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error("Failed to load image"));
        };
        el.src = url;
      });

      const outH = type === "invoice" ? 2000 : 1200;
      const cropped = await cropToRatio(img, meta.w, meta.h, outH);

      const maxLongSide = type === "invoice" ? 2200 : 1200;
      const optimized = await optimizeImage(cropped, {
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
      setErr(e?.message || "Failed to use camera fallback.");
    }
  }

  useEffect(() => {
    checkPermission();
    return () => {
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-start if already granted (non-iOS Safari mostly)
  useEffect(() => {
    if (perm === "granted" && !streamStarted) {
      startStream(facingMode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perm]);

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

      {/* Hidden iOS capture input */}
      <input
        ref={fileInputRef}
        className="hidden"
        type="file"
        accept="image/*"
        capture={facingMode === "environment" ? "environment" : "user"}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFilePicked(f);
          // reset so selecting same image again triggers change
          e.currentTarget.value = "";
        }}
      />

      {/* Permission / Start screen */}
      {!streamStarted ? (
        <div className="flex min-h-[calc(100dvh-64px)] items-center justify-center px-4">
          <div className="w-full max-w-105 rounded-3xl border border-white/10 bg-white/5 p-5">
            {perm === "denied" ? (
              <>
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/10">
                    <ShieldAlert className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-semibold">
                      Camera permission blocked
                    </h2>
                    <p className="mt-1 text-sm text-zinc-300">
                      {iosSafari
                        ? "Enable camera access in iPhone Settings, or use the fallback capture."
                        : "Enable camera access in your browser settings, then try again."}
                    </p>
                  </div>
                </div>

                {iosSafari ? (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">
                    <p className="font-medium">iPhone fix</p>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-zinc-300">
                      <li>Open iPhone Settings</li>
                      <li>Safari → Camera → Allow</li>
                      <li>Go back and reload this page</li>
                    </ol>
                  </div>
                ) : (
                  <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-200">
                    <p className="font-medium">How to fix</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-zinc-300">
                      <li>Open site settings → Camera → Allow</li>
                      <li>Reload the page and try again</li>
                    </ul>
                  </div>
                )}

                {err ? (
                  <p className="mt-3 text-sm text-red-200">{err}</p>
                ) : null}

                <div className="mt-4 grid gap-3">
                  <Button
                    onClick={() => startStream(facingMode)}
                    className="w-full rounded-2xl"
                    disabled={starting}
                  >
                    {starting ? "Starting…" : "Try again"}
                  </Button>

                  {/* iOS fallback button */}
                  {iosSafari ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full rounded-2xl bg-white/10 text-white hover:bg-white/15"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Use iPhone Camera (fallback)
                    </Button>
                  ) : null}

                  <Link href="/" className="block">
                    <Button
                      variant="secondary"
                      className="w-full rounded-2xl bg-white/10 text-white hover:bg-white/15"
                    >
                      Back
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/10">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-base font-semibold">Start Camera</h2>
                    <p className="mt-1 text-sm text-zinc-300">
                      We’ll request camera permission to capture and optimize
                      the photo (under 500KB).
                    </p>
                    {iosSafari && !permissionsApiAvailable ? (
                      <p className="mt-2 text-xs text-zinc-400">
                        iOS Safari note: permission status may not show here. If
                        the camera doesn’t start, use the fallback capture.
                      </p>
                    ) : null}
                  </div>
                </div>

                {err ? (
                  <p className="mt-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    {err}
                  </p>
                ) : null}

                <div className="mt-4 grid gap-3">
                  <Button
                    onClick={() => startStream(facingMode)}
                    className="w-full rounded-2xl"
                    disabled={starting}
                  >
                    {starting ? "Starting…" : "Start camera"}
                  </Button>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="secondary"
                      className="w-full rounded-2xl bg-white/10 text-white hover:bg-white/15"
                      onClick={() =>
                        setFacingMode((m) =>
                          m === "environment" ? "user" : "environment",
                        )
                      }
                      disabled={starting}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Switch
                    </Button>

                    <Link href="/" className="block">
                      <Button
                        variant="secondary"
                        className="w-full rounded-2xl bg-white/10 text-white hover:bg-white/15"
                        disabled={starting}
                      >
                        Cancel
                      </Button>
                    </Link>
                  </div>

                  {/* iOS fallback always available */}
                  {iosSafari ? (
                    <Button
                      type="button"
                      variant="secondary"
                      className="w-full rounded-2xl bg-white/10 text-white hover:bg-white/15"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Use iPhone Camera (fallback)
                    </Button>
                  ) : null}
                </div>

                <p className="mt-4 text-center text-xs text-zinc-400">
                  Works on HTTPS (and localhost in dev).
                </p>
              </>
            )}
          </div>
        </div>
      ) : (
        // Live camera UI
        <div className="relative flex min-h-[calc(100dvh-64px)] items-center justify-center px-4 pb-28 pt-6">
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

                {/* Overlay */}
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
              </div>
            </div>

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

              <Button
                type="button"
                variant="secondary"
                className="rounded-2xl bg-white/10 text-white hover:bg-white/15"
                onClick={stopStream}
              >
                Stop
              </Button>
            </div>

            {iosSafari ? (
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-zinc-300">
                If the live camera freezes on iOS Safari, use{" "}
                <span className="font-medium">fallback capture</span> from the
                start screen.
              </div>
            ) : null}
          </div>

          {/* Bottom shutter */}
          <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-black/70 px-4 pb-6 pt-4 backdrop-blur">
            <div className="mx-auto flex max-w-105 items-center justify-center">
              <button
                onClick={handleCapture}
                className="group relative h-16 w-16 rounded-full border-2 border-white/70 bg-white/10 shadow-[0_0_0_10px_rgba(255,255,255,0.06)] transition active:scale-95"
                aria-label="Capture"
                type="button"
              >
                <span className="absolute inset-2 rounded-full bg-white/80 transition group-active:bg-white" />
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-zinc-400">
              Captures and auto-optimizes under 500KB before upload.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}