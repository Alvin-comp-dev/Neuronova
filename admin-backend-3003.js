const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3003;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3006'],
  credentials: true
}));
app.use(express.json());
// MongoDB connection
const mongoUri = 'mongodb+srv://neuronova-user:uW6YaOSchJCDPn48@neuronova-user.bjw3cre.mongodb.net/neuronova?retryWrites=true&w=majority&appName=neuronova-user';

mongoose.connect(mongoUri)
  .then(() => console.log('‚úÖ Connected to MongoDB'))
  .catch(err => console.error('‚ùå MongoDB connection error:', err));

// Simple User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  isVerified: { type: Boolean, default: false },
  preferences: Object,
  badges: [String],
  stats: Object,
  avatar: String,
  lastActive: Date,
}, { timestamps: true });

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

// Auth middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, 'neuronova_jwt_secret_key_change_this_in_production_2024');
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      error: 'Admin access required',
      userRole: req.user?.role || 'none'
    });
  }
  next();
};

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    const isValidPassword = await user.matchPassword(password);
    if (!isValidPassword) {
      console.log('Invalid password for:', email);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }

    user.lastActive = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id.toString() },
      'neuronova_jwt_secret_key_change_this_in_production_2024',
      { expiresIn: '7d' }
    );

    console.log('Login successful for:', email, 'Role:', user.role);
    res.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
        preferences: user.preferences,
        badges: user.badges,
        stats: user.stats,
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
});

// User profile route
app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id.toString(),
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      avatar: req.user.avatar,
      isVerified: req.user.isVerified,
      preferences: req.user.preferences,
      badges: req.user.badges,
      stats: req.user.stats,
    }
  });
});

// Admin Routes
app.get('/api/admin/users', authenticate, requireAdmin, async (req, res) => {
  try {
    console.log('Admin users request from:', req.user.email);
    
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    
    const adminUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.isVerified ? 'active' : 'pending',
      joinDate: user.createdAt.toISOString().split('T')[0],
      lastActive: user.lastActive ? user.lastActive.toISOString().split('T')[0] : 'Never',
      researchCount: user.stats?.articlesRead || 0,
      communitePosts: user.stats?.communitePosts || 0,
      achievements: user.stats?.achievements || 0,
      avatar: user.avatar,
      badges: user.badges || [],
      isVerified: user.isVerified,
    }));

    res.json({
      success: true,
      data: adminUsers,
      stats: {
        totalUsers: adminUsers.length,
        activeUsers: adminUsers.filter(u => u.status === 'active').length,
        pendingUsers: adminUsers.filter(u => u.status === 'pending').length,
        adminUsers: adminUsers.filter(u => u.role === 'admin').length,
        expertUsers: adminUsers.filter(u => u.role === 'expert').length,
        regularUsers: adminUsers.filter(u => u.role === 'user').length,
      }
    });

  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users'
    });
  }
});

app.get('/api/admin/stats', authenticate, requireAdmin, (req, res) => {
  console.log('Admin stats request from:', req.user.email);
  
  res.json({
    success: true,
    totalUsers: 1247,
    activeUsers: 89,
    totalResearch: 3456,
    pendingModeration: 12,
    systemHealth: 'healthy',
    serverUptime: '7d 14h 23m'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Neuronova Admin API is running',
    timestamp: new Date().toISOString(),
  });
});

// Basic bookmarks endpoint
app.get('/api/bookmarks', authenticate, (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Ì∫Ä Admin Backend server running on port ${PORT}`);
  console.log(`Ì¥ê Admin authentication enabled`);
  console.log(`Ì¥ó Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app;
