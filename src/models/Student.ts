import mongoose, { model, models, Schema } from "mongoose";

const GuardianSchema = new Schema(
  {
    name: { type: String, required: true },
    relation: { type: String, required: true },
    phone: { type: String, required: true },
    occupation: { type: String, required: true },
    address: { type: String, required: true },
  },
  { _id: false },
);

const AcademicSchema = new Schema(
  {
    qualification: { type: String, required: true },
    passingYear: { type: String, required: true },
    instituteName: { type: String, required: true },
  },
  { _id: false },
);

const AdmissionSchema = new Schema(
  {
    courseName: { type: String, required: true },
    admissionDate: { type: Date, default: Date.now },
    admissionFee: { type: Number, required: true },

    roll: { type: String, unique: true, required: true },
    certificateId: { type: String, unique: true, required: true },
  },
  { _id: false },
);

const StudentSchema = new Schema(
  {
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    nidOrBirthId: { type: String, required: true },

    gender: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },

    address: { type: String, required: true },
    photoUrl: { type: String, required: true },

    guardian: { type: GuardianSchema, required: true },
    academic: { type: AcademicSchema, required: true },
    admission: { type: AdmissionSchema, required: true },
  },
  {
    timestamps: true,
  },
);

export const Student = models.Student || model("Student", StudentSchema);
