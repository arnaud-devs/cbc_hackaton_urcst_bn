import { Router } from "express";
import { getPublicArticles, getPublicArticle } from "../controllers/article.controller";

const articleRoutes = Router();

articleRoutes.get("/", getPublicArticles);
articleRoutes.get("/:id", getPublicArticle);

export default articleRoutes;
