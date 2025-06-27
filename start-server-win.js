#!/usr/bin/env node

// Windows-compatible server startup script
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Neuronova Development Server...');

// Set environment variables
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.NODE_ENV = 'development';

// Start Next.js development server
const nextProcess = spawn('npx', ['next', 'dev', '--port', '3002'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

nextProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  console.log(`📊 Server process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  nextProcess.kill('SIGTERM');
});

console.log('✅ Server startup script running...');
console.log('📍 Server will be available at: http://localhost:3002');
console.log('🔧 Press Ctrl+C to stop the server'); 