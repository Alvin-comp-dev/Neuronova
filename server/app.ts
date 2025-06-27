import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { errorHandler } from './middleware/errorHandler';
// import { rateLimiter } from './middleware/rateLimiter';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import researchRoutes from './routes/research';
import communityRoutes from './routes/community';
import expertRoutes from './routes/expert';
import notificationRoutes from './routes/notification';
import analyticsRoutes from './routes/analytics';
import enterpriseRoutes from './routes/enterprise';
import securityRoutes from './routes/security';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3001;

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: process.env['NODE_ENV'] === 'production' 
    ? ['https://neuronova.com'] 
    : ['http://localhost:3000', 'http://localhost:3002'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting - temporarily disabled
// app.use(rateLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Neuronova API is running',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

if (process.env['NODE_ENV'] !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env['NODE_ENV']}`);
  });
}

export default app; 