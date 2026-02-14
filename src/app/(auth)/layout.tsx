import AdminHeader from "@/components/admin/admin-header";
import { AppSidebar } from "@/components/admin/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ui/theme-toggle";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <SidebarProvider>
      {session?.user && <AppSidebar user={session?.user} />}

      <div className="flex-1">
        {session?.user && <AdminHeader />}
        {children}
      </div>
    </SidebarProvider>
  );
}
