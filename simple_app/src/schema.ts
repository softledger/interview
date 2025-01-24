import { z } from "zod";

export const JournalSchema = z.object({
  reference: z.string().min(1).max(255),
  account_number: z.string().min(1).max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  amount: z.number(),
  currency: z.string().length(3).toUpperCase(), // ISO currency code
});

export type Journal = z.infer<typeof JournalSchema>;
