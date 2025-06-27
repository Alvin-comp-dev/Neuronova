#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Neuronova Development Server...\n');

// Function to run a command and handle output
function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function startDevelopment() {
  try {
    console.log('📦 Checking dependencies...');
    
    // Check if node_modules exists
    const fs = require('fs');
    if (!fs.existsSync('node_modules')) {
      console.log('📥 Installing dependencies...');
      await runCommand('npm', ['install']);
    }

    console.log('🧹 Cleaning build cache...');
    // Clean .next directory
    if (fs.existsSync('.next')) {
      await runCommand('rm', ['-rf', '.next'], { shell: true });
    }

    console.log('🔧 Starting Next.js development server...');
    console.log('📍 Server will be available at: http://localhost:3000\n');
    
    // Start the development server
    await runCommand('npx', ['next', 'dev', '--port', '3000']);

  } catch (error) {
    console.error('❌ Error starting development server:', error.message);
    console.log('\n🔄 Trying alternative approach...');
    
    try {
      // Fallback to npm run dev
      await runCommand('npm', ['run', 'dev']);
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError.message);
      console.log('\n📋 Manual steps to try:');
      console.log('1. npm install');
      console.log('2. rm -rf .next');
      console.log('3. npx next dev --port 3000');
      process.exit(1);
    }
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down development server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down development server...');
  process.exit(0);
});

startDevelopment(); 