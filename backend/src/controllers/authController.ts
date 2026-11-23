import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { AppError } from '../utils/appError';
import { asyncHandler } from '../utils/asyncHandler';
import { loginSchema, registerSchema } from '../validators/schemas';

const SESSION_TTL_MS = 2 * 60 * 60 * 1000;
const hashToken = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

async function issueTokens(userId: string) {
  const accessToken = jwt.sign({}, env.JWT_SECRET, { subject: userId, expiresIn: '2h' });
  const refreshToken = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  await prisma.refreshToken.create({ data: { userId, tokenHash: hashToken(refreshToken), expiresAt } });
  return { token: accessToken, refreshToken, expiresAt };
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  console.log(data)
  const exists = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (exists) throw new AppError('An account with this email already exists', 409);
  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: { name: data.name, email: data.email.toLowerCase(), passwordHash, phone: data.phone },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });
  console.log(user);
  
  const tokens = await issueTokens(user.id);
  res.status(201).json({ success: true, message: 'Account created successfully', data: { user, ...tokens } });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: data.email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) throw new AppError('Invalid email or password', 401);
  const safeUser = { id: user.id, name: user.name, email: user.email, phone: user.phone };
  const tokens = await issueTokens(user.id);
  res.json({ success: true, message: 'Login successful', data: { user: safeUser, ...tokens } });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = zRefreshToken(req.body?.refreshToken);
  const tokenHash = hashToken(refreshToken);
  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash }, include: { user: { select: { id: true, name: true, email: true } } } });
  if (!stored || stored.revokedAt || stored.expiresAt <= new Date()) throw new AppError('Refresh token is invalid or expired', 401);
  // Atomic revoke prevents the same refresh token being rotated twice.
  const claimed = await prisma.refreshToken.updateMany({ where: { id: stored.id, revokedAt: null }, data: { revokedAt: new Date() } });
  if (claimed.count !== 1) throw new AppError('Refresh token has already been used', 401);
  const tokens = await issueTokens(stored.userId);
  res.json({ success: true, data: { user: stored.user, ...tokens } });
});

function zRefreshToken(value: unknown): string {
  if (typeof value !== 'string' || value.length < 40 || value.length > 200) throw new AppError('A valid refreshToken is required', 400);
  return value;
}

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = zRefreshToken(req.body?.refreshToken);
  await prisma.refreshToken.updateMany({ where: { tokenHash: hashToken(refreshToken), revokedAt: null }, data: { revokedAt: new Date() } });
  res.json({ success: true, message: 'Logged out successfully' });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  res.json({ success: true, data: { user: req.user } });
});
