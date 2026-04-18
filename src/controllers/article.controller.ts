import { Request, Response } from "express";
import { prisma } from "../database/client";
import { CustomError } from "../utils/CustomError";

export const getPublicArticles = async (req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      select: {
        id: true, title: true, category: true, views: true, createdAt: true,
        admin: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ status: "success", data: articles });
  } catch (error) {
    throw error;
  }
};

export const getPublicArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const article = await prisma.article.findUnique({
      where: { id },
      include: { admin: { select: { name: true } } },
    });
    if (!article) throw new CustomError("Article not found", 404);

    await prisma.article.update({ where: { id }, data: { views: { increment: 1 } } });

    res.json({ status: "success", data: { ...article, views: article.views + 1 } });
  } catch (error) {
    throw error;
  }
};
