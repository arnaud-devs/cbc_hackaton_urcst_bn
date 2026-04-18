import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateTempPassword = (): string => {
  return randomBytes(8).toString("hex");
};
