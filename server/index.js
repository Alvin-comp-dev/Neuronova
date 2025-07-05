// Simple Vercel serverless function
module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { url, method } = req;

  try {
    // Health check endpoint
    if (url === '/api/health' || url === '/health') {
      return res.status(200).json({
        status: 'OK',
        message: 'Neuronova API is running on Vercel',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production',
        method: method,
        url: url
      });
    }

    // Test endpoint
    if (url === '/api/test' || url === '/test') {
      return res.status(200).json({
        message: 'Backend is working!',
        timestamp: new Date().toISOString(),
        method: method,
        url: url
      });
    }

    // Auth test endpoint
    if ((url === '/api/auth/test' || url === '/auth/test') && method === 'POST') {
      return res.status(200).json({
        message: 'Auth endpoint working',
        body: req.body || {},
        timestamp: new Date().toISOString()
      });
    }

    // Default 404 for other routes
    return res.status(404).json({
      success: false,
      message: 'API route not found',
      path: url,
      method: method,
      availableRoutes: ['/api/health', '/api/test', '/api/auth/test']
    });

  } catch (error) {
    console.error('Function error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  }
}; 