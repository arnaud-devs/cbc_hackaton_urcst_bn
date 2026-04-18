import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { ZodSchema } from "zod";

export const validate = (
  schema: Joi.ObjectSchema,
  property: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req[property] ?? {}, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        details: error.details.map((err) => err.message),
      });
    }
    next();
  };
};

export const validateZod = (
  schema: ZodSchema,
  property: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[property] ?? {});
    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation error",
        details: result.error.issues.map((issue) =>
          issue.path.length ? `${issue.path.join(".")}: ${issue.message}` : issue.message
        ),
      });
    }
    req[property] = result.data;
    next();
  };
};
