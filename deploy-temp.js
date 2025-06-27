const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 Setting up temporary hosting for NeuroNova...\n');

// Check if ngrok is installed
const ngrokCheck = spawn('ngrok', ['version'], { stdio: 'pipe' });

ngrokCheck.on('error', (error) => {
  console.log('❌ Ngrok not found. Installing...');
  const install = spawn('npm', ['install', '-g', 'ngrok'], { stdio: 'inherit' });
  
  install.on('close', (code) => {
    if (code === 0) {
      console.log('✅ Ngrok installed successfully!');
      startTunnel();
    } else {
      console.log('❌ Failed to install ngrok');
    }
  });
});

ngrokCheck.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Ngrok is already installed!');
    startTunnel();
  }
});

function startTunnel() {
  console.log('\n🌐 Starting ngrok tunnel for frontend (port 3004)...');
  
  const ngrok = spawn('ngrok', ['http', '3004', '--log=stdout'], { 
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
      console.log('\n🎉 TEMPORARY HOSTING URL CREATED!');
      console.log('=====================================');
      console.log(`🌐 Public URL: ${tunnelUrl}`);
      console.log('📧 Share this URL with the college');
      console.log('⏰ This URL will work as long as this script is running');
      console.log('🛑 Press Ctrl+C to stop the tunnel');
      console.log('=====================================\n');
      
      // Save URL to file for easy access
      fs.writeFileSync('temp-hosting-url.txt', tunnelUrl);
      console.log('💾 URL saved to temp-hosting-url.txt');
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
}

console.log('📋 Instructions:');
console.log('1. Make sure your frontend is running on port 3004');
console.log('2. Make sure your backend is running on port 3002');
console.log('3. This script will create a public URL you can share');
console.log('4. The URL will be saved to temp-hosting-url.txt\n'); 