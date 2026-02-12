import KpiCard from "@/components/admin/kpi-card";
import OverviewTables from "@/components/admin/oerview-tables";
import OverviewCharts from "@/components/admin/overview-charts";
import { SidebarInset } from "@/components/ui/sidebar";

async function Admin() {
  return (
    <SidebarInset>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <KpiCard />

        <OverviewCharts />
        <OverviewTables />
      </div>
    </SidebarInset>
  );
}

export default Admin;
