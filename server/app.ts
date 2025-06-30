import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectMongoose } from '../src/lib/mongodb';
import webSocketManager from './websocket';
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
const server = http.createServer(app);

// Initialize WebSocket server
webSocketManager.initialize(server);

// Middleware
app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectMongoose().then(() => {
  console.log('✅ MongoDB connected successfully');
}).catch(err => {
  console.error('❌ MongoDB connection error:', err);
});

// Rate limiting - temporarily disabled
// app.use(rateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/experts', expertRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/security', securityRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    websocket: {
      connected: webSocketManager.getConnectedUserCount(),
      users: webSocketManager.getConnectedUserIds()
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (_req: express.Request, res: express.Response) => {
  res.status(404).json({
    success: false,
    message: 'API route not found',
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export default app; 