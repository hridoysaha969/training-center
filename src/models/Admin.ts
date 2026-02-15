import { model, models, Schema } from "mongoose";

export type AdminRole = "SUPER_ADMIN" | "STAFF";

const AdminSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "ADMIN", "STAFF"],
      default: "STAFF",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Admin = models.Admin || model("Admin", AdminSchema);
