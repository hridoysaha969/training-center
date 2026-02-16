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

export async function fetchOverviewData(): Promise<OverviewResponse | null> {
  try {
    const res = await fetch("/api/admin/overview", { cache: "no-store" });
    const json = (await res.json()) as OverviewResponse;

    if (res.status === 401 || res.status === 403) {
      return null;
    }

    if (!res.ok || !json.success || !json.data) {
      return null;
    }

    return json;
  } catch (error) {
    console.error("Error fetching overview data:", error);

    return null;
  }
}
