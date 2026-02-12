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

const overviewChartData = [
  { month: "Sep", credit: 42000, debit: 28000, admissions: 18 },
  { month: "Oct", credit: 46000, debit: 30000, admissions: 22 },
  { month: "Nov", credit: 38000, debit: 25000, admissions: 16 },
  { month: "Dec", credit: 52000, debit: 34000, admissions: 28 },
  { month: "Jan", credit: 61000, debit: 42000, admissions: 31 },
  { month: "Feb", credit: 56000, debit: 36000, admissions: 26 },
];

function Taka(v: number) {
  return `৳ ${v.toLocaleString("en-US")}`;
}

export default function OverviewCharts() {
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
                formatter={(value) => Taka(Number(value))}
                labelStyle={{ fontWeight: 600 }}
              />
              <Legend />
              <Bar
                dataKey="credit"
                name="Cash In (Credit)"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="debit"
                name="Cash Out (Debit)"
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
