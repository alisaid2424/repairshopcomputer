import { z } from "zod";

// Create Ticket Schema
export const TicketSchema = z.object({
  id: z.union([z.number(), z.literal("(New)")]),
  customerId: z.number(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  tech: z.string().email({ message: "Invalid email address" }),
  completed: z.boolean().optional(),
});

export type TInsertTicketSchema = z.infer<typeof TicketSchema>;
