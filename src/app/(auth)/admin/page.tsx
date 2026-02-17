import OverView from "@/components/admin/overview";
import { SidebarInset } from "@/components/ui/sidebar";

async function Admin() {
  return (
    <SidebarInset>
      <OverView />
    </SidebarInset>
  );
}

export default Admin;
