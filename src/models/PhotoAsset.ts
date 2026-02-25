import { Schema, model, models, Types } from "mongoose";

export type PhotoType = "STUDENT" | "INVOICE";

const PhotoAssetSchema = new Schema(
  {
    type: { type: String, enum: ["STUDENT", "INVOICE"], required: true },

    url: { type: String, required: true },
    publicId: { type: String, required: true },

    bytes: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    format: { type: String, required: true },

    createdBy: { type: Types.ObjectId, ref: "Admin", required: true },
  },
  { timestamps: true },
);

export const PhotoAsset =
  models.PhotoAsset || model("PhotoAsset", PhotoAssetSchema);
