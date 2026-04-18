import jwt from "jsonwebtoken";
import config from "../config/config";

export interface JwtPayload {
  id: string;
  role: "admin" | "doctor";
  email: string;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
};
