import { ArticleStatus } from "@prisma/client";
import { prisma } from "../database/client";
import { validate as isUuid } from "uuid";
import { CustomError } from "../utils/CustomError";

interface IArticlePayload {
  title: string;
  coverPhoto: string;
  status: ArticleStatus;
  content: string;
  categories: Array<string>;
}

export const createArticle = async ({ data }: { data: IArticlePayload }) => {
  try {
    const { title, coverPhoto, content, status, categories } = data;

    const newArticle = await prisma.article.create({
      data: {
        title,
        coverPhoto,
        status,
        content,
        ArticleCategories: {
          create: Array.from(new Set(["health", ...categories])).map(
            (catTitle) => ({
              category: {
                connectOrCreate: {
                  where: { title: catTitle.toLowerCase() },
                  create: { title: catTitle.toLowerCase() },
                },
              },
            })
          ),
        },
      },
      include: {
        ArticleCategories: {
          include: {
            category: true,
          },
        },
      },
    });

    const flattenedArticle = {
      ...newArticle,
      ArticleCategories: newArticle.ArticleCategories.map(
        (item) => item.category
      ),
    };

    return flattenedArticle;
  } catch (error) {
    throw error;
  }
};

// Fetching all articles
export const fetchArticles = async () => {
  try {
    const articles = await prisma.article.findMany({
      include: { ArticleCategories: { select: { category: true } } },
    });

    const flattenedArticles = articles.map((article) => ({
      ...article,
      ArticleCategories: article.ArticleCategories.map((item) => item.category),
    }));

    return flattenedArticles;
  } catch (error) {
    throw error;
  }
};

// Fetching single article
export const fetchArticle = async ({ id }: { id: string }) => {
  try {
    if (!isUuid(id)) {
      throw new CustomError(
        "Invalid uuid format",
        400,
        `id:${id} must be valid uuid`
      );
    }

    const article = await prisma.article.findUnique({
      where: {
        id,
      },
      include: {
        ArticleCategories: {
          select: {
            category: true,
          },
        },
      },
    });

    if (article) {
      return {
        ...article,
        ArticleCategories: article.ArticleCategories.map(
          (item) => item.category
        ),
      };
    }

    return article;
  } catch (error) {
    throw error;
  }
};

// Update an article
export const updateArticle = async ({
  id,
  data,
}: {
  id: string;
  data: IArticlePayload;
}) => {
  try {
    if (!isUuid(id)) {
      throw new CustomError(
        "Invalid uuid format",
        400,
        `id:${id} must be valid uuid`
      );
    }

    const existingArticle = await prisma.article.findUnique({
      where: { id },
      include: { ArticleCategories: true },
    });

    if (!existingArticle) {
      throw new CustomError("Article not found", 404);
    }
// ArticleCategories: {
//           create: Array.from(new Set(["health", ...categories])).map(
//             (catTitle) => ({
//               category: {
//                 connectOrCreate: {
//                   where: { title: catTitle.toLowerCase() },
//                   create: { title: catTitle.toLowerCase() },
//                 },
//               },
//             })
//           ),
//         }


const categoryUpdates =
         {
            deleteMany: {}, // remove all existing relations
            create: Array.from(new Set(data.categories.length>0 ? ["health",...data.categories]:["health"])).map((catTitle) => ({
              category: {
                connectOrCreate: {
                  where: { title: catTitle.toLowerCase() },
                  create: { title: catTitle.toLowerCase() },
                },
              },
            })),
          }
    ;


    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title: data.title,
        coverPhoto: data.coverPhoto,
        content: data.content,
        status: data.status,
        ...(categoryUpdates && { ArticleCategories: categoryUpdates }),
      },
      include: {
        ArticleCategories: {
          include: { category: true },
        },
      },
    });
    const flattenedArticle = {
  ...updatedArticle,
  categories: updatedArticle.ArticleCategories.map((ac) => ac.category),
};

    return flattenedArticle;
  } catch (error) {
    console.error("Error updating article:", error);
    throw error;
  }
};
