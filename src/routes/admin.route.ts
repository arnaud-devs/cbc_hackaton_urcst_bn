import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { validateZod } from "../middlewares/validate.middleware";
import {
  getDashboard,
  createDoctor,
  getDoctors,
  deleteDoctor,
  assignDoctorServices,
  getDoctorServices,
  getAdminBookings,
  getChatLogs,
  createAdminArticle,
  getAdminArticles,
  deleteAdminArticle,
  createService,
  getAdminServices,
  deleteService,
} from "../controllers/admin.controller";
import { createDoctorSchema, createServiceSchema, createArticleSchema, assignServicesSchema } from "../validators/admin.validator";

const adminRoutes = Router();

adminRoutes.use(authenticate("admin"));

adminRoutes.get("/dashboard", getDashboard);

adminRoutes.route("/doctors").get(getDoctors).post(validateZod(createDoctorSchema), createDoctor);
adminRoutes.delete("/doctors/:id", deleteDoctor);
adminRoutes.get("/doctors/:id/services", getDoctorServices);
adminRoutes.put("/doctors/:id/services", validateZod(assignServicesSchema), assignDoctorServices);

adminRoutes.get("/bookings", getAdminBookings);
adminRoutes.get("/chatlogs", getChatLogs);

adminRoutes.route("/articles").get(getAdminArticles).post(validateZod(createArticleSchema), createAdminArticle);
adminRoutes.delete("/articles/:id", deleteAdminArticle);

adminRoutes.route("/services").get(getAdminServices).post(validateZod(createServiceSchema), createService);
adminRoutes.delete("/services/:id", deleteService);

export default adminRoutes;
