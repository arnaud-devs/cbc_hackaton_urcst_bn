import { Request, Response } from "express";
import { prisma } from "../database/client";
import { hashPassword, generateTempPassword } from "../utils/password";
import { CustomError } from "../utils/CustomError";

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const getDashboard = async (req: Request, res: Response) => {
  try {
    const [
      totalDoctors,
      availableDoctors,
      totalArticles,
      totalChatLogs,
      bookingGroups,
      recentBookings,
    ] = await Promise.all([
      prisma.doctor.count(),
      prisma.doctor.count({ where: { isAvailable: true } }),
      prisma.article.count(),
      prisma.chatLog.count(),
      prisma.booking.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { doctor: { select: { name: true } }, service: { select: { name: true } } },
      }),
    ]);

    const bookings = bookingGroups.reduce(
      (acc, g) => ({ ...acc, [g.status]: g._count._all }),
      { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0, total: 0 } as Record<string, number>
    );
    bookings.total = bookingGroups.reduce((sum, g) => sum + g._count._all, 0);

    res.json({
      status: "success",
      data: { totalDoctors, availableDoctors, totalArticles, totalChatLogs, bookings, recentBookings },
    });
  } catch (error) {
    throw error;
  }
};

// ─── Doctors ──────────────────────────────────────────────────────────────────

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const { email, name, specialty, languages, phone } = req.body;

    const exists = await prisma.doctor.findUnique({ where: { email } });
    if (exists) throw new CustomError("A doctor with this email already exists", 409);

    const tempPassword = generateTempPassword();
    const hashed = await hashPassword(tempPassword);

    const doctor = await prisma.doctor.create({
      data: { email, name, specialty, languages, phone, password: hashed },
      select: { id: true, email: true, name: true, specialty: true, languages: true, phone: true, createdAt: true },
    });

    res.status(201).json({
      status: "success",
      message: "Doctor created. Share the temporary password securely — it will not be shown again.",
      data: { doctor, temporaryPassword: tempPassword },
    });
  } catch (error) {
    throw error;
  }
};

export const getDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true, email: true, name: true, specialty: true, languages: true,
        phone: true, isAvailable: true, rating: true, totalSessions: true, createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ status: "success", data: doctors });
  } catch (error) {
    throw error;
  }
};

export const deleteDoctor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await prisma.doctor.findUnique({ where: { id } });
    if (!doctor) throw new CustomError("Doctor not found", 404);

    await prisma.doctor.delete({ where: { id } });
    res.json({ status: "success", message: "Doctor deleted successfully" });
  } catch (error) {
    throw error;
  }
};

// ─── Bookings ─────────────────────────────────────────────────────────────────

export const getAdminBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        doctor: { select: { name: true, specialty: true } },
        service: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json({ status: "success", data: bookings });
  } catch (error) {
    throw error;
  }
};

// ─── Chat Logs ────────────────────────────────────────────────────────────────

export const getChatLogs = async (req: Request, res: Response) => {
  try {
    const logs = await prisma.chatLog.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ status: "success", data: logs });
  } catch (error) {
    throw error;
  }
};

// ─── Articles ─────────────────────────────────────────────────────────────────

export const createAdminArticle = async (req: Request, res: Response) => {
  try {
    const { title, content, category } = req.body;
    const adminId = req.user!.id;

    const article = await prisma.article.create({
      data: { title, content, category, adminId },
    });

    res.status(201).json({ status: "success", message: "Article created", data: article });
  } catch (error) {
    throw error;
  }
};

export const getAdminArticles = async (req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      include: { admin: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json({ status: "success", data: articles });
  } catch (error) {
    throw error;
  }
};

export const deleteAdminArticle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) throw new CustomError("Article not found", 404);

    await prisma.article.delete({ where: { id } });
    res.json({ status: "success", message: "Article deleted successfully" });
  } catch (error) {
    throw error;
  }
};

// ─── Services ─────────────────────────────────────────────────────────────────

export const createService = async (req: Request, res: Response) => {
  try {
    const { name, description, durationMinutes } = req.body;
    const service = await prisma.service.create({ data: { name, description, durationMinutes } });
    res.status(201).json({ status: "success", message: "Service created", data: service });
  } catch (error) {
    throw error;
  }
};

export const getAdminServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ status: "success", data: services });
  } catch (error) {
    throw error;
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) throw new CustomError("Service not found", 404);

    await prisma.service.delete({ where: { id } });
    res.json({ status: "success", message: "Service deleted successfully" });
  } catch (error) {
    throw error;
  }
};
