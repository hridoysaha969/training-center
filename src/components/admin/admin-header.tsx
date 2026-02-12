"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { signOut } from "next-auth/react";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="text-sm font-semibold">Dashboard</span>
      </div>

      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="rounded-lg border px-3 py-1.5 text-sm font-medium hover:bg-accent"
      >
        Logout
      </button>
    </header>
  );
}
