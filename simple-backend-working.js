const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Mock data
const mockResearch = [
  {
    id: '1',
    title: 'Neural Networks in Brain Surgery',
    authors: ['Dr. Smith', 'Dr. Johnson'],
    abstract: 'This study explores the application of neural networks in precision brain surgery.',
    publicationDate: '2024-01-15',
    category: 'neuroscience',
    citationCount: 45
  },
  {
    id: '2',
    title: 'Gene Therapy Breakthrough',
    authors: ['Dr. Brown', 'Dr. Davis'],
    abstract: 'A new approach to gene therapy shows promising results in clinical trials.',
    publicationDate: '2024-02-20',
    category: 'genetics',
    citationCount: 32
  }
];

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/api/research', (req, res) => {
  res.json({
    success: true,
    data: mockResearch,
    total: mockResearch.length
  });
});

app.get('/api/research/:id', (req, res) => {
  const research = mockResearch.find(r => r.id === req.params.id);
  if (research) {
    res.json({ success: true, data: research });
  } else {
    res.status(404).json({ success: false, error: 'Research not found' });
  }
});

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    data: {
      user: { id: '1', name: 'Test User', email: 'test@example.com' },
      token: 'mock-jwt-token'
    }
  });
});

app.get('/api/discussions', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: '1',
        title: 'What are the latest developments in CRISPR?',
        content: 'I am curious about recent CRISPR breakthroughs...',
        author: { name: 'Research Student', avatar: null },
        createdAt: new Date().toISOString(),
        replies: 3,
        likes: 12
      }
    ]
  });
});

// Catch all handler for frontend routes
app.get('*', (req, res) => {
  res.json({ 
    message: 'Backend is working! Frontend should connect to this API.',
    availableEndpoints: [
      'GET /api/health',
      'GET /api/research',
      'GET /api/research/:id',
      'POST /api/auth/login',
      'GET /api/discussions'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple backend server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
}); 