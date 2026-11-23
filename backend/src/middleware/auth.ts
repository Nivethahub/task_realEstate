import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { AppError } from '../utils/appError';

export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) throw new AppError('Authentication required', 401);
    const token = header.slice(7);
    const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
    if (!payload.sub || typeof payload.sub !== 'string') throw new AppError('Invalid token', 401);
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { id: true, name: true, email: true } });
    if (!user) throw new AppError('User no longer exists', 401);
    req.user = user;
    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError('Invalid or expired token', 401));
  }
}
