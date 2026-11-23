import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env';
import { setupSwagger } from './config/swagger';
import authRoutes from './routes/authRoutes';
import propertyRoutes from './routes/propertyRoutes';
import inquiryRoutes from './routes/inquiryRoutes';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
console.log('env',env);

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use('/api', rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: 'draft-7', legacyHeaders: false }));

app.get('/health', (_req, res) => res.json({ success: true, message: 'Real Estate API is healthy' }));
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/inquiries', inquiryRoutes);
setupSwagger(app);
app.use(notFound);
app.use(errorHandler);

export default app;
