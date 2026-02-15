import { z } from "zod";

export const createAdminSchema = z
  .object({
    name: z.string().min(2, "Name is required").max(80),
    email: z.string().email("Valid email required").max(120),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "STAFF"]),
    isActive: z.boolean().default(true),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100),
  })
  .strict();

export type CreateAdminInput = z.infer<typeof createAdminSchema>;

// For listing
export const adminListQuerySchema = z
  .object({
    search: z.string().trim().max(120).optional(),
    role: z.enum(["SUPER_ADMIN", "ADMIN", "STAFF"]).optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export type AdminListQuery = z.infer<typeof adminListQuerySchema>;
