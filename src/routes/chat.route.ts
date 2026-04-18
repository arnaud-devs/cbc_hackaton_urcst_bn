import { Router } from "express";
import rateLimit from "express-rate-limit";
import { validateZod } from "../middlewares/validate.middleware";
import { chat } from "../controllers/chat.controller";
import { chatSchema } from "../validators/chat.validator";

const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { status: "error", message: "Too many chat requests. Please try again in 15 minutes." },
});

const chatRoutes = Router();

chatRoutes.post("/", chatLimiter, validateZod(chatSchema), chat);

export default chatRoutes;
