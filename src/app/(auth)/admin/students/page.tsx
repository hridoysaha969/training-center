import StudentsTable from "@/components/admin/students-table";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Students | Admin | Excel Computer & IT Center",
  description: "View and manage enrolled students.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};


export default function StudentsPage() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Students</h1>
          <p className="text-sm text-muted-foreground">
            Search, filter, and manage student admissions.
          </p>
        </div>
      </div>

      <StudentsTable />
    </div>
  );
}
