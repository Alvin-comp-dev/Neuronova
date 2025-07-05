const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 
    ['https://neuronovatest1.vercel.app', 'https://neuronova-backend.vercel.app'] : 
    ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'neuronova_jwt_secret_key_change_this_in_production_2024';

// Mock database
let users = [
  {
    id: 1,
    email: 'admin@neuronova.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Admin User',
    role: 'admin',
    avatar: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    email: 'user@neuronova.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    name: 'Regular User',
    role: 'user',
    avatar: null,
    createdAt: new Date().toISOString()
  }
];

let research = [
  {
    id: 1,
    title: 'Neural Networks in Cognitive Science',
    abstract: 'This study examines the application of neural networks in understanding cognitive processes.',
    authors: ['Dr. Sarah Chen', 'Dr. Michael Rodriguez'],
    journal: 'Journal of Cognitive Science',
    publishedDate: '2024-01-15',
    category: 'Neuroscience',
    tags: ['neural networks', 'cognitive science', 'machine learning'],
    views: 1250,
    citations: 23,
    bookmarks: 45,
    likes: 78,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Quantum Computing Applications in Drug Discovery',
    abstract: 'Exploring how quantum computing can revolutionize pharmaceutical research and drug development.',
    authors: ['Dr. Lisa Wang', 'Dr. James Thompson'],
    journal: 'Nature Quantum Computing',
    publishedDate: '2024-01-10',
    category: 'Quantum Computing',
    tags: ['quantum computing', 'drug discovery', 'pharmaceuticals'],
    views: 890,
    citations: 15,
    bookmarks: 32,
    likes: 56,
    createdAt: new Date().toISOString()
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// === ROUTES ===

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'NeuroNova Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// System status
app.get('/api/system/status', (req, res) => {
  res.json({
    success: true,
    data: {
      system: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        platform: process.platform
      },
      cache: {
        hits: Math.floor(Math.random() * 10000),
        misses: Math.floor(Math.random() * 1000),
        size: Math.floor(Math.random() * 500)
      },
      rateLimits: {
        total: 100,
        active: Math.floor(Math.random() * 20)
      }
    }
  });
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role: 'user',
      avatar: null,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Create token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar
    }
  });
});

// Research routes
app.get('/api/research', (req, res) => {
  const { category, limit = 10, search } = req.query;
  
  let filteredResearch = research;
  
  if (category) {
    filteredResearch = filteredResearch.filter(r => r.category === category);
  }
  
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredResearch = filteredResearch.filter(r =>
      r.title.toLowerCase().includes(searchTerm) ||
      r.abstract.toLowerCase().includes(searchTerm) ||
      r.authors.some(author => author.toLowerCase().includes(searchTerm))
    );
  }
  
  res.json({
    success: true,
    data: filteredResearch.slice(0, parseInt(limit)),
    total: filteredResearch.length
  });
});

app.get('/api/research/:id', (req, res) => {
  const paper = research.find(r => r.id === parseInt(req.params.id));
  if (!paper) {
    return res.status(404).json({ success: false, message: 'Research paper not found' });
  }
  
  res.json({
    success: true,
    data: paper
  });
});

app.post('/api/research', authenticateToken, (req, res) => {
  try {
    const { title, abstract, authors, journal, category, tags } = req.body;
    
    const newResearch = {
      id: research.length + 1,
      title,
      abstract,
      authors,
      journal,
      publishedDate: new Date().toISOString().split('T')[0],
      category,
      tags: tags || [],
      views: 0,
      citations: 0,
      bookmarks: 0,
      likes: 0,
      createdAt: new Date().toISOString()
    };
    
    research.push(newResearch);
    
    res.json({
      success: true,
      message: 'Research paper published successfully',
      data: newResearch
    });
  } catch (error) {
    console.error('Research creation error:', error);
    res.status(500).json({ success: false, message: 'Failed to publish research' });
  }
});

// Search routes
app.get('/api/search', (req, res) => {
  const { q, type = 'research', limit = 10 } = req.query;
  
  if (!q) {
    return res.status(400).json({ success: false, message: 'Search query required' });
  }
  
  const searchTerm = q.toLowerCase();
  let results = [];
  
  if (type === 'research' || type === 'all') {
    const researchResults = research.filter(r =>
      r.title.toLowerCase().includes(searchTerm) ||
      r.abstract.toLowerCase().includes(searchTerm) ||
      r.authors.some(author => author.toLowerCase().includes(searchTerm)) ||
      r.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    ).map(r => ({ ...r, type: 'research' }));
    
    results = results.concat(researchResults);
  }
  
  if (type === 'users' || type === 'all') {
    const userResults = users.filter(u =>
      u.name.toLowerCase().includes(searchTerm) ||
      u.email.toLowerCase().includes(searchTerm)
    ).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
      type: 'user'
    }));
    
    results = results.concat(userResults);
  }
  
  res.json({
    success: true,
    data: results.slice(0, parseInt(limit)),
    total: results.length,
    query: q
  });
});

// Admin routes
app.get('/api/admin/stats', authenticateToken, requireAdmin, (req, res) => {
  res.json({
    success: true,
    data: {
      users: {
        total: users.length,
        active: users.filter(u => u.role === 'user').length,
        admins: users.filter(u => u.role === 'admin').length
      },
      research: {
        total: research.length,
        published: research.length,
        categories: [...new Set(research.map(r => r.category))].length
      },
      activity: {
        totalViews: research.reduce((sum, r) => sum + r.views, 0),
        totalCitations: research.reduce((sum, r) => sum + r.citations, 0),
        totalBookmarks: research.reduce((sum, r) => sum + r.bookmarks, 0)
      }
    }
  });
});

app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  const safeUsers = users.map(({ password, ...user }) => user);
  res.json({
    success: true,
    data: safeUsers
  });
});

// Analytics routes
app.get('/api/analytics/dashboard', authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: {
      overview: {
        totalResearch: research.length,
        totalViews: research.reduce((sum, r) => sum + r.views, 0),
        totalUsers: users.length,
        totalCategories: [...new Set(research.map(r => r.category))].length
      },
      trending: research.sort((a, b) => b.views - a.views).slice(0, 5),
      recentActivity: research.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/system/status',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'GET /api/research',
      'GET /api/research/:id',
      'POST /api/research',
      'GET /api/search',
      'GET /api/admin/stats',
      'GET /api/admin/users',
      'GET /api/analytics/dashboard'
    ]
  });
});

// For Vercel serverless functions
if (process.env.NODE_ENV === 'production') {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`NeuroNova Backend running on port ${PORT}`);
  });
} 