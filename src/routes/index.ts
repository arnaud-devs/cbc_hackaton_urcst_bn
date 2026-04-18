import { Router } from "express";
import articleRoutes from "./article.route";
import clinicRoutes from "./clinic.route";

const router = Router();

const routes: Array<{ path: string; route: Router }> = [
  { path: "article", route: articleRoutes },
  { path: "clinics", route: clinicRoutes },
];

routes.forEach(({ path, route }) => {
  router.use(`/api/${path}`, route);
});

// Api health check route
router.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running smoothly" });
});

// Global error handler
export default router;
