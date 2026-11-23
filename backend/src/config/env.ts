import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();
console.log('ENV FILE CHECK:', {
  cwd: process.cwd(),
  clientUrl: process.env.CLIENT_URL,
});
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5001),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
});

export const env = envSchema.parse(process.env);
