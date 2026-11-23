import type { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/appError';
import { asyncHandler } from '../utils/asyncHandler';
import { inquirySchema } from '../validators/schemas';

export const createInquiry = asyncHandler(async (req: Request, res: Response) => {
  const { message } = inquirySchema.parse(req.body);
  const property = await prisma.property.findUnique({ where: { id: req.params.propertyId } });
  if (!property || !property.isAvailable) throw new AppError('Property not found', 404);
  if (property.ownerId === req.user!.id) throw new AppError('You cannot send an inquiry for your own property', 400);
  try {
    const inquiry = await prisma.inquiry.create({
      data: { propertyId: property.id, userId: req.user!.id, message },
      include: { property: { select: { id: true, title: true } }, user: { select: { id: true, name: true, email: true } } },
    });
    res.status(201).json({ success: true, message: 'Inquiry sent successfully', data: inquiry });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') throw new AppError('You have already sent an inquiry for this property', 409);
    throw error;
  }
});

export const myInquiries = asyncHandler(async (req: Request, res: Response) => {
  const data = await prisma.inquiry.findMany({ where: { userId: req.user!.id }, include: { property: { select: { id: true, title: true, city: true, price: true, images: true } } }, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
});

export const receivedInquiries = asyncHandler(async (req: Request, res: Response) => {
  const data = await prisma.inquiry.findMany({ where: { property: { ownerId: req.user!.id } }, include: { user: { select: { id: true, name: true, email: true, phone: true } }, property: { select: { id: true, title: true, city: true, locality: true } } }, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data });
});
