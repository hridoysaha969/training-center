import { z } from "zod";
import { BATCH_SCHEDULES } from "@/lib/batchSchedules";

export const createBatchSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  serial: z.coerce.number().int().min(1).max(99),
  schedule: z.enum(BATCH_SCHEDULES),

  startDate: z.string().optional(), // YYYY-MM-DD
  endDate: z.string().optional(), // YYYY-MM-DD

  capacity: z.coerce.number().int().min(1).max(200).optional(),
});

export type CreateBatchInput = z.infer<typeof createBatchSchema>;
