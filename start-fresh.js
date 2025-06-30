const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple research data
const sampleResearch = [
  {
    id: 1,
    title: "Neural Network Optimization",
    author: "Dr. Smith",
    summary: "Advanced techniques for neural network optimization",
    category: "AI/ML",
    date: "2024-01-15",
    likes: 42,
    bookmarked: false
  },
  {
    id: 2,
    title: "Quantum Computing Applications",
    author: "Dr. Johnson",
    summary: "Practical applications of quantum computing in healthcare",
    category: "Quantum",
    date: "2024-01-10",
    likes: 38,
    bookmarked: true
  }
];

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running successfully!' });
});

app.get('/api/research', (req, res) => {
  res.json(sampleResearch);
});

app.get('/api/research/:id', (req, res) => {
  const research = sampleResearch.find(r => r.id === parseInt(req.params.id));
  if (research) {
    res.json(research);
  } else {
    res.status(404).json({ error: 'Research not found' });
  }
});

// Start the backend server
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Research data: http://localhost:${PORT}/api/research`);
  
  // Start the frontend after a short delay
  setTimeout(() => {
    console.log('\n🚀 Starting frontend...');
    
    // Clear the corrupted build first
    const { exec } = require('child_process');
    exec('rm -rf .next', (error) => {
      if (error) {
        console.log('Note: Could not remove .next directory (may not exist)');
      }
      
      // Start Next.js development server
      const nextProcess = spawn('npm', ['run', 'dev:frontend'], {
        stdio: 'inherit',
        shell: true,
        env: {
          ...process.env,
          PORT: '3000',
          NEXT_PUBLIC_API_URL: `http://localhost:${PORT}`
        }
      });
      
      nextProcess.on('error', (err) => {
        console.error('Failed to start frontend:', err);
      });
    });
  }, 2000);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
}); 