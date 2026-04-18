import { Request, Response } from "express";
import { postArticleSchema } from "../validators/article.validator";
import { CustomError } from "../utils/CustomError";
import {
  createArticle,
  fetchArticle,
  fetchArticles,
  updateArticle,
} from "../services/article.services";
import { prisma } from "../database/client";
// Create new article
export const postArticle = async (req: Request, res: Response) => {
  try {
    const data = req.body ?? {};

    // Call service to create new article
    const newArticle = await createArticle({ data });

    // Send response
    res.status(201).json({
      status: "success",
      message: "Article created successfully",
      data: newArticle,
    });
    return;
  } catch (error) {
    throw error;
  }
};

// Fetch all articles
export const getArticles = async (req: Request, res: Response) => {
  try {
    const articles = await fetchArticles();

    // Send response
    res.status(200).json({
      status: "success",
      message: "Articles retrieved successfully",
      data: articles,
    });
  } catch (error) {
    throw error;
  }
};

// Fetch an article
export const getArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await fetchArticle({ id });

    // Send response
    if (!article) {
      res.status(404).json({
        status: "error",
        message: "Article not found",
        data: {},
      });
    } else {
      res.status(200).json({
        status: "success",
        message: "Article retrieved successfully",
        data: article,
      });
    }
    return;
  } catch (error) {
    throw error;
  }
};

// Update an articles
export const patchArticle = async (req: Request, res: Response) => {
  try {
    const data = req.body ?? {};
    const { id } = req.params;

    const updatedArticle = await updateArticle({ id, data });

    // Send response

    res.status(200).json({
      status: "success",
      message: "Article updated successfully",
      data: updatedArticle,
    });

    return;
  } catch (error) {
    throw error;
  }
};
