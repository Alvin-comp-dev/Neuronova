const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8000;

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

// Middleware
app.use(express.json());
app.use(express.static('public'));

// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is working!' });
});

app.get('/api/research', (req, res) => {
  res.json({ success: true, data: sampleResearch });
});

app.get('/api/research/:id', (req, res) => {
  const research = sampleResearch.find(r => r.id === parseInt(req.params.id));
  if (research) {
    res.json(research);
  } else {
    res.status(404).json({ error: 'Research not found' });
  }
});

// Serve a simple HTML frontend
app.get('/', (req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NeuroNova - Research Platform</title>
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
        }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
            padding: 20px;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
        }
        .header { 
            text-align: center; 
            margin-bottom: 40px; 
        }
        .header h1 { 
            font-size: 3rem; 
            margin-bottom: 10px; 
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3); 
        }
        .header p { 
            font-size: 1.2rem; 
            opacity: 0.9; 
        }
        .status { 
            background: rgba(255,255,255,0.1); 
            padding: 20px; 
            border-radius: 10px; 
            margin-bottom: 30px;
            backdrop-filter: blur(10px);
        }
        .research-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 20px; 
        }
        .research-card { 
            background: rgba(255,255,255,0.1); 
            padding: 20px; 
            border-radius: 10px; 
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.2);
            transition: transform 0.3s ease;
        }
        .research-card:hover { 
            transform: translateY(-5px); 
        }
        .research-card h3 { 
            color: #fff; 
            margin-bottom: 10px; 
        }
        .research-card .author { 
            color: #ccc; 
            font-size: 0.9rem; 
            margin-bottom: 10px; 
        }
        .research-card .summary { 
            margin-bottom: 15px; 
            line-height: 1.5; 
        }
        .research-card .meta { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
        }
        .category { 
            background: rgba(255,255,255,0.2); 
            padding: 5px 10px; 
            border-radius: 15px; 
            font-size: 0.8rem; 
        }
        .likes { 
            color: #ff6b6b; 
        }
        .loading { 
            text-align: center; 
            padding: 40px; 
        }
        .error { 
            background: rgba(255,0,0,0.2); 
            padding: 20px; 
            border-radius: 10px; 
            margin: 20px 0; 
        }
        .success {
            color: #4CAF50;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 NeuroNova</h1>
            <p>Advanced Research Platform</p>
        </div>
        
        <div class="status" id="status">
            <h3>System Status</h3>
            <p id="health-status">Checking backend...</p>
        </div>
        
        <div id="research-container">
            <div class="loading">Loading research data...</div>
        </div>
    </div>

    <script>
        // Check backend health
        fetch('/api/health')
            .then(response => response.json())
            .then(data => {
                document.getElementById('health-status').innerHTML = 
                    '<span class="success">✅ ' + data.message + ' (Backend running on port ${PORT})</span>';
            })
            .catch(error => {
                document.getElementById('health-status').innerHTML = 
                    '❌ Backend connection failed';
            });

        // Load research data
        fetch('/api/research')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayResearch(data.data);
                } else {
                    throw new Error('Failed to load research');
                }
            })
            .catch(error => {
                document.getElementById('research-container').innerHTML = 
                    '<div class="error">Failed to load research data: ' + error.message + '</div>';
            });

        function displayResearch(research) {
            const container = document.getElementById('research-container');
            container.innerHTML = '<h2>Latest Research</h2><div class="research-grid" id="research-grid"></div>';
            
            const grid = document.getElementById('research-grid');
            research.forEach(item => {
                const card = document.createElement('div');
                card.className = 'research-card';
                card.innerHTML = 
                    '<h3>' + item.title + '</h3>' +
                    '<div class="author">By ' + item.author + '</div>' +
                    '<div class="summary">' + item.summary + '</div>' +
                    '<div class="meta">' +
                        '<span class="category">' + item.category + '</span>' +
                        '<span class="likes">❤️ ' + item.likes + ' likes</span>' +
                    '</div>';
                grid.appendChild(card);
            });
        }
    </script>
</body>
</html>`;
  res.send(html);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 NeuroNova is running!`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔧 Backend: http://localhost:${PORT}/api/health`);
  console.log(`📊 Research: http://localhost:${PORT}/api/research`);
  console.log(`\n✨ Your app is ready! Open http://localhost:${PORT} in your browser`);
});

process.on('SIGINT', () => {
  console.log('\n👋 Shutting down NeuroNova...');
  process.exit(0);
}); 