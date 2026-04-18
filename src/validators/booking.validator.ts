import { z } from "zod";
import { VALID_SLOTS } from "../utils/slots";

export const createBookingSchema = z.object({
  serviceId: z.string().uuid("Invalid service ID"),
  doctorId: z.string().uuid("Invalid doctor ID"),
  clientPhone: z.string().min(8, "Phone number is required"),
  clientAge: z.number().int().min(10).max(100, "Age must be between 10 and 100"),
  clientSex: z.enum(["male", "female", "other"], {
    message: "clientSex must be male, female, or other",
  }),
  clientLanguage: z.string().min(1, "Language is required"),
  clientAddress: z.string().min(2, "Address is required"),
  clientDetail: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  timeSlot: z.string().refine((v) => VALID_SLOTS.includes(v), {
    message: `Time slot must be one of: ${VALID_SLOTS.join(", ")}`,
  }),
});
