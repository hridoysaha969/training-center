"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StudentEditDialog } from "./StudentEditDialog";
import { Lock } from "lucide-react";

type EditStudentForm = {
  // readonly
  roll: string;
  admissionDate: string;
  batches: string[]; // show as readonly chips
  certificateId?: string | null;

  // editable (student)
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  presentAddress: string;
  nidOrBirthId: string;
  photoUrl: string;

  // editable (guardian)
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  guardianOccupation: string;
  guardianAddress: string;

  // editable (academic)
  qualification: string;
  passingYear: string;
  instituteName: string;
};

function formatDate(d: any) {
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function StudentPageAction({
  roll,
  initialEdit,
  canEdit,
}: {
  roll: string;
  initialEdit: EditStudentForm;
  canEdit: boolean;
}) {
  const printUrl = `/admin/students/${encodeURIComponent(roll)}/print`;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href="/admin/students">Back</Link>
        </Button>

        {canEdit ? (
          <StudentEditDialog
            initial={initialEdit}
            onSave={(payload) => {
              console.log("Save payload (UI only):", payload);
            }}
          />
        ) : (
          <Button
            variant="outline"
            disabled
            title="Only SUPER_ADMIN can edit"
            className="flex items-center gap-1"
          >
            Edit <Lock className="ml-1" size={16} />
          </Button>
        )}

        {/* Print */}
        <Button asChild>
          <Link href={printUrl} target="_blank" rel="noopener noreferrer">
            Print
          </Link>
        </Button>
      </div>
    </>
  );
}
