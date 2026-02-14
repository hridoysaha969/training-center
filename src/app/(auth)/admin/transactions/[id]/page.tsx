import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function TransactionDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const trxId = (await params).id;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Transaction Details</h1>
          <p className="text-sm text-muted-foreground">ID: {trxId}</p>
        </div>

        <Button asChild variant="outline">
          <Link href="/admin/transactions">Back</Link>
        </Button>
      </div>

      <div className="rounded-xl border p-4 text-sm text-muted-foreground">
        UI first: Transaction meta, type, amount, method, note, createdBy will
        go here.
      </div>
    </div>
  );
}
