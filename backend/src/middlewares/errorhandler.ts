import AppError from "../utils/AppError.js";
import { Request, Response, NextFunction } from "express";

type ParseError = Error & {
  type?: string;
  code?: string
};

const errorHandler = (
  err: ParseError,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: {
        code: "INVALID JSON",
        message: "Request body is not valid JSON",
      },
    });
  }

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      error: {
        code: "EMAIL_TAKEN",
        message: "Email is already taken",
      },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  return res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went Wrong",
    },
  });
};

export default errorHandler;
