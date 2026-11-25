import AppError from "../utils/AppError.js";
import { Request, Response, NextFunction } from "express";

const notFound = (req: Request, _res: Response, next: NextFunction) => {
  next(
    new AppError(
      404,
      "ROUTE_NOT_FOUND",
      `Cannot ${req.method} ${req.originalUrl}`,
    ),
  );
};

export default notFound;
