import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().max(500).optional().nullable(),
  icon: z.string().max(100).optional().nullable(),
});

export type CategoryFormData = z.infer<typeof categoryFormSchema>;
