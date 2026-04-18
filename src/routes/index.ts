import { Router } from "express";
import authRoutes from "./auth.route";
import adminRoutes from "./admin.route";
import doctorRoutes from "./doctor.route";
import clientRoutes from "./client.route";
import chatRoutes from "./chat.route";
import articleRoutes from "./article.route";

const router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/admin", adminRoutes);
router.use("/api/doctor", doctorRoutes);
router.use("/api", clientRoutes);
router.use("/api/chat", chatRoutes);
router.use("/api/articles", articleRoutes);

router.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running smoothly" });
});

export default router;
