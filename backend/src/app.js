import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { dealerRouter } from './modules/dealer/dealer.routes.js';
import { dealerDocumentsRouter } from './modules/dealerDocuments/dealerDocuments.routes.js';
import { dealerVerificationRouter } from './modules/dealerVerification/dealerVerification.routes.js';
import { dashboardRouter } from './modules/dashboard/dashboard.routes.js';
import { superAdminRouter } from './modules/superAdmin/superAdmin.routes.js';

export const app = express();
app.use(helmet());
const allowedOrigins = new Set([
  'http://localhost:5173',
  'https://natraj-mobile-electronics.vercel.app',
  ...env.FRONTEND_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
]);
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) return callback(null, true);
    return callback(new Error('Origin is not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.get('/', (req, res) => {
  res.type('html').send('<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Natraj Finance API</title></head><body><strong>💰 Natraj Finance API is running.....</strong></body></html>');
});
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRouter);
app.use('/api/dealers', dealerRouter);
app.use('/api/dealers', dealerDocumentsRouter);
app.use('/api/admin/dealers', dealerVerificationRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/super-admin', superAdminRouter);
app.use(notFound);
app.use(errorHandler);
