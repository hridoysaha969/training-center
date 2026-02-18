import Link from "next/link";
import { Button } from "@/components/ui/button";
import TransactionDetails from "@/components/admin/Transaction-details";

export default async function TransactionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ correct
  return <TransactionDetails id={id} />;
}
