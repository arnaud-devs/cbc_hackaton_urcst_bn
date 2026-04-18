import { Router } from "express";
import { validateZod } from "../middlewares/validate.middleware";
import {
  getServices,
  getAvailableDoctors,
  createBooking,
  getBookingById,
  submitFeedback,
} from "../controllers/client.controller";
import { createBookingSchema } from "../validators/booking.validator";
import { createFeedbackSchema } from "../validators/feedback.validator";

const clientRoutes = Router();

clientRoutes.get("/services", getServices);
clientRoutes.get("/doctors/available", getAvailableDoctors);
clientRoutes.post("/bookings", validateZod(createBookingSchema), createBooking);
clientRoutes.get("/bookings/:id", getBookingById);
clientRoutes.post("/feedback", validateZod(createFeedbackSchema), submitFeedback);

export default clientRoutes;
