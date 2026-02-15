"use client";
import * as React from "react";
import {
  BookOpen,
  Bot,
  Frame,
  Layers,
  LayoutDashboard,
  LineChart,
  Map,
  PieChart,
  Plus,
  Receipt,
  Settings2,
  SquareTerminal,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Session } from "next-auth";

const sidebarLinks = {
  operations: [
    {
      title: "Overview",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Addmission",
      url: "/admin/admission",
      icon: Plus,
    },
    {
      title: "Students",
      url: "/admin/students",
      icon: Users,
    },
    {
      title: "Batches",
      url: "/admin/batches",
      icon: Layers,
    },
  ],

  financeAdmin: [
    {
      title: "Transactions",
      url: "/admin/transactions",
      icon: Receipt,
    },
    {
      title: "Investments",
      url: "/admin/investments",
      icon: Wallet,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: LineChart,
    },
    {
      title: "Manage Staff",
      url: "/admin/staff",
      icon: UserCog,
      role: "SUPER_ADMIN", // optional role restriction
    },
  ],
};

type AuthUser = Session["user"] & {
  role?: "SUPER_ADMIN" | "ADMIN" | "STAFF";
};

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user?: AuthUser;
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  if (!user) return null;

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* DONE: SIDEBAR HEADER */}
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain operations={sidebarLinks.operations} />
        <NavProjects
          financeAdmin={sidebarLinks.financeAdmin}
          currentRole={user?.role || "STAFF"}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
