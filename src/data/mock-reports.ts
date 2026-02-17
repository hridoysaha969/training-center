export const mockSummary = {
  totalCashIn: 152000,
  totalCashOut: 93000,
  netRevenue: 59000,
  totalAdmissions: 41,
};

export const mockCashFlow = [
  { month: "2025-09", credit: 18000, debit: 9000 },
  { month: "2025-10", credit: 25000, debit: 12000 },
  { month: "2025-11", credit: 21000, debit: 10000 },
  { month: "2025-12", credit: 32000, debit: 20000 },
  { month: "2026-01", credit: 26000, debit: 15000 },
  { month: "2026-02", credit: 30000, debit: 27000 },
];

export const mockTopExpenses = [
  { title: "Projector Purchase", amount: 25000, date: "2026-02-10" },
  { title: "Office Rent", amount: 18000, date: "2026-02-01" },
  { title: "Electricity Bill", amount: 6200, date: "2026-02-05" },
  { title: "Marketing (FB Ads)", amount: 5200, date: "2026-01-23" },
  { title: "Internet Bill", amount: 1500, date: "2026-01-18" },
];

export const mockRecentTransactions = [
  {
    id: "t1",
    type: "CREDIT",
    source: "ADMISSION",
    title: "Admission fee - Basic Computer",
    amount: 3500,
    date: "2026-02-14",
  },
  {
    id: "t2",
    type: "DEBIT",
    source: "INVESTMENT",
    title: "Projector Purchase",
    amount: 25000,
    date: "2026-02-10",
  },
  {
    id: "t3",
    type: "CREDIT",
    source: "ADMISSION",
    title: "Admission fee - Office Application",
    amount: 4000,
    date: "2026-02-09",
  },
  {
    id: "t4",
    type: "DEBIT",
    source: "INVESTMENT",
    title: "Office Rent",
    amount: 18000,
    date: "2026-02-01",
  },
];
