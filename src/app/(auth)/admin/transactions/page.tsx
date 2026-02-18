import TransactionsTable from "@/components/admin/transactions-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions | Admin | Excel Computer & IT Center",
  description: "View and manage financial transactions and ledger records.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};


export default function TransactionsPage() {
  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Track cash in/out with filters and date range.
        </p>
      </div>

      <TransactionsTable />
    </div>
  );
}
