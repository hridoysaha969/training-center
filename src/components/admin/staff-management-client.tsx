"use client";

import * as React from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  MoreHorizontal,
  Plus,
  RefreshCcw,
  Shield,
  UserCog,
  Users,
} from "lucide-react";
import AddAdminDialog from "./add-admin-dialog";

type AdminRole = "SUPER_ADMIN" | "ADMIN" | "STAFF";

type AdminRow = {
  _id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
};

type Summary = {
  total: number;
  superAdmin: number;
  admin: number;
  staff: number;
  active: number;
  inactive: number;
};

function roleBadge(role: AdminRole) {
  if (role === "SUPER_ADMIN")
    return <Badge className="rounded-full">Super Admin</Badge>;
  if (role === "ADMIN")
    return (
      <Badge variant="secondary" className="rounded-full">
        Admin
      </Badge>
    );
  return (
    <Badge variant="outline" className="rounded-full">
      Staff
    </Badge>
  );
}

export default function StaffManagementClient() {
  const [openAdd, setOpenAdd] = React.useState(false);

  const [summary, setSummary] = React.useState<Summary | null>(null);
  const [rows, setRows] = React.useState<AdminRow[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [search, setSearch] = React.useState("");
  const [role, setRole] = React.useState<AdminRole | "ALL">("ALL");

  async function fetchAll() {
    try {
      setLoading(true);

      const qs = new URLSearchParams();
      if (search.trim()) qs.set("search", search.trim());
      if (role !== "ALL") qs.set("role", role);

      const [sRes, lRes] = await Promise.all([
        fetch("/api/admin/summary", { cache: "no-store" }),
        fetch(`/api/admin?${qs.toString()}`, { cache: "no-store" }),
      ]);

      const sJson = await sRes.json().catch(() => null);
      const lJson = await lRes.json().catch(() => null);

      if (!sRes.ok || !sJson?.success)
        throw new Error(sJson?.message || "Failed to load summary");
      if (!lRes.ok || !lJson?.success)
        throw new Error(lJson?.message || "Failed to load admins");

      setSummary(sJson.data);
      setRows(lJson.data);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // simple debounce for search
  React.useEffect(() => {
    const t = setTimeout(() => fetchAll(), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role]);

  return (
    <div className="mx-auto w-full max-w-6xl p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Staff Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage admin access levels and staff accounts (RBAC).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={fetchAll}
            disabled={loading}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Refresh
          </Button>

          <Button className="rounded-xl" onClick={() => setOpenAdd(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl shadow-xl">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Total Access Users
            </CardDescription>
            <CardTitle className="text-2xl">
              {loading ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                (summary?.total ?? 0)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            All roles combined
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-xl">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Shield className="h-4 w-4" /> Super Admin
            </CardDescription>
            <CardTitle className="text-2xl">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                (summary?.superAdmin ?? 0)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Full permissions
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-xl">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <UserCog className="h-4 w-4" /> Admin
            </CardDescription>
            <CardTitle className="text-2xl">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                (summary?.admin ?? 0)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Limited admin controls
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-xl">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Users className="h-4 w-4" /> Staff
            </CardDescription>
            <CardTitle className="text-2xl">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                (summary?.staff ?? 0)
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Operational users
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="rounded-2xl shadow-xl">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Input
                className="rounded-xl w-full sm:w-[320px]"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger className="rounded-xl w-full sm:w-50">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All roles</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-muted-foreground">
              {loading ? (
                <Skeleton className="h-5 w-28" />
              ) : (
                <>
                  Showing{" "}
                  <span className="font-medium text-foreground">
                    {rows.length}
                  </span>{" "}
                  users
                </>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Table */}
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-36" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-24 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-28" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-10 ml-auto rounded-xl" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : rows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-muted-foreground"
                    >
                      No staff/admin found for your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((r) => (
                    <TableRow key={r._id}>
                      <TableCell className="font-medium">{r.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {r.email}
                      </TableCell>
                      <TableCell>{roleBadge(r.role)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={r.isActive ? "secondary" : "outline"}
                          className={cn(
                            "rounded-full",
                            r.isActive ? "border-transparent" : "",
                          )}
                        >
                          {r.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(r.createdAt), "dd MMM, yyyy")}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="rounded-xl"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                toast.message("Edit UI: coming soon")
                              }
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                toast.message("Reset password UI: coming soon")
                              }
                            >
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() =>
                                toast.message(
                                  "Activate/Deactivate UI: coming soon",
                                )
                              }
                            >
                              {r.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add dialog */}
      <AddAdminDialog
        open={openAdd}
        onOpenChange={setOpenAdd}
        onCreated={() => {
          setOpenAdd(false);
          fetchAll();
        }}
      />
    </div>
  );
}
