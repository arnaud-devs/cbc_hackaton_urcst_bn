-- CreateTable
CREATE TABLE "public"."Clinic" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "schedule" JSONB NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "services" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clinic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Clinic_id_name_address_idx" ON "public"."Clinic"("id", "name", "address");
