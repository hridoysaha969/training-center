"use client";

import { MoreHorizontal, type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

export function NavProjects({
  financeAdmin,
  currentRole,
}: {
  financeAdmin: {
    title: string;
    url: string;
    icon: LucideIcon;
    role?: string;
  }[];
  currentRole: string;
}) {
  const visibleLinks = financeAdmin.filter(
    (item) => !item.role || item.role === currentRole,
  );

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Finance & Admin</SidebarGroupLabel>
      <SidebarMenu>
        {visibleLinks.map((item, ind) => (
          <SidebarMenuItem key={ind}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <item.icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
