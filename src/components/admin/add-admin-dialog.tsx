"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type AdminRole = "SUPER_ADMIN" | "ADMIN" | "STAFF";

const createAdminSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    isActive: z.boolean(), // ✅ no default here
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type CreateAdminInput = z.infer<typeof createAdminSchema>;

export default function AddAdminDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated: () => void;
}) {
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<CreateAdminInput>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "STAFF",
      isActive: true, // ✅ always boolean
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: CreateAdminInput) {
    try {
      setSubmitting(true);

      const res = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          role: values.role as AdminRole,
          isActive: values.isActive,
          password: values.password,
        }),
      });

      const payload = await res.json().catch(() => null);
      if (!res.ok || !payload?.success) {
        toast.error(payload?.message || "Failed to create user");
        return;
      }

      toast.success("User created successfully");
      form.reset();
      onCreated();
    } catch {
      toast.error("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-130 rounded-2xl">
        <DialogHeader>
          <DialogTitle>Add new staff/admin</DialogTitle>
          <DialogDescription>
            Create a new access user for your training center dashboard.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Ridoy Saha"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="STAFF">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Choose permissions level.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-xl border p-3">
                    <div className="space-y-0.5">
                      <FormLabel className="text-sm">Active</FormLabel>
                      <FormDescription className="text-xs">
                        User can login if active.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={!!field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => onOpenChange(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl"
                disabled={submitting || !form.formState.isValid}
              >
                {submitting ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
