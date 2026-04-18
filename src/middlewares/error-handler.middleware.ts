import { NextFunction, Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { CustomError } from "../utils/CustomError";
import config from "../config/config";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = err.message || "Internal Server Error";
  let details: unknown = undefined;
  const stack: unknown = err.stack;

  if (err instanceof CustomError) {
    statusCode = err.status;
    details = err.details;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        statusCode = 404;
        message = "Record not found";
        break;
      case "P2002":
        statusCode = 409;
        message = "A record with this value already exists";
        break;
      case "P2003":
        statusCode = 400;
        message = "Invalid reference: related record not found";
        break;
      default:
        statusCode = 400;
        message = "Database operation failed";
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid ID format";
  }

  console.error(err);

  res.status(statusCode).json({
    status: "error",
    message,
    details,
    ...(config.nodeEnv === "development" && { stack }),
  });

  return;
};

export default errorHandler;
