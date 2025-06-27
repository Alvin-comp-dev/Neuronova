#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('�� Starting NeuroNova Development Environment...\n');

// Function to start a process
function startProcess(command, args, name, cwd = process.cwd()) {
  console.log(`📡 Starting ${name}...`);
  
  const process = spawn(command, args, {
    cwd,
    stdio: 'pipe',
    shell: true
  });

  process.stdout.on('data', (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });

  process.stderr.on('data', (data) => {
    console.log(`[${name}] ERROR: ${data.toString().trim()}`);
  });

  process.on('close', (code) => {
    console.log(`[${name}] Process exited with code ${code}`);
  });

  process.on('error', (error) => {
    console.error(`[${name}] Failed to start:`, error.message);
  });

  return process;
}

// Start backend server
const backendProcess = startProcess('node', ['simple-backend.js'], 'Backend Server');

// Wait a moment for backend to start, then start frontend
setTimeout(() => {
  console.log('\n⏳ Backend starting, waiting 3 seconds before starting frontend...\n');
  
  setTimeout(() => {
    const frontendProcess = startProcess('npm', ['run', 'dev'], 'Frontend Server');
    
    console.log('\n✅ Both servers are starting up!');
    console.log('🌐 Frontend will be available at: http://localhost:3001 (or next available port)');
    console.log('🔧 Backend API will be available at: http://localhost:3002');
    console.log('📚 Community discussions with like/bookmark/share: http://localhost:3001/community');
    console.log('\n💡 Features now working:');
    console.log('   • Like discussions (heart icon)');
    console.log('   • Bookmark discussions (bookmark icon)');
    console.log('   • Share discussions (share icon)');
    console.log('   • Reply to discussions');
    console.log('   • Mock user authentication (ejialvtuke@gmail.com / password123)');
    console.log('\n🛑 Press Ctrl+C to stop both servers\n');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down servers...');
      backendProcess.kill();
      frontendProcess.kill();
      process.exit(0);
    });
    
  }, 3000);
  
}, 1000); 