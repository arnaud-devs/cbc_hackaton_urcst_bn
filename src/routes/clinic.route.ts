import { Router } from "express";
import {
  getClinic,
  getClinics,
  postClinic,
  patchClinic,
  removeClinic,
} from "../controllers";
import {
  patchClinicSchema,
  postClinicSchema,
} from "../validators/clinic.validator";
import { validate } from "../middlewares/validate.middleware";

const clinicRoutes = Router();

// Fetching all clinics and creation of new clinic
clinicRoutes
  .route("/")
  .get(getClinics)
  .post(validate(postClinicSchema), postClinic);

// Fetch single clinic, update, and delete clinic
clinicRoutes
  .route("/:id")
  .get(getClinic)
  .patch(validate(patchClinicSchema), patchClinic)
  .delete(removeClinic);

export default clinicRoutes;
