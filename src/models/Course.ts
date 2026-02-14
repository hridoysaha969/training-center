import mongoose, { Schema, model, models } from "mongoose";

export type CourseDoc = {
  name: string;
  code: string; // BC, OA, GD
  durationMonths: 3 | 6;
  fee: number;
  isActive: boolean;
};

const CourseSchema = new Schema<CourseDoc>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, trim: true, uppercase: true },
    durationMonths: { type: Number, required: true, enum: [3, 6] },
    fee: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

CourseSchema.index({ code: 1 }, { unique: true });

export const Course = models.Course || model<CourseDoc>("Course", CourseSchema);
