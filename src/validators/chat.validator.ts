import { z } from "zod";

export const chatSchema = z.object({
  sessionToken: z.string().optional(),
  message: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
});
