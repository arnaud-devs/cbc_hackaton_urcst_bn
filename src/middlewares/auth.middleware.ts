import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";
import { CustomError } from "../utils/CustomError";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (role: "admin" | "doctor") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw new CustomError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = verifyToken(token);
      if (payload.role !== role) {
        throw new CustomError("Forbidden: insufficient permissions", 403);
      }
      req.user = payload;
      next();
    } catch (err) {
      if (err instanceof CustomError) throw err;
      throw new CustomError("Invalid or expired token", 401);
    }
  };
};
