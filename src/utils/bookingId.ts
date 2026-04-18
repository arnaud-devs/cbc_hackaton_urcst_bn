import { prisma } from "../database/client";

export const generateBookingId = async (): Promise<string> => {
  const last = await prisma.booking.findFirst({ orderBy: { createdAt: "desc" } });
  if (!last) return "GC-001";
  const num = parseInt(last.id.replace("GC-", ""), 10);
  return `GC-${String(num + 1).padStart(3, "0")}`;
};
