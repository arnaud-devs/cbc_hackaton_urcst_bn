import { ArticleStatus } from "@prisma/client";
import Joi from "joi";

export const postArticleSchema = Joi.object({
  title: Joi.string(),
  coverPhoto: Joi.string(),
  content: Joi.string(),
  categories: Joi.array().items(Joi.string()).min(1),
  status: Joi.string().valid(...Object.values(ArticleStatus)),
})
  .options({ presence: "required" })
  .required();

export const patchArticleSchema = postArticleSchema
  .options({ presence: "optional" })
  .optional();
