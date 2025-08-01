import { z } from "zod";

// Create Customer Schema
export const CustomerSchema = z.object({
  id: z.number().optional(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, "Use format XXX-XXX-XXXX"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().nullable().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().length(2, "Use state abbreviation"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP format"),
  notes: z.string().nullable().optional(),
  active: z.boolean(),
});

export type TCustomerFormData = z.infer<typeof CustomerSchema>;
