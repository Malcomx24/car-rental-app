import { z } from "zod";

export const createReviewSchema = z.object({
  carId: z.string().uuid(),
  rating: z.coerce.number().min(1, "Rating is required").max(5),
  title: z.string().max(100).optional(),
  comment: z.string().min(10, "Review must be at least 10 characters").max(1000),
});

export type CreateReviewData = z.infer<typeof createReviewSchema>;

export const reviewSearchSchema = z.object({
  carId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});
