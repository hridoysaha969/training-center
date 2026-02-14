import TransactionsTable from "@/components/admin/transactions-table";
import { transactionsMock } from "@/data/mock-tables";

export default function TransactionsPage() {
  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Track cash in/out with filters and date range.
        </p>
      </div>

      <TransactionsTable rows={transactionsMock} />
    </div>
  );
}
