import { getMonthlyRanges, lastNMonthsKeys } from "@/lib/dateRange";
import { connectDB } from "@/lib/mongodb";
import { requireRole } from "@/lib/rbac";
import { LedgerTransaction } from "@/models/LedgerTransaction";
import { Student } from "@/models/Student";
import { NextResponse } from "next/server";

function calcDelta(current: number, previous: number) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export async function GET() {
  const admin = await requireRole(["SUPER_ADMIN", "ADMIN", "STAFF"]);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  await connectDB();

  const now = new Date();
  const { thisMonthStart, nextMonthStart, sixMonthsAgoStart } =
    getMonthlyRanges(now);
  const lastMonthStart = new Date(thisMonthStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

  const monthKeys = lastNMonthsKeys(6, now); // ordered old -> new

  // -----------------------
  // KPI: Admissions count (this month)
  // -----------------------
  const monthlyAdmissionsCount = await Student.countDocuments({
    admissionDate: { $gte: thisMonthStart, $lt: nextMonthStart },
  });
  const lastMonthAdmissionsCount = await Student.countDocuments({
    admissionDate: { $gte: lastMonthStart, $lt: thisMonthStart },
  });

  // -----------------------
  // KPI: Cash In/Out (this month) from ledger
  // -----------------------
  const monthlyLedgerAgg = await LedgerTransaction.aggregate([
    {
      $match: { date: { $gte: thisMonthStart, $lt: nextMonthStart } },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const monthlyCashIn =
    monthlyLedgerAgg.find((x) => x._id === "CREDIT")?.total ?? 0;

  const monthlyCashOut =
    monthlyLedgerAgg.find((x) => x._id === "DEBIT")?.total ?? 0;

  const lastMonthLedgerAgg = await LedgerTransaction.aggregate([
    {
      $match: { date: { $gte: lastMonthStart, $lt: thisMonthStart } },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const lastMonthCashIn =
    lastMonthLedgerAgg.find((x) => x._id === "CREDIT")?.total ?? 0;

  const lastMonthCashOut =
    lastMonthLedgerAgg.find((x) => x._id === "DEBIT")?.total ?? 0;

  const monthlyRevenue = monthlyCashIn - monthlyCashOut;

  const lastMonthRevenue = lastMonthCashIn - lastMonthCashOut;

  const deltas = {
    admissions: calcDelta(monthlyAdmissionsCount, lastMonthAdmissionsCount),
    cashIn: calcDelta(monthlyCashIn, lastMonthCashIn),
    cashOut: calcDelta(monthlyCashOut, lastMonthCashOut),
    revenue: calcDelta(monthlyRevenue, lastMonthRevenue),
  };

  // -----------------------
  // Chart: Cash In vs Cash Out (last 6 months)
  // -----------------------
  const cashSeriesAgg = await LedgerTransaction.aggregate([
    {
      $match: { date: { $gte: sixMonthsAgoStart, $lt: nextMonthStart } },
    },
    {
      $addFields: {
        ym: {
          $dateToString: { format: "%Y-%m", date: "$date" },
        },
      },
    },
    {
      $group: {
        _id: { ym: "$ym", type: "$type" },
        total: { $sum: "$amount" },
      },
    },
  ]);

  // Normalize into fixed 6-month list (so chart never breaks)
  const cashInOutLast6Months = monthKeys.map((ym) => {
    const credit =
      cashSeriesAgg.find((r) => r._id.ym === ym && r._id.type === "CREDIT")
        ?.total ?? 0;

    const debit =
      cashSeriesAgg.find((r) => r._id.ym === ym && r._id.type === "DEBIT")
        ?.total ?? 0;

    return { month: ym, credit, debit };
  });

  // -----------------------
  // Chart: Student admission last 6 months
  // -----------------------
  const admissionsAgg = await Student.aggregate([
    {
      $match: {
        admissionDate: { $gte: sixMonthsAgoStart, $lt: nextMonthStart },
      },
    },
    {
      $addFields: {
        ym: {
          $dateToString: { format: "%Y-%m", date: "$admissionDate" },
        },
      },
    },
    {
      $group: {
        _id: "$ym",
        count: { $sum: 1 },
      },
    },
  ]);

  const admissionsLast6Months = monthKeys.map((ym) => {
    const count = admissionsAgg.find((r) => r._id === ym)?.count ?? 0;
    return { month: ym, count };
  });

  return NextResponse.json({
    success: true,
    data: {
      kpis: {
        monthlyAdmissionsCount,
        monthlyCashIn,
        monthlyCashOut,
        monthlyRevenue,
      },
      deltas,
      charts: {
        cashInOutLast6Months,
        admissionsLast6Months,
      },
    },
  });
}
