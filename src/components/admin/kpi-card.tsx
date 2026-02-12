"use client";

import {
  Landmark,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type MetricCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  delta?: number; // percentage change, e.g. 12.5 or -3.2
  invertTrend?: boolean;
};

function MetricCard({
  title,
  value,
  icon,
  delta,
  invertTrend = false,
}: MetricCardProps) {
  const isPositive = typeof delta === "number" && delta > 0;
  const isNegative = typeof delta === "number" && delta < 0;

  // Normal logic: positive = good (green)
  // Inverted logic: negative = good (green)
  const isGood = invertTrend ? isNegative : isPositive;

  return (
    <Card className="shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>

        {typeof delta === "number" && (
          <div
            className={[
              "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
              isGood
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
            ].join(" ")}
          >
            {delta > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}

            <span>
              {delta > 0 ? "+" : ""}
              {delta.toFixed(1)}%
            </span>

            <span className="text-muted-foreground inline-block lg:hidden!">
              vs last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

const KpiCard = () => {
  const stats = {
    monthlyAdmissions: 24,
    monthlyCashPaid: 18500,
    monthlyInvestment: 12000,
    monthlyRevenue: 6500,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Admissions"
        value={`${stats.monthlyAdmissions.toLocaleString("en-US")}`}
        delta={12.4}
        icon={<Users size={18} />}
      />

      <MetricCard
        title="Cash Paid"
        value={`৳ ${stats.monthlyCashPaid.toLocaleString("en-US")}`}
        delta={-6.2}
        icon={<Wallet size={18} />}
      />

      <MetricCard
        title="Investment"
        value={`৳ ${stats.monthlyInvestment.toLocaleString("en-US")}`}
        delta={5.3}
        icon={<Landmark size={18} />}
        invertTrend
      />

      <MetricCard
        title="Revenue"
        value={`৳ ${stats.monthlyRevenue.toLocaleString("en-US")}`}
        delta={17.2}
        icon={<TrendingUp size={18} />}
      />
    </div>
  );
};

export default KpiCard;
