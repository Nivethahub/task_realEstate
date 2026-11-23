import type { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { AppError } from '../utils/appError';

export function notFound(_req: Request, _res: Response, next: NextFunction) {
  next(new AppError('Route not found', 404));
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  
  
  if (error instanceof ZodError) {
    const messages = error.issues.map((issue) => issue.message);
    console.log('messages',messages);
    
    res.status(400).json({ success: false, message: messages, errors: error.flatten().fieldErrors });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      res.status(409).json({ success: false, message: 'This record already exists.' });
      return;
    }
    if (error.code === 'P2025') {
      res.status(404).json({ success: false, message: 'Record not found.' });
      return;
    }
  }
  const status = error instanceof AppError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : 'Internal server error';
  if (status >= 500) console.error(error);
  res.status(status).json({ success: false, message: status === 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : message });
}
