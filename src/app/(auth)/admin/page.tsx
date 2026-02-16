import KpiCard from "@/components/admin/kpi-card";
import OverviewTables from "@/components/admin/oerview-tables";
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
