import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

export { prisma, connectDatabase };
