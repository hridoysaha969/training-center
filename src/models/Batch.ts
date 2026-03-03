import mongoose, { Schema, model, models, Types } from "mongoose";
import type { BatchSchedule } from "@/lib/batchSchedules";

export type BatchStatus = "RUNNING" | "CLOSED";

export type BatchDoc = {
  courseId: Types.ObjectId;

  courseCode: string; // stored for quick display/search (AOM, BC, etc.)
  serial: number; // 1..99

  name: string; // Batch-AOM-01 (human display)
  slug: string; // batch-aom-01 (unique key)

  schedule: BatchSchedule;

  startDate?: Date;
  endDate?: Date;

  capacity: number; // default 20
  status: BatchStatus;

  createdBy: Types.ObjectId;
};

const BatchSchema = new Schema<BatchDoc>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },

    courseCode: { type: String, required: true, trim: true },
    serial: { type: Number, required: true, min: 1, max: 99 },

    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },

    schedule: { type: String, required: true },

    startDate: { type: Date },
    endDate: { type: Date },

    capacity: { type: Number, default: 20, min: 1 },
    status: { type: String, enum: ["RUNNING", "CLOSED"], default: "RUNNING" },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
  },
  { timestamps: true },
);

// ✅ hard guarantee: no duplicate batches
BatchSchema.index({ slug: 1 }, { unique: true });

// helpful filters
BatchSchema.index({ courseId: 1, status: 1 });
BatchSchema.index({ status: 1, startDate: -1 });
BatchSchema.index({ name: 1 });

export const Batch = models.Batch || model<BatchDoc>("Batch", BatchSchema);
