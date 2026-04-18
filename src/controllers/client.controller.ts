import { Request, Response } from "express";
import { prisma } from "../database/client";
import { CustomError } from "../utils/CustomError";
import { generateBookingId } from "../utils/bookingId";
import { VALID_SLOTS } from "../utils/slots";

export const getPublicDoctors = async (req: Request, res: Response) => {
  try {
    const doctors = await prisma.doctor.findMany({
      select: {
        id: true, name: true, specialty: true, languages: true,
        isAvailable: true, rating: true, totalSessions: true,
        services: { select: { id: true, name: true, durationMinutes: true } },
      },
      orderBy: { name: "asc" },
    });
    res.json({ status: "success", data: doctors });
  } catch (error) {
    throw error;
  }
};

export const getPublicDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      select: {
        id: true, name: true, specialty: true, languages: true,
        isAvailable: true, rating: true, totalSessions: true,
        services: { select: { id: true, name: true, durationMinutes: true } },
      },
    });
    if (!doctor) throw new CustomError("Doctor not found", 404);
    res.json({ status: "success", data: doctor });
  } catch (error) {
    throw error;
  }
};

export const getServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    res.json({ status: "success", data: services });
  } catch (error) {
    throw error;
  }
};

export const getAvailableDoctors = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const todayDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

    const doctors = await prisma.doctor.findMany({
      where: { isAvailable: true },
      select: {
        id: true, name: true, specialty: true, languages: true,
        rating: true, totalSessions: true,
        services: { select: { id: true, name: true, durationMinutes: true } },
        bookings: {
          where: { date: todayDate },
          select: { timeSlot: true },
        },
      },
    });

    const result = doctors.map((d) => {
      const bookedSlots = d.bookings.map((b) => b.timeSlot);
      const availableSlots = VALID_SLOTS.filter((s) => !bookedSlots.includes(s));
      const { bookings: _, ...doctorData } = d;
      return { ...doctorData, availableSlots };
    });

    res.json({ status: "success", data: result });
  } catch (error) {
    throw error;
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      serviceId, doctorId, clientPhone, clientAge, clientSex,
      clientLanguage, clientAddress, clientDetail, date, timeSlot,
    } = req.body;

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      include: { services: { select: { id: true } } },
    });

    const service = await prisma.service.findUnique({ where: { id: serviceId } });

    if (!service || !service.isActive) throw new CustomError("Service not found or inactive", 404);
    if (!doctor) throw new CustomError("Doctor not found", 404);
    if (!doctor.isAvailable) throw new CustomError("Doctor is currently unavailable", 409);

    const offersService = doctor.services.some((s) => s.id === serviceId);
    if (!offersService) throw new CustomError("This doctor does not offer the selected service", 400);

    const bookingDate = new Date(date + "T00:00:00.000Z");

    const conflict = await prisma.booking.findFirst({
      where: { doctorId, date: bookingDate, timeSlot },
    });
    if (conflict) throw new CustomError("This time slot is already booked for the selected doctor", 409);

    const id = await generateBookingId();

    const booking = await prisma.booking.create({
      data: {
        id, serviceId, doctorId, clientPhone, clientAge, clientSex,
        clientLanguage, clientAddress, clientDetail, date: bookingDate, timeSlot,
      },
      include: {
        service: { select: { name: true } },
        doctor: { select: { name: true, specialty: true } },
      },
    });

    res.status(201).json({
      status: "success",
      message: "Booking created successfully. Save your booking ID to track status.",
      data: booking,
    });
  } catch (error) {
    throw error;
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: { select: { name: true, durationMinutes: true } },
        doctor: { select: { name: true, specialty: true } },
      },
    });

    if (!booking) throw new CustomError("Booking not found", 404);
    res.json({ status: "success", data: booking });
  } catch (error) {
    throw error;
  }
};

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { doctorId, bookingId, rating, comment } = req.body;

    const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctor) throw new CustomError("Doctor not found", 404);

    if (bookingId) {
      const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (!booking) throw new CustomError("Booking not found", 404);

      const existing = await prisma.feedback.findUnique({ where: { bookingId } });
      if (existing) throw new CustomError("Feedback already submitted for this booking", 409);
    }

    const feedback = await prisma.feedback.create({
      data: { doctorId, bookingId, rating, comment },
    });

    const { _avg } = await prisma.feedback.aggregate({
      where: { doctorId },
      _avg: { rating: true },
    });

    await prisma.doctor.update({
      where: { id: doctorId },
      data: { rating: _avg.rating ?? 0 },
    });

    res.status(201).json({ status: "success", message: "Thank you for your feedback", data: feedback });
  } catch (error) {
    throw error;
  }
};
