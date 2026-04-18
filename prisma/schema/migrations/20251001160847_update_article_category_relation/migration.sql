/*
  Warnings:

  - You are about to drop the `ArticleCategoryMap` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ArticleCategoryMap" DROP CONSTRAINT "ArticleCategoryMap_articleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArticleCategoryMap" DROP CONSTRAINT "ArticleCategoryMap_categoryId_fkey";

-- DropTable
DROP TABLE "public"."ArticleCategoryMap";

-- CreateTable
CREATE TABLE "public"."ArticleCategories" (
    "articleId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "ArticleCategories_pkey" PRIMARY KEY ("categoryId","articleId")
);

-- AddForeignKey
ALTER TABLE "public"."ArticleCategories" ADD CONSTRAINT "ArticleCategories_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleCategories" ADD CONSTRAINT "ArticleCategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."ArticleCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
