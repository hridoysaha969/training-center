import { z } from "zod";

export const admissionSchema = z.object({
  // auto generated, read-only in UI
  roll: z.string().min(1),

  // student
  fullName: z.string().min(2, "Full name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  nidOrBirthId: z.string().min(6, "NID/Birth ID is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().min(10, "Phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  presentAddress: z.string().min(5, "Present address is required"),
  photoUrl: z.string().url("Photo URL must be a valid URL"),

  // guardian
  guardianName: z.string().min(2, "Guardian name is required"),
  guardianRelation: z.string().min(2, "Relation is required"),
  guardianPhone: z.string().min(10, "Guardian phone is required"),
  guardianOccupation: z.string().min(2, "Occupation is required"),
  guardianAddress: z.string().min(5, "Guardian address is required"),

  // academic
  qualification: z.string().min(1, "Qualification is required"),
  passingYear: z.string().min(4, "Passing year is required"),
  instituteName: z.string().min(2, "Institute name is required"),

  // course selection (drives fee + batch)
  courseId: z.string().min(1, "Course is required"),
});

export type AdmissionInput = z.infer<typeof admissionSchema>;
