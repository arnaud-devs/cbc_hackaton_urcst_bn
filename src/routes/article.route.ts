import { Router } from "express";
import {
  getArticle,
  getArticles,
  postArticle,
  patchArticle,
} from "../controllers/article.controller";
import {
  patchArticleSchema,
  postArticleSchema,
} from "../validators/article.validator";
import { validate } from "../middlewares/validate.middleware";

const articleRoutes = Router();

// Fetching all article and creation of new article
articleRoutes
  .route("/")
  .get(getArticles)
  .post(validate(postArticleSchema), postArticle);

// Fetch single article
articleRoutes.get("/:id", getArticle);

// Updating existing article
articleRoutes.patch("/:id", validate(patchArticleSchema), patchArticle);

export default articleRoutes;
