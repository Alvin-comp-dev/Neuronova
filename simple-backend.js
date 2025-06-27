const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 3002;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3006'],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
const mongoUri = 'mongodb+srv://neuronova-user:uW6YaOSchJCDPn48@neuronova-user.bjw3cre.mongodb.net/neuronova?retryWrites=true&w=majority&appName=neuronova-user';

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

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

    console.log('Login successful for:', email);
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Neuronova API is running',
    timestamp: new Date().toISOString(),
  });
});

// Basic bookmarks endpoint (return empty array to fix 401 errors)
app.get('/api/bookmarks', authenticate, (req, res) => {
  res.json({
    success: true,
    data: []
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`🌍 Environment: development`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

module.exports = app; 