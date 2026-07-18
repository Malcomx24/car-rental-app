import { z } from "zod";

export const locationFormSchema = z.object({
  name: z.string().min(1, "Location name is required").max(100),
  slug: z.string().max(100).optional().nullable(),
  address: z.string().min(1, "Address is required").max(255),
  addressLine2: z.string().max(255).optional().nullable(),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().min(1, "State is required").max(100),
  country: z.string().min(1, "Country is required").max(100),
  zipCode: z.string().min(1, "Zip code is required").max(20),
  phone: z.string().min(1, "Phone number is required").max(30),
  email: z.string().email("Must be a valid email").optional().nullable(),
  latitude: z.coerce.number().min(-90).max(90).optional().nullable(),
  longitude: z.coerce.number().min(-180).max(180).optional().nullable(),
  isAirport: z.boolean().default(false),
  isActive: z.boolean().default(true),
});

export type LocationFormData = z.infer<typeof locationFormSchema>;
