import { z } from "zod";

export const chatSchema = z.object({
  sessionToken: z.string().uuid("Invalid session token").optional(),
  message: z.string().min(1, "Message cannot be empty").max(1000, "Message too long"),
});
