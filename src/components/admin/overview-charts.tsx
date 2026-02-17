"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";



function taka(n: number | undefined | null) {
  if (typeof n !== "number") return "৳ 0";
  return `৳ ${n.toLocaleString("en-US")}`;
}

export default function OverviewCharts({ charts }: { charts: any }) {
  const overviewChartData = charts
    ? charts.cashInOutLast6Months.map((item: any, index: number) => ({
        month: item.month,
        credit: item.credit,
        debit: item.debit,
        admissions: charts.admissionsLast6Months[index]?.count || 0,
      }))
    : [];

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Cash In vs Cash Out */}
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-base">Earning vs Investment</CardTitle>
          <p className="text-xs text-muted-foreground">Last 6 months</p>
        </CardHeader>

        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={overviewChartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={60}
                tickFormatter={(v) => `${Math.round(v / 1000)}k`}
              />
              <Tooltip
                formatter={(value) => taka(Number(value))}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend />
              <Bar
                dataKey="credit"
                name="Cash In (Credit)"
                fill="#4DA3F2"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="debit"
                name="Cash Out (Debit)"
                fill="#6C63F6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Admissions Trend */}
      <Card className="shadow-2xl">
        <CardHeader>
          <CardTitle className="text-base">Admissions Trend</CardTitle>
          <p className="text-xs text-muted-foreground">Last 6 months</p>
        </CardHeader>

        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overviewChartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={40} />
              <Tooltip labelStyle={{ fontWeight: 600 }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="admissions"
                name="Admissions"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
