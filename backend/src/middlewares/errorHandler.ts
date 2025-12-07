import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import AppError from "../utils/appError";

export const zodErrorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));

    res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: formattedErrors,
    });

    return;
  }

  next(err);
};

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
