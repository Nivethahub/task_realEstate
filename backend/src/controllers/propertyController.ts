import type { Request, Response } from 'express';
import { Prisma, PropertyType, ListingType } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/appError';
import { asyncHandler } from '../utils/asyncHandler';
import { propertySchema } from '../validators/schemas';

const propertyInclude = { owner: { select: { id: true, name: true, phone: true, email: true } } } satisfies Prisma.PropertyInclude;

export const listProperties = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 12));
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : undefined;
  const bedrooms = req.query.bedrooms ? Number(req.query.bedrooms) : undefined;
  if ((minPrice !== undefined && (!Number.isFinite(minPrice) || minPrice < 0)) || (maxPrice !== undefined && (!Number.isFinite(maxPrice) || maxPrice < 0))) throw new AppError('Price filters must be valid positive numbers');
  if (bedrooms !== undefined && (!Number.isInteger(bedrooms) || bedrooms < 0)) throw new AppError('Bedrooms must be a valid number');

  const propertyType = req.query.propertyType as string | undefined;
  const listingType = req.query.listingType as string | undefined;
  if (propertyType && !Object.values(PropertyType).includes(propertyType as PropertyType)) throw new AppError('Invalid propertyType filter');
  if (listingType && !Object.values(ListingType).includes(listingType as ListingType)) throw new AppError('Invalid listingType filter');
  const sortBy = req.query.sortBy === 'price' ? 'price' : 'createdAt';
  const sortOrder = req.query.sortOrder === 'asc' ? 'asc' : 'desc';
  const cursor = typeof req.query.cursor === 'string' ? req.query.cursor : undefined;
  const useCursor = Boolean(cursor) && sortBy === 'createdAt';
  const orderBy: Prisma.PropertyOrderByWithRelationInput = sortBy === 'price' ? { price: sortOrder } : { createdAt: sortOrder };
  const city = String(req.query.city || '').trim();
  const q = String(req.query.q || '').trim();
  const where: Prisma.PropertyWhereInput = {
    isAvailable: true,
    isArchive:false,
    ...(city ? {
      OR: [
        { 
          city: { equals: city, mode: 'insensitive' } },
        { locality: { equals: city, mode: 'insensitive' } },
      ]
    } : {}),
    ...(q ? {
      AND: [{
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { address: { contains: q, mode: 'insensitive' } },
        ]
      }]
    } : {}),
    ...(propertyType ? { propertyType: propertyType as PropertyType } : {}),
    ...(listingType ? { listingType: listingType as ListingType } : {}),
    ...(bedrooms !== undefined ? { bedrooms } : {}),
    ...(minPrice !== undefined || maxPrice !== undefined ? { price: { ...(minPrice !== undefined ? { gte: minPrice } : {}), ...(maxPrice !== undefined ? { lte: maxPrice } : {}) } } : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.property.findMany({ where, include: propertyInclude, orderBy: [orderBy, { id: 'asc' }], ...(useCursor ? { cursor: { id: cursor! }, skip: 1, take: limit + 1 } : { skip: (page - 1) * limit, take: limit }) }),
    prisma.property.count({ where }),
  ]);
  const hasNextPage = useCursor ? items.length > limit : page * limit < total;
  const data = useCursor && hasNextPage ? items.slice(0, limit) : items;
  res.json({ success: true, data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNextPage, hasPreviousPage: page > 1 || Boolean(cursor), nextCursor: useCursor && hasNextPage ? data[data.length - 1]?.id : null } });
});

export const getProperty = asyncHandler(async (req: Request, res: Response) => {
  const property = await prisma.property.findUnique({ where: { id: req.params.id as string, isArchive: false }, include: propertyInclude });
  if (!property || !property.isAvailable) throw new AppError('Property not found', 404);
  res.json({ success: true, data: property });
});

export const createProperty = asyncHandler(async (req: Request, res: Response) => {
  console.log('datas', req.body);
  const data = propertySchema.parse(req.body);

  const property = await prisma.property.create({ data: { ...data, ownerId: req.user!.id }, include: propertyInclude });
  res.status(201).json({ success: true, message: 'Property created successfully', data: property });
});

export const updateProperty = asyncHandler(async (req: Request, res: Response) => {
  const data = propertySchema.partial().parse(req.body);
  const existing = await prisma.property.findUnique({ where: { id: req.params.id as string, isArchive: false } });
  if (!existing) throw new AppError('Property not found', 404);
  if (existing.ownerId !== req.user!.id) throw new AppError('You can only edit your own listings', 403);
  const property = await prisma.property.update({ where: { id: existing.id }, data, include: propertyInclude });
  res.json({ success: true, message: 'Property updated successfully', data: property });
});

export const deleteProperty = asyncHandler(async (req: Request, res: Response) => {
  const existing = await prisma.property.findUnique({ where: { id: req.params.id as string, isArchive: false } });
  if (!existing) throw new AppError('Property not found', 404);
  
  if (existing.ownerId !== req.user!.id) throw new AppError('You can only delete your own listings', 403);
  await prisma.property.update({ where: { id: existing.id,isArchive:false },data:{isArchive:true} });
  res.json({ success: true, message: 'Property deleted successfully' });
});

export const myProperties = asyncHandler(async (req: Request, res: Response) => {
  const properties = await prisma.property.findMany({ where: { ownerId: req.user!.id,isArchive:false }, include: propertyInclude, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: properties });
});

export const similarProperties = asyncHandler(async (req: Request, res: Response) => {
  const current = await prisma.property.findUnique({ where: { id: req.params.id as string } });
  if (!current) throw new AppError('Property not found', 404);
  const currentPrice = Number(current.price);
  const data = await prisma.property.findMany({
    where: {
      isAvailable: true, id: { not: current.id }, price: { gte: currentPrice * 0.7, lte: currentPrice * 1.3 }, OR: [
        { city: { equals: current.city, mode: 'insensitive' }, propertyType: current.propertyType },
        { city: { equals: current.city, mode: 'insensitive' }, bedrooms: current.bedrooms },
      ]
    },
    include: propertyInclude,
    orderBy: { createdAt: 'desc' }, take: 4,
  });
  res.json({ success: true, data });
});
