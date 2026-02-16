"use client";

import { useEffect, useMemo, useState } from "react";
import KpiCard from "./kpi-card";
import OverviewTables from "./oerview-tables";
import OverviewCharts from "./overview-charts";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";

type OverviewResponse = {
  success: boolean;
  message?: string;
  data?: {
    kpis: {
      monthlyAdmissionsCount: number;
      monthlyCashIn: number;
      monthlyCashOut: number;
      monthlyRevenue: number;
    };
    deltas: {
      admissions: number;
      cashIn: number;
      cashOut: number;
      revenue: number;
    };
    charts: {
      cashInOutLast6Months: Array<{
        month: string;
        credit: number;
        debit: number;
      }>;
      admissionsLast6Months: Array<{ month: string; count: number }>;
    };
  };
};

const OverView = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<
    NonNullable<OverviewResponse["data"]>["kpis"] | null
  >(null);

  const [charts, setCharts] = useState<
    NonNullable<OverviewResponse["data"]>["charts"] | null
  >(null);
  const [deltas, setDeltas] = useState<
    NonNullable<OverviewResponse["data"]>["deltas"] | null
  >(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/overview", { cache: "no-store" });
        const json = (await res.json()) as OverviewResponse;

        if (res.status === 401 || res.status === 403) {
          toast.error("Unauthorized. Please login again.");
          router.push("/admin/login");
          return;
        }

        if (!res.ok || !json.success || !json.data) {
          toast.error(json.message || "Failed to load overview");
          return;
        }

        setKpis(json.data.kpis);
        setCharts(json.data.charts);
        setDeltas(json.data.deltas);
      } catch {
        toast.error("Network error while loading overview");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const safeKpis = useMemo(() => {
    return (
      kpis ?? {
        monthlyAdmissionsCount: 0,
        monthlyCashIn: 0,
        monthlyCashOut: 0,
        monthlyRevenue: 0,
      }
    );
  }, [kpis]);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {loading ? (
        <>
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
          <Skeleton className="h-28 rounded-2xl" />
        </>
      ) : (
        <KpiCard kpis={safeKpis} deltas={deltas} />
      )}

      {loading ? (
        <>
          <Skeleton className="h-90 rounded-2xl" />
          <Skeleton className="h-90 rounded-2xl" />
        </>
      ) : (
        <>
          <OverviewCharts charts={charts} />
          <OverviewTables />
        </>
      )}
    </div>
  );
};

export default OverView;
