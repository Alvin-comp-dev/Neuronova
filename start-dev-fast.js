#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Clean .next cache if it exists
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
  console.log('Cleaning .next cache...');
  fs.rmSync(nextDir, { recursive: true, force: true });
}

// Start Next.js development server with optimizations
console.log('Starting fast development server...');

const nextProcess = spawn('npx', ['next', 'dev', '--port', '3012'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    NEXT_TELEMETRY_DISABLED: '1',
  }
});

nextProcess.on('error', (error) => {
  console.error('Failed to start:', error);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down development server...');
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nShutting down development server...');
  nextProcess.kill('SIGTERM');
}); 