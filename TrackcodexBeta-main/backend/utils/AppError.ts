/**
 * AppError: Standardized Error for Operational Failures
 * Use this for expected errors (Validation, Auth, 404s) that are NOT bugs.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true; // Marks this as a trusted error, not a crash

    // Capture stack trace but exclude constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common Factory Methods for consistency
export const BadRequest = (message: string, code = "BAD_REQUEST") =>
  new AppError(message, 400, code);

export const Unauthorized = (message = "Unauthorized", code = "UNAUTHORIZED") =>
  new AppError(message, 401, code);

export const Forbidden = (message = "Forbidden", code = "FORBIDDEN") =>
  new AppError(message, 403, code);

export const NotFound = (message = "Resource not found", code = "NOT_FOUND") =>
  new AppError(message, 404, code);

export const Conflict = (message: string, code = "CONFLICT") =>
  new AppError(message, 409, code);

export const InternalError = (message = "Internal Server Error") =>
  new AppError(message, 500, "INTERNAL_ERROR"); // Use sparingly
