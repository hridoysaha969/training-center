import mongoose, { Schema, model, models, Types } from "mongoose";

export type EnrollmentDoc = {
  studentId: Types.ObjectId;
  courseId: {
    type: Schema.Types.ObjectId;
    ref: "Course"; // MUST match model name exactly
  };
  batchName: string; // BC-2601-01
  startDate: Date;
  status: "RUNNING" | "COMPLETED";

  // ✅ result (for certificate decision)
  resultStatus: "PENDING" | "PASS" | "FAIL";
  resultNote?: string;
  resultUpdatedAt?: Date;
  resultUpdatedBy?: Types.ObjectId;

  createdBy: Types.ObjectId;
};

const EnrollmentSchema = new Schema<EnrollmentDoc>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    batchName: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: ["RUNNING", "COMPLETED"],
      default: "RUNNING",
    },

    // ✅ new fields
    resultStatus: {
      type: String,
      required: true,
      enum: ["PENDING", "PASS", "FAIL"],
      default: "PENDING",
    },
    resultNote: { type: String, trim: true },
    resultUpdatedAt: { type: Date },
    resultUpdatedBy: { type: Schema.Types.ObjectId, ref: "Admin" },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

// prevent duplicate enrollment for same course if you want:
EnrollmentSchema.index({ studentId: 1, courseId: 1 }, { unique: true });

EnrollmentSchema.index({ batchName: 1 });

export const Enrollment =
  models.Enrollment || model<EnrollmentDoc>("Enrollment", EnrollmentSchema);
