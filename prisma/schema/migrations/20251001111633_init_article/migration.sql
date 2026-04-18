-- CreateEnum
CREATE TYPE "public"."ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN');

-- CreateTable
CREATE TABLE "public"."Article" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "coverPhoto" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" "public"."ArticleStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArticleCategory" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArticleCategoryMap" (
    "articleId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,

    CONSTRAINT "ArticleCategoryMap_pkey" PRIMARY KEY ("categoryId","articleId")
);

-- CreateIndex
CREATE INDEX "Article_id_title_content_idx" ON "public"."Article"("id", "title", "content");

-- AddForeignKey
ALTER TABLE "public"."ArticleCategoryMap" ADD CONSTRAINT "ArticleCategoryMap_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleCategoryMap" ADD CONSTRAINT "ArticleCategoryMap_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."ArticleCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
