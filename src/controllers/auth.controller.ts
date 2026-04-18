import { Request, Response } from "express";
import { prisma } from "../database/client";
import { comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";
import { CustomError } from "../utils/CustomError";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Try admin first, then doctor
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (admin) {
      const valid = await comparePassword(password, admin.password);
      if (!valid) throw new CustomError("Invalid credentials", 401);

      const token = signToken({ id: admin.id, role: "admin", email: admin.email });

      return res.json({
        status: "success",
        message: "Login successful",
        data: {
          token,
          role: "admin",
          user: { id: admin.id, email: admin.email, name: admin.name },
        },
      });
    }

    const doctor = await prisma.doctor.findUnique({ where: { email } });

    if (doctor) {
      const valid = await comparePassword(password, doctor.password);
      if (!valid) throw new CustomError("Invalid credentials", 401);

      const token = signToken({ id: doctor.id, role: "doctor", email: doctor.email });

      return res.json({
        status: "success",
        message: "Login successful",
        data: {
          token,
          role: "doctor",
          user: {
            id: doctor.id,
            email: doctor.email,
            name: doctor.name,
            specialty: doctor.specialty,
          },
        },
      });
    }

    throw new CustomError("Invalid credentials", 401);
  } catch (error) {
    throw error;
  }
};
