import mongoose, { Schema, model, models } from "mongoose";

export type CounterDoc = {
  key: string; // e.g. "roll:2602" or "batch:BC:2602"
  seq: number;
};

const CounterSchema = new Schema<CounterDoc>(
  {
    key: { type: String, required: true, trim: true },
    seq: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

CounterSchema.index({ key: 1 }, { unique: true });

export const Counter =
  models.Counter || model<CounterDoc>("Counter", CounterSchema);
