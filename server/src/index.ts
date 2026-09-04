import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { eventsRouter } from './routes/events.js';
import { ticketsRouter } from './routes/tickets.js';
import { analyticsRouter } from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS setup for local dev, Vercel frontend, and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_ORIGIN
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin or matching configured origins / vercel previews
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive for demo
    },
    credentials: true
  })
);

app.use(express.json());

// Ensure DB is connected before handling any API request
app.use(async (_req, _res, next) => {
  await connectDB();
  next();
});

// Health Check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Root API Welcome endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Community Event Ticket Hub API',
    version: '1.0.0',
    docs: '/api/events',
    status: 'online'
  });
});

app.get('/api', (_req, res) => {
  res.json({
    name: 'Community Event Ticket Hub API',
    version: '1.0.0',
    docs: '/api/events',
    status: 'online'
  });
});

// Mount routes on BOTH /api/* and root /* to support both Vercel Serverless Function & Standalone Express
app.use('/api/events', eventsRouter);
app.use('/events', eventsRouter);

app.use('/api/tickets', ticketsRouter);
app.use('/tickets', ticketsRouter);

app.use('/api/analytics', analyticsRouter);
app.use('/analytics', analyticsRouter);

// Global 404 Handler
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Start listening only in standalone/local environments
if (process.env.NODE_ENV !== 'production' || process.env.STANDALONE === 'true') {
  app.listen(PORT, () => {
    console.log(`[Server] Community Event Ticket Hub API running on port ${PORT}`);
  });
}

export default app;
