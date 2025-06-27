const { spawn } = require('child_process');
const fs = require('fs');

console.log('🚀 NeuroNova - Quick Hosting Setup');
console.log('===================================\n');

// Check if servers are running
const netstat = spawn('netstat', ['-ano'], { stdio: 'pipe' });
let output = '';

netstat.stdout.on('data', (data) => {
  output += data.toString();
});

netstat.on('close', () => {
  const frontendRunning = output.includes(':300') && (output.includes(':3001') || output.includes(':3003') || output.includes(':3004'));
  const backendRunning = output.includes(':3002');
  
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
  
  // Find frontend port
  let frontendPort = 3004;
  if (output.includes(':3001')) frontendPort = 3001;
  else if (output.includes(':3003')) frontendPort = 3003;
  else if (output.includes(':3004')) frontendPort = 3004;
  
  console.log(`🎯 Detected frontend on port ${frontendPort}`);
  console.log('🌐 Starting ngrok tunnel...\n');
  
  // Start ngrok
  const ngrok = spawn('ngrok', ['http', frontendPort.toString()], { 
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
      
      // Create instructions file
      const instructions = `
NEURONOVA TESTING URL
=====================

🌐 Public URL: ${tunnelUrl}

🔐 Test Credentials:
- Regular User: ejialvtuke@gmail.com / password123
- Admin User: admin@neuronova.com / password123

🧪 Features to Test:
- User registration and login
- Community discussions and replies
- Research article browsing
- Expert applications
- Admin panel (with admin login)

⚠️ Important:
- This URL only works while your computer is running
- Keep this terminal window open
- URL will change if you restart ngrok
`;
      
      fs.writeFileSync('testing-instructions.txt', instructions);
      console.log('📄 Instructions saved to testing-instructions.txt');
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