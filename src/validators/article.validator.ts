import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  category: z.string().min(2, "Category is required"),
});

export const updateArticleSchema = createArticleSchema.partial();
