import { Router } from "express";
import { validateZod } from "../middlewares/validate.middleware";
import {
  getPublicDoctors,
  getPublicDoctorById,
  getServices,
  getAvailableDoctors,
  createBooking,
  getBookingById,
  submitFeedback,
} from "../controllers/client.controller";
import { createBookingSchema } from "../validators/booking.validator";
import { createFeedbackSchema } from "../validators/feedback.validator";

const clientRoutes = Router();

// Doctors — public
clientRoutes.get("/doctors", getPublicDoctors);
clientRoutes.get("/doctors/available", getAvailableDoctors);
clientRoutes.get("/doctors/:id", getPublicDoctorById);

// Services — public
clientRoutes.get("/services", getServices);

// Bookings — anonymous
clientRoutes.post("/bookings", validateZod(createBookingSchema), createBooking);
clientRoutes.get("/bookings/:id", getBookingById);

// Feedback — anonymous
clientRoutes.post("/feedback", validateZod(createFeedbackSchema), submitFeedback);

export default clientRoutes;
