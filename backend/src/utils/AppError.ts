class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code: string;


  constructor(
    statusCode: number = 500,
    code: string = "APP_ERROR",
    message: string,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;