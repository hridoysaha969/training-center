import AdminHeader from "@/components/admin/admin-header";
import { AppSidebar } from "@/components/admin/admin-sidebar";
import { AdminHomeShortcutWrapper } from "@/components/admin/AdminHomeShortcutWrapper";
import { SidebarProvider } from "@/components/ui/sidebar";
import SessionProviderWrapper from "@/contexts/SessionProviderWrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminHomeShortcutWrapper>
      <SidebarProvider>
        <SessionProviderWrapper>
          <AppSidebar />

          <div className="flex-1">
            <AdminHeader />
            {children}
          </div>
        </SessionProviderWrapper>
      </SidebarProvider>
    </AdminHomeShortcutWrapper>
  );
}
