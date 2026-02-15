import { z } from "zod";

export const investmentSchema = z.object({
  title: z.string().min(2, "Title is required"),
  amount: z.number().positive("Amount must be greater than 0"),
  description: z.string().optional(),
  invoiceImageUrl: z.string().url().optional(),
  date: z.string(), // ISO string from frontend
  password: z.string().min(4, "Password is required"),
});

export type InvestmentInput = z.infer<typeof investmentSchema>;
