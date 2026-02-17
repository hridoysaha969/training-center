import mongoose, { Schema, model, models, Types } from "mongoose";

export type StudentDoc = {
  roll: string; // unique, auto-generated
  fullName: string;
  dateOfBirth: Date;
  nidOrBirthId: string; // unique
  gender: "MALE" | "FEMALE" | "OTHER";
  phone: string;
  email?: string;
  presentAddress: string;
  photoUrl: string;

  guardian: {
    name: string;
    relation: string;
    phone: string;
    occupation: string;
    address: string;
  };

  academic: {
    qualification: string;
    passingYear: string;
    instituteName: string;
  };

  admissionDate: Date;

  // certificate (issued later)
  certificateId?: string;
  certificateIssuedAt?: Date;
  certificateIssuedBy?: Types.ObjectId;

  // audit
  createdBy: Types.ObjectId;
  updatedBy?: Types.ObjectId;
};

const StudentSchema = new Schema<StudentDoc>(
  {
    roll: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    nidOrBirthId: { type: String, required: true, trim: true },
    gender: { type: String, required: true, enum: ["MALE", "FEMALE", "OTHER"] },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    presentAddress: { type: String, required: true, trim: true },
    photoUrl: { type: String, required: true, trim: true },

    guardian: {
      name: { type: String, required: true, trim: true },
      relation: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      occupation: { type: String, required: true, trim: true },
      address: { type: String, required: true, trim: true },
    },

    academic: {
      qualification: { type: String, required: true, trim: true },
      passingYear: { type: String, required: true, trim: true },
      instituteName: { type: String, required: true, trim: true },
    },

    admissionDate: { type: Date, required: true },

    certificateId: { type: String, trim: true },
    certificateIssuedAt: { type: Date },
    certificateIssuedBy: { type: Schema.Types.ObjectId, ref: "Admin" },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true },
);

StudentSchema.index({ roll: 1 }, { unique: true });
StudentSchema.index({ nidOrBirthId: 1 }, { unique: true });

// certificate unique but optional => sparse index
StudentSchema.index({ certificateId: 1 }, { unique: true, sparse: true });

export const Student =
  models.Student || model<StudentDoc>("Student", StudentSchema);
