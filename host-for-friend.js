const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 NeuroNova - Quick Hosting for Friends');
console.log('==========================================\n');

// Check if servers are running
function checkServers() {
  return new Promise((resolve) => {
    const netstat = spawn('netstat', ['-ano'], { stdio: 'pipe' });
    let output = '';
    
    netstat.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    netstat.on('close', () => {
      const frontendRunning = output.includes(':300') && (output.includes(':3001') || output.includes(':3003') || output.includes(':3004'));
      const backendRunning = output.includes(':3002');
      
      resolve({ frontendRunning, backendRunning });
    });
  });
}

async function main() {
  const { frontendRunning, backendRunning } = await checkServers();
  
  console.log('📊 Server Status:');
  console.log(`   Frontend: ${frontendRunning ? '✅ Running' : '❌ Not running'}`);
  console.log(`   Backend:  ${backendRunning ? '✅ Running' : '❌ Not running'}\n`);
  
  if (!frontendRunning || !backendRunning) {
    console.log('⚠️  Please start both servers first:');
    console.log('   1. Backend: node simple-backend.js');
    console.log('   2. Frontend: npm run dev');
    console.log('\n   Then run this script again.\n');
    return;
  }
  
  console.log('🎯 Choose your hosting option:');
  console.log('1. 🌐 Ngrok Tunnel (Quick & Free)');
  console.log('2. 🚀 Vercel Deployment (Professional)');
  console.log('3. 📋 Both Options\n');
  
  // For now, let's start with ngrok as it's the quickest
  console.log('🚀 Starting Ngrok Tunnel...\n');
  
  // Check if ngrok is installed
  const ngrokCheck = spawn('ngrok', ['version'], { stdio: 'pipe' });
  
  ngrokCheck.on('error', () => {
    console.log('❌ Ngrok not found. Installing...');
    const install = spawn('npm', ['install', '-g', 'ngrok'], { stdio: 'inherit' });
    
    install.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Ngrok installed successfully!');
        startNgrokTunnel();
      } else {
        console.log('❌ Failed to install ngrok');
        console.log('💡 Alternative: Download from https://ngrok.com/download');
      }
    });
  });
  
  ngrokCheck.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Ngrok is already installed!');
      startNgrokTunnel();
    }
  });
}

function startNgrokTunnel() {
  console.log('🌐 Starting ngrok tunnel...');
  
  // Find the frontend port
  const netstat = spawn('netstat', ['-ano'], { stdio: 'pipe' });
  let output = '';
  
  netstat.stdout.on('data', (data) => {
    output += data.toString();
  });
  
  netstat.on('close', () => {
    let frontendPort = 3004; // default
    
    if (output.includes(':3001')) frontendPort = 3001;
    else if (output.includes(':3003')) frontendPort = 3003;
    else if (output.includes(':3004')) frontendPort = 3004;
    
    console.log(`🎯 Detected frontend on port ${frontendPort}`);
    
    const ngrok = spawn('ngrok', ['http', frontendPort.toString(), '--log=stdout'], { 
      stdio: ['pipe', 'pipe', 'pipe'] 
    });

    let tunnelUrl = null;

    ngrok.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(output);
      
      // Look for the public URL
      const urlMatch = output.match(/https:\/\/[a-zA-Z0-9-]+\.ngrok\.io/);
      if (urlMatch && !tunnelUrl) {
        tunnelUrl = urlMatch[0];
        console.log('\n🎉 SUCCESS! Your site is now live!');
        console.log('=====================================');
        console.log(`🌐 Public URL: ${tunnelUrl}`);
        console.log('📧 Share this URL with your friend');
        console.log('⏰ This URL works as long as this script runs');
        console.log('🛑 Press Ctrl+C to stop');
        console.log('=====================================\n');
        
        // Save URL to file
        fs.writeFileSync('friend-testing-url.txt', tunnelUrl);
        console.log('💾 URL saved to friend-testing-url.txt');
        
        // Create a simple HTML file with instructions
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>NeuroNova - Testing URL</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
        .url { background: #f0f0f0; padding: 15px; border-radius: 5px; font-family: monospace; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>🎉 NeuroNova Testing URL</h1>
    <p>Share this URL with your friend for testing:</p>
    <div class="url">${tunnelUrl}</div>
    
    <div class="warning">
        <strong>⚠️ Important:</strong>
        <ul>
            <li>This URL only works while your computer is running</li>
            <li>Keep this terminal window open</li>
            <li>URL will change if you restart ngrok</li>
        </ul>
    </div>
    
    <h3>🔐 Test Credentials:</h3>
    <ul>
        <li><strong>Regular User:</strong> ejialvtuke@gmail.com / password123</li>
        <li><strong>Admin User:</strong> admin@neuronova.com / password123</li>
    </ul>
    
    <h3>🧪 Features to Test:</h3>
    <ul>
        <li>User registration and login</li>
        <li>Community discussions and replies</li>
        <li>Research article browsing</li>
        <li>Expert applications</li>
        <li>Admin panel (with admin login)</li>
    </ul>
</body>
</html>`;
        
        fs.writeFileSync('testing-instructions.html', htmlContent);
        console.log('📄 Instructions saved to testing-instructions.html');
      }
    });

    ngrok.stderr.on('data', (data) => {
      console.log('Ngrok stderr:', data.toString());
    });

    ngrok.on('close', (code) => {
      console.log(`\n❌ Ngrok tunnel closed with code ${code}`);
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Stopping ngrok tunnel...');
      ngrok.kill();
      process.exit(0);
    });
  });
}

// Start the process
main().catch(console.error); 