import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { validateZod } from "../middlewares/validate.middleware";
import { loginSchema } from "../validators/auth.validator";

const authRoutes = Router();

authRoutes.post("/login", validateZod(loginSchema), login);

export default authRoutes;
