// Minimal JavaScript test server (no TypeScript)
const express = require('express');

const app = express();
const PORT = 3001;

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Minimal JS server working!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log('🚀 Minimal JS server running on port', PORT);
});