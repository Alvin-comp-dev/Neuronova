const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Mock database connection
let isConnected = false;

// Connect to MongoDB (with fallback)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/neuronova', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    isConnected = true;
  } catch (error) {
    console.log('⚠️ MongoDB connection failed, using mock data:', error.message);
    isConnected = false;
  }
};

// Mock data
const mockResearch = [
  {
    _id: '1',
    title: 'Revolutionary Brain-Computer Interface Breakthrough',
    authors: ['Dr. Sarah Chen', 'Prof. Michael Rodriguez'],
    abstract: 'This groundbreaking study demonstrates a 96% accuracy rate in brain-computer interface technology for paralyzed patients, representing a major leap forward in neurotech applications.',
    publicationDate: new Date('2024-01-15'),
    category: 'neurotech',
    citationCount: 145,
    doi: '10.1038/s41586-024-07123-4',
    journal: 'Nature',
    keywords: ['brain-computer interface', 'neural prosthetics', 'paralysis', 'neurotech'],
    status: 'published',
    impactScore: 9.2
  },
  {
    _id: '2',
    title: 'CRISPR 3.0: Precision Gene Editing with 99.7% Accuracy',
    authors: ['Dr. Lisa Wang', 'Dr. James Thompson'],
    abstract: 'New precision gene editing technique achieves unprecedented accuracy in treating genetic disorders, opening new possibilities for therapeutic applications.',
    publicationDate: new Date('2024-02-20'),
    category: 'gene-therapy',
    citationCount: 87,
    doi: '10.1126/science.abcd1234',
    journal: 'Science',
    keywords: ['CRISPR', 'gene editing', 'genetic disorders', 'precision medicine'],
    status: 'published',
    impactScore: 8.9
  },
  {
    _id: '3',
    title: 'AI Detects Alzheimer\'s Disease 15 Years Before Symptoms',
    authors: ['Dr. Emma Foster', 'Dr. Robert Kim'],
    abstract: 'Machine learning algorithm identifies early biomarkers of Alzheimer\'s disease with 94% accuracy, enabling unprecedented early intervention strategies.',
    publicationDate: new Date('2024-03-10'),
    category: 'ai-healthcare',
    citationCount: 203,
    doi: '10.1016/j.cell.2024.03.001',
    journal: 'Cell',
    keywords: ['Alzheimer\'s', 'early detection', 'machine learning', 'biomarkers'],
    status: 'published',
    impactScore: 9.5
  }
];

const mockUsers = [
  {
    _id: '1',
    name: 'Dr. Sarah Chen',
    email: 'sarah.chen@stanford.edu',
    role: 'expert',
    expertise: ['neurotech', 'brain-computer interfaces'],
    institution: 'Stanford University',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    _id: '2',
    name: 'Prof. Michael Rodriguez',
    email: 'mrodriguez@jhu.edu',
    role: 'expert',
    expertise: ['gene therapy', 'CRISPR technology'],
    institution: 'Johns Hopkins University',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'NeuroNova Backend is running!',
    timestamp: new Date().toISOString(),
    database: isConnected ? 'Connected' : 'Mock Mode',
    version: '1.0.0'
  });
});

app.get('/api/research', (req, res) => {
  const { category, limit = 10, page = 1 } = req.query;
  let filteredResearch = mockResearch;
  
  if (category && category !== 'all') {
    filteredResearch = mockResearch.filter(r => r.category === category);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedResearch = filteredResearch.slice(startIndex, endIndex);
  
  res.json({
    success: true,
    data: paginatedResearch,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(filteredResearch.length / limit),
      totalResults: filteredResearch.length,
      hasNextPage: endIndex < filteredResearch.length,
      hasPrevPage: page > 1
    }
  });
});

app.get('/api/research/:id', (req, res) => {
  const research = mockResearch.find(r => r._id === req.params.id);
  if (!research) {
    return res.status(404).json({
      success: false,
      error: 'Research not found'
    });
  }
  res.json({
    success: true,
    data: research
  });
});

app.get('/api/search', (req, res) => {
  const { q: query, category, limit = 10 } = req.query;
  let results = mockResearch;
  
  if (query) {
    const searchTerm = query.toLowerCase();
    results = mockResearch.filter(r => 
      r.title.toLowerCase().includes(searchTerm) ||
      r.abstract.toLowerCase().includes(searchTerm) ||
      r.authors.some(author => author.toLowerCase().includes(searchTerm)) ||
      r.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    );
  }
  
  if (category && category !== 'all') {
    results = results.filter(r => r.category === category);
  }
  
  res.json({
    success: true,
    data: results.slice(0, parseInt(limit)),
    query: query || '',
    totalResults: results.length
  });
});

app.get('/api/experts', (req, res) => {
  res.json({
    success: true,
    data: mockUsers.filter(u => u.role === 'expert')
  });
});

app.get('/api/research/stats', (req, res) => {
  res.json({
    success: true,
    data: {
      totalPapers: mockResearch.length,
      totalCitations: mockResearch.reduce((sum, r) => sum + r.citationCount, 0),
      averageImpactScore: mockResearch.reduce((sum, r) => sum + r.impactScore, 0) / mockResearch.length,
      categoriesCount: {
        neurotech: mockResearch.filter(r => r.category === 'neurotech').length,
        'gene-therapy': mockResearch.filter(r => r.category === 'gene-therapy').length,
        'ai-healthcare': mockResearch.filter(r => r.category === 'ai-healthcare').length
      }
    }
  });
});

app.get('/api/trending', (req, res) => {
  const trending = mockResearch
    .sort((a, b) => b.citationCount - a.citationCount)
    .slice(0, 5);
  
  res.json({
    success: true,
    data: trending
  });
});

// Catch all for API routes
app.get('/api/*', (req, res) => {
  res.json({
    success: true,
    message: `API endpoint ${req.path} is working`,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`
🚀 NeuroNova Backend Server Started Successfully!
📍 Server running on: http://localhost:${PORT}
🔍 Health check: http://localhost:${PORT}/api/health
📊 Research data: http://localhost:${PORT}/api/research
🔍 Search endpoint: http://localhost:${PORT}/api/search
👥 Experts: http://localhost:${PORT}/api/experts
📈 Stats: http://localhost:${PORT}/api/research/stats
🔥 Trending: http://localhost:${PORT}/api/trending

Database: ${isConnected ? '✅ MongoDB Connected' : '⚠️ Mock Mode (MongoDB not available)'}
Environment: ${process.env.NODE_ENV || 'development'}
Timestamp: ${new Date().toISOString()}
    `);
  });
};

startServer().catch(console.error); 