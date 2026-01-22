/**
 * @fileoverview Global Error Handler Middleware
 * @module presentation/middlewares/error-handler
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../../infrastructure';
import { logger } from '../../infrastructure';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Error caught by handler:', error);

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      error: {
        name: 'ValidationError',
        message: 'Validation failed',
        statusCode: 400,
        details: error.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
      },
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      error: { name: error.name, message: error.message, statusCode: error.statusCode },
    });
    return;
  }

  if (error.name === 'CastError') {
    res.status(400).json({
      success: false,
      error: { name: 'InvalidIdError', message: 'Invalid ID format', statusCode: 400 },
    });
    return;
  }

  const statusCode = 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message;

  res.status(statusCode).json({
    success: false,
    error: { name: 'InternalError', message, statusCode },
  });
}
