import { z } from "zod";

export const createFeedbackSchema = z.object({
  doctorId: z.string().uuid("Invalid doctor ID"),
  bookingId: z.string().uuid("Invalid booking ID").optional(),
  rating: z.number().int().min(1).max(5, "Rating must be between 1 and 5"),
  comment: z.string().max(500).optional(),
});
