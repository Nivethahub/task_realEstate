import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  phone: z.string().trim().max(20).optional(),
});
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });


export const propertySchema = z.object({
  title: z.string().trim().min(8,"Title must be at least 8 characters").max(160, "Title cannot exceed 160 characters"),
  description: z.string().trim().min(20,"Description must be at least 8 characters").max(5000,"Description cannot exceed 160 characters"),
  city: z.string().trim().min(2).max(80),
  locality: z.string().trim().min(2).max(100),
  isArchive: z.boolean().default(false),
  address: z.string().trim().min(5,"Address must be at least 5 characters").max(255, "Address cannot exceed 255 characters"),
  price: z.coerce.number().positive().max(999999999999),
  bedrooms: z.coerce.number().int().min(0).max(20),
  bathrooms: z.coerce.number().int().min(0).max(20),
  areaSqft: z.coerce.number().int().positive().max(1000000),
  propertyType: z.enum(['APARTMENT', 'INDEPENDENT_HOUSE', 'VILLA', 'PLOT', 'COMMERCIAL']),
  listingType: z.enum(['SALE', 'RENT']).default('SALE'),
  images: z.array(z.string().url()).max(10).default([]),
  amenities: z.array(z.string().trim().min(1).max(40)).max(30, "Maximum 30 amenities allowed").default([]),
});
export const inquirySchema = z.object({ message: z.string().trim().min(10).max(1000) });