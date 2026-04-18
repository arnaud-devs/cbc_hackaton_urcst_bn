import { Request, Response } from "express";
import { prisma } from "../database/client";
import { CustomError } from "../utils/CustomError";
import { VALID_SLOTS } from "../utils/slots";

export const getMe = async (req: Request, res: Response) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, email: true, name: true, specialty: true, languages: true,
        phone: true, isAvailable: true, rating: true, totalSessions: true, createdAt: true,
        _count: { select: { bookings: true, feedback: true } },
      },
    });
    if (!doctor) throw new CustomError("Doctor not found", 404);
    res.json({ status: "success", data: doctor });
  } catch (error) {
    throw error;
  }
};

export const getDoctorBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { doctorId: req.user!.id },
      include: { service: { select: { name: true, durationMinutes: true } } },
      orderBy: { date: "desc" },
    });
    res.json({ status: "success", data: bookings });
  } catch (error) {
    throw error;
  }
};

export const getSchedule = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const todayDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    const bookings = await prisma.booking.findMany({
      where: { doctorId: req.user!.id, date: todayDate },
      include: { service: { select: { name: true } } },
      orderBy: { timeSlot: "asc" },
    });

    const bookedSlots = bookings.map((b) => b.timeSlot);
    const availableSlots = VALID_SLOTS.filter((s) => !bookedSlots.includes(s));

    res.json({
      status: "success",
      data: { date: todayDate.toISOString().split("T")[0], bookings, availableSlots },
    });
  } catch (error) {
    throw error;
  }
};

export const getDoctorFeedback = async (req: Request, res: Response) => {
  try {
    const feedback = await prisma.feedback.findMany({
      where: { doctorId: req.user!.id },
      orderBy: { createdAt: "desc" },
    });
    res.json({ status: "success", data: feedback });
  } catch (error) {
    throw error;
  }
};

export const toggleAvailability = async (req: Request, res: Response) => {
  try {
    const doctor = await prisma.doctor.findUnique({ where: { id: req.user!.id } });
    if (!doctor) throw new CustomError("Doctor not found", 404);

    const updated = await prisma.doctor.update({
      where: { id: req.user!.id },
      data: { isAvailable: !doctor.isAvailable },
      select: { id: true, name: true, isAvailable: true },
    });

    res.json({
      status: "success",
      message: `Availability set to ${updated.isAvailable ? "available" : "unavailable"}`,
      data: updated,
    });
  } catch (error) {
    throw error;
  }
};
