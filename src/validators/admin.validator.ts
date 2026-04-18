import { z } from "zod";

export const createDoctorSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  specialty: z.string().min(2, "Specialty is required"),
  languages: z.array(z.string().min(1)).min(1, "At least one language is required"),
  phone: z.string().min(8, "Phone number is required"),
});

export const createServiceSchema = z.object({
  name: z.string().min(2, "Service name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  durationMinutes: z.number().int().positive("Duration must be a positive integer"),
});

export const createArticleSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  category: z.string().min(2, "Category is required"),
});

export const assignServicesSchema = z.object({
  serviceIds: z.array(z.string().min(1)).min(1, "At least one service is required"),
});
