import mongoose, { Schema, model, models, Types } from "mongoose";

export type LedgerTransactionDoc = {
  type: "CREDIT" | "DEBIT";
  source: "ADMISSION" | "INVESTMENT";
  amount: number;

  title: string; // e.g. "Admission fee - Basic Computer" / "Projector purchase"
  note?: string;

  date: Date; // business date of the event
  createdBy: Types.ObjectId;

  // references (optional but very useful)
  refStudentId?: Types.ObjectId;
  refEnrollmentId?: Types.ObjectId;
  refInvestmentId?: Types.ObjectId;
};

const LedgerTransactionSchema = new Schema<LedgerTransactionDoc>(
  {
    type: { type: String, required: true, enum: ["CREDIT", "DEBIT"] },
    source: { type: String, required: true, enum: ["ADMISSION", "INVESTMENT"] },

    amount: { type: Number, required: true, min: 1 },

    title: { type: String, required: true, trim: true },
    note: { type: String, trim: true },

    date: { type: Date, required: true },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },

    refStudentId: { type: Schema.Types.ObjectId, ref: "Student" },
    refEnrollmentId: { type: Schema.Types.ObjectId, ref: "Enrollment" },
    refInvestmentId: { type: Schema.Types.ObjectId, ref: "Investment" },
  },
  { timestamps: true },
);

// Indexes for fast KPI + chart queries
LedgerTransactionSchema.index({ date: -1 });
LedgerTransactionSchema.index({ type: 1, date: -1 });
LedgerTransactionSchema.index({ source: 1, date: -1 });
LedgerTransactionSchema.index({ createdBy: 1, date: -1 });

export const LedgerTransaction =
  models.LedgerTransaction ||
  model<LedgerTransactionDoc>("LedgerTransaction", LedgerTransactionSchema);
