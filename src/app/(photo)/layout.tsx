import { CaptureProvider } from "@/contexts/capture-context";
import type { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-50">
      {/* Mobile app container */}
      <div className="mx-auto min-h-dvh w-full max-w-120 lg:hidden">
        <CaptureProvider>{children}</CaptureProvider>
      </div>

      {/* Desktop placeholder (you'll define later) */}
      <div className="hidden min-h-dvh items-center justify-center lg:flex">
        <div className="max-w-xl rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-center">
          <h2 className="text-xl font-semibold">Desktop View</h2>
          <p className="mt-2 text-sm text-zinc-400">
            This app is optimized for mobile capture. Desktop will show uploaded
            photos (gallery/URLs) later.
          </p>
        </div>
      </div>
    </div>
  );
}
