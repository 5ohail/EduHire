import { NextFunction, Request, Response } from 'express';

type KnownError = Error & { statusCode?: number; details?: unknown };

// Standardized error response middleware
export function errorHandler(err: KnownError, _req: Request, res: Response, _next: NextFunction) {
  const status = err.statusCode && Number.isInteger(err.statusCode) ? err.statusCode : 500;
  const isProd = process.env.NODE_ENV === 'production';

  const payload: Record<string, unknown> = {
    success: false,
    message: err.message || 'Internal Server Error',
  };

  if (!isProd) {
    payload.stack = err.stack;
    if (err.details) payload.details = err.details;
  }

  // eslint-disable-next-line no-console
  if (status >= 500) console.error(err);

  res.status(status).json(payload);
}


