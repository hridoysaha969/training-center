import { AppSidebar } from "@/components/admin/admin-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import ThemeToggle from "@/components/ui/theme-toggle";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

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
        {session?.user && (
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
        )}
        {children}
      </div>
    </SidebarProvider>
  );
}
