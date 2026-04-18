import { z } from "zod";

export const createFeedbackSchema = z.object({
  doctorId: z.string().min(1, "Doctor ID is required"),
  bookingId: z.string().min(1).optional(),
  rating: z.coerce.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().max(500).optional(),
});
