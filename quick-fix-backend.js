const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // API Routes
  if (parsedUrl.pathname.startsWith('/api/')) {
    if (parsedUrl.pathname === '/api/health') {
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'OK', message: 'Backend is working!' }));
    } else if (parsedUrl.pathname === '/api/research') {
      res.writeHead(200);
      res.end(JSON.stringify({
        success: true,
        data: [
          { id: '1', title: 'Neural Networks Research', authors: ['Dr. Smith'], category: 'neuroscience' },
          { id: '2', title: 'Gene Therapy Study', authors: ['Dr. Johnson'], category: 'genetics' }
        ]
      }));
    } else {
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'API endpoint working', path: parsedUrl.pathname }));
    }
  } else {
    // Default response
    res.writeHead(200);
    res.end(JSON.stringify({ 
      message: 'Backend server is running!',
      endpoints: ['/api/health', '/api/research'],
      timestamp: new Date().toISOString()
    }));
  }
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`✅ Simple backend running on http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Research data: http://localhost:${PORT}/api/research`);
}); 