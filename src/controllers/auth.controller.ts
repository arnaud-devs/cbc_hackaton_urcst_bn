import { Request, Response } from "express";
import { prisma } from "../database/client";
import { comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { CustomError } from "../utils/CustomError";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) throw new CustomError("Invalid credentials", 401);

    const valid = await comparePassword(password, admin.password);
    if (!valid) throw new CustomError("Invalid credentials", 401);

    const token = signToken({ id: admin.id, role: "admin", email: admin.email });

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        admin: { id: admin.id, email: admin.email, name: admin.name },
      },
    });
  } catch (error) {
    throw error;
  }
};

export const doctorLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const doctor = await prisma.doctor.findUnique({ where: { email } });
    if (!doctor) throw new CustomError("Invalid credentials", 401);

    const valid = await comparePassword(password, doctor.password);
    if (!valid) throw new CustomError("Invalid credentials", 401);

    const token = signToken({ id: doctor.id, role: "doctor", email: doctor.email });

    res.json({
      status: "success",
      message: "Login successful",
      data: {
        token,
        doctor: {
          id: doctor.id,
          email: doctor.email,
          name: doctor.name,
          specialty: doctor.specialty,
        },
      },
    });
  } catch (error) {
    throw error;
  }
};
