import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import {
  getMe,
  getDoctorBookings,
  getSchedule,
  getDoctorFeedback,
  toggleAvailability,
} from "../controllers/doctor.controller";

const doctorRoutes = Router();

doctorRoutes.use(authenticate("doctor"));

doctorRoutes.get("/me", getMe);
doctorRoutes.get("/bookings", getDoctorBookings);
doctorRoutes.get("/schedule", getSchedule);
doctorRoutes.get("/feedback", getDoctorFeedback);
doctorRoutes.patch("/availability", toggleAvailability);

export default doctorRoutes;
