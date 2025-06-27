const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Neuronova (Simple Mode)...\n');

// Kill any existing processes
console.log('🛑 Stopping existing processes...');
const killCmd = process.platform === 'win32' ? 'taskkill /F /IM node.exe 2>nul' : 'pkill -f node';
require('child_process').execSync(killCmd, { stdio: 'ignore' });

// Clear build cache
console.log('🧹 Clearing build cache...');
const rmCmd = process.platform === 'win32' ? 'rmdir /s /q .next 2>nul' : 'rm -rf .next';
require('child_process').execSync(rmCmd, { stdio: 'ignore' });

// Start frontend only for now (backend has TypeScript issues)
console.log('🌐 Starting frontend server...');
const frontend = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '3000' }
});

frontend.on('error', (err) => {
  console.error('Frontend error:', err);
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  frontend.kill();
  process.exit(0);
});

console.log('✅ Frontend starting on http://localhost:3000');
console.log('⚠️  Backend disabled due to TypeScript errors');
console.log('📝 Check server/controllers/auth.ts for JWT type issues'); 