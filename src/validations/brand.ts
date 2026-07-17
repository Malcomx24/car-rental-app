import { z } from "zod";

export const brandFormSchema = z.object({
  name: z.string().min(1, "Brand name is required").max(100),
  logo: z.string().url("Must be a valid URL").optional().nullable(),
  country: z.string().max(100).optional().nullable(),
});

export type BrandFormData = z.infer<typeof brandFormSchema>;
