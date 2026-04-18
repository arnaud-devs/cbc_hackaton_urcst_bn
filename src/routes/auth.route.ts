import { Router } from "express";
import { adminLogin, doctorLogin } from "../controllers/auth.controller";
import { validateZod } from "../middlewares/validate.middleware";
import { loginSchema } from "../validators/auth.validator";

const authRoutes = Router();

authRoutes.post("/admin/login", validateZod(loginSchema), adminLogin);
authRoutes.post("/doctor/login", validateZod(loginSchema), doctorLogin);

export default authRoutes;
