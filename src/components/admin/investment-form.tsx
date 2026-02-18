"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  investmentSchema,
  type InvestmentInput,
} from "@/lib/validators/investment";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { zodResolver } from "@hookform/resolvers/zod";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function taka(n: number) {
  return `৳ ${n.toLocaleString("en-US")}`;
}

export default function NewInvestmentPage() {
  const router = useRouter();

  const form = useForm<InvestmentInput>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      title: "",
      amount: 0,
      date: todayISO(),
      description: "",
      invoiceImageUrl: "",
      password: "",
    },
    mode: "onChange",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const pendingValuesRef = useRef<InvestmentInput | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const invoiceUrl = form.watch("invoiceImageUrl");
  const amount = form.watch("amount");

  const canSubmit = form.formState.isValid && !submitting;

  const previewUrl = useMemo(() => {
    const v = (invoiceUrl || "").trim();
    return v.length ? v : "";
  }, [invoiceUrl]);

  async function finalizeSubmit(values: InvestmentInput) {
    setSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/investments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            // keep empty strings clean
            description: values.description?.trim() || undefined,
            invoiceImageUrl: values.invoiceImageUrl?.trim() || undefined,
          }),
        },
      );

      const json = await res.json().catch(() => null);

      if (res.status === 401 || res.status === 403) {
        toast.error("Unauthorized. Please login again.");
        router.push("/admin/login");
        return;
      }

      if (res.status === 422) {
        toast.error("Validation failed. Please check the form.");
        return;
      }

      if (!res.ok || !json?.success) {
        toast.error(json?.message || "Failed to record investment.");
        return;
      }

      toast.success("Investment recorded.", {
        description: `${values.title} • ${taka(Number(values.amount))}`,
      });

      // ✅ clear form after submission (as you want)
      form.reset({
        title: "",
        amount: 0,
        date: todayISO(),
        description: "",
        invoiceImageUrl: "",
        password: "",
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      toast.error("Network error while submitting.");
    } finally {
      setSubmitting(false);
    }
  }

  function onSubmit(values: InvestmentInput) {
    pendingValuesRef.current = values;
    setConfirmOpen(true);
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Add Investment</h1>
          <p className="text-sm text-muted-foreground">
            Record money-out with invoice proof. Requires password confirmation.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <a href="/admin/transactions">Back</a>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset({
                title: "",
                amount: 0,
                date: todayISO(),
                description: "",
                invoiceImageUrl: "",
                password: "",
              });
            }}
            disabled={submitting}
          >
            Clear
          </Button>
        </div>
      </div>

      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Left: form */}
            <Card className="shadow-none lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Investment Details</CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4 lg:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Projector purchase / Rent / Bill..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          min={0}
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="invoiceImageUrl"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel>Invoice Image URL (optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} />
                      </FormControl>
                      <FormDescription>
                        Provide a direct image URL (no upload). Preview appears
                        on the right.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Short note (shop name, model, payment info...)"
                          className="min-h-27.5"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator className="lg:col-span-2" />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="lg:col-span-2">
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Your password"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Required every time before recording an investment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Right: preview */}
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-base">Preview</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-xl border p-3">
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="mt-1 text-lg font-semibold">
                    {Number(amount) > 0 ? taka(Number(amount)) : "—"}
                  </p>
                </div>

                <div className="overflow-hidden rounded-xl border bg-muted">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Invoice preview"
                      className="h-56 w-full object-cover"
                      onError={(e) => {
                        // fallback to placeholder message
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
                      Invoice preview
                    </div>
                  )}
                </div>

                {/* <Button type="submit" className="w-full" disabled={!canSubmit}>
                  {submitting ? "Submitting..." : "Record Investment"}
                </Button> */}

                <p className="text-xs text-muted-foreground">
                  This action will be stored with your account and requires
                  password confirmation.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* bottom action row */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => {
                form.reset({
                  title: "",
                  amount: 0,
                  date: todayISO(),
                  description: "",
                  invoiceImageUrl: "",
                  password: "",
                });
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Clear Form
            </Button>

            <Button type="submit" disabled={!canSubmit}>
              {submitting ? "Submitting..." : "Record Investment"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Confirm dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Investment</AlertDialogTitle>
            <AlertDialogDescription>
              This will record a money-out transaction and save who added it.
              Please confirm to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={submitting}
              onClick={() => {
                const v = pendingValuesRef.current;
                setConfirmOpen(false);
                if (v) finalizeSubmit(v);
              }}
            >
              {submitting ? "Submitting..." : "Confirm & Record"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
