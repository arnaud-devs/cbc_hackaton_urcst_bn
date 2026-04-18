import { NextFunction, Request, Response } from "express";
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
  let stack: unknown = err.stack;

  if (err instanceof CustomError) {
    statusCode = err.status;
    details = err.details;
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
