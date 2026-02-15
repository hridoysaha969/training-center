import { Hourglass } from "lucide-react";

const page = () => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold">Reports</h1>
      <p className="text-sm text-muted-foreground">
        This is the reports page. You can add charts and KPIs here.
      </p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Example KPI */}
        <div className="p-4 rounded shadow flex items-center gap-4 bg-muted">
          <div>
            <h2 className="text-lg font-medium">
              Reports will be generated here soon!
            </h2>
            <p className="text-sm text-muted-foreground">
              You can show charts, tables, and key metrics here.
            </p>
          </div>

          <Hourglass className="w-6 h-6 text-muted-foreground" />
        </div>
        {/* Add more KPIs and charts as needed */}
      </div>
    </div>
  );
};

export default page;
