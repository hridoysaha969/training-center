import mongoose, { Schema, model, models, Types } from "mongoose";

export type InvestmentDoc = {
  title: string;
  amount: number;
  description?: string;
  invoiceImageUrl?: string;
  date: Date;

  createdBy: Types.ObjectId;
};

const InvestmentSchema = new Schema<InvestmentDoc>(
  {
    title: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 1 },

    description: { type: String, trim: true },
    invoiceImageUrl: { type: String, trim: true },

    date: { type: Date, required: true },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
  },
  { timestamps: true },
);

InvestmentSchema.index({ date: -1 });
InvestmentSchema.index({ createdBy: 1 });

export const Investment =
  models.Investment || model<InvestmentDoc>("Investment", InvestmentSchema);
