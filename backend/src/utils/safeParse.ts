import { z } from "zod";
import AppError from "./AppError.js";
const safeParse = <T extends z.ZodType>(schema: T, body: unknown) => {
  const result = schema.safeParse(body);

  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
      .join(", ");
    throw new AppError(400, "VALIDATION_ERROR", message);
  }

  return {
    success: true as const,
    data: result.data as z.infer<T>,
  };
};

export default safeParse;
