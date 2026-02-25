import DesktopPhotosTable from "@/components/photos/photos-table";
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
        <DesktopPhotosTable />
      </div>
    </div>
  );
}
