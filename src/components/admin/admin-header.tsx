"use client";

import { Session } from "next-auth";
import { Separator } from "../ui/separator";
import { Sidebar, SidebarTrigger } from "../ui/sidebar";
import ThemeToggle from "../ui/theme-toggle";
import { useSession } from "next-auth/react";

type AuthUser = Session["user"] & {
  role?: "SUPER_ADMIN" | "ADMIN" | "STAFF";
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: AuthUser;
};

const AdminHeader = ({ user, ...props }: AppSidebarProps) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return null; // or a loading spinner
  }
  if (!session || !session.user) {
    return null; // or a placeholder for unauthenticated users
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default AdminHeader;
