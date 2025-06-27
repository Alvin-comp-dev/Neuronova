#!/usr/bin/env node

// Fast development startup script - disables Redis completely
process.env.NODE_ENV = 'development';
process.env.NEXT_TELEMETRY_DISABLED = '1';
process.env.SKIP_REDIS = 'true';

console.log('🚀 Starting NeuroNova FAST...');

// Kill existing processes immediately
console.log('🔄 Cleaning up existing processes...');
const { spawn } = require('child_process');
spawn('taskkill', ['/F', '/IM', 'node.exe'], { stdio: 'ignore' });

// Clean .next directory if it exists
const path = require('path');
const fs = require('fs');
const nextDir = path.join(__dirname, '.next');
if (fs.existsSync(nextDir)) {
    console.log('🧹 Cleaning .next directory...');
    try {
        fs.rmSync(nextDir, { recursive: true, force: true });
    } catch (e) {
        // Ignore errors
    }
}

// Start backend immediately
console.log('📡 Starting Backend Server...');
const backend = spawn('node', ['simple-backend.js'], {
    stdio: 'pipe',
    detached: false
});

backend.stdout.on('data', (data) => {
    console.log(`[Backend] ${data.toString().trim()}`);
});

backend.stderr.on('data', (data) => {
    console.log(`[Backend Error] ${data.toString().trim()}`);
});

// Start frontend after 2 seconds
setTimeout(() => {
    console.log('📡 Starting Frontend Server...');
    const frontend = spawn('npm', ['run', 'dev'], {
        stdio: 'pipe',
        detached: false
    });

    frontend.stdout.on('data', (data) => {
        console.log(`[Frontend] ${data.toString().trim()}`);
    });

    frontend.stderr.on('data', (data) => {
        console.log(`[Frontend Error] ${data.toString().trim()}`);
    });

    // Handle process exit
    frontend.on('close', (code) => {
        console.log(`Frontend process exited with code ${code}`);
        process.exit(code);
    });
}, 2000);

// Handle process exit
backend.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
    process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down servers...');
    backend.kill();
    process.exit(0);
});

console.log('✅ Servers starting up!');
console.log('🌐 Frontend: http://localhost:3001 (or next available port)');
console.log('🔧 Backend: http://localhost:3002');
console.log('🛑 Press Ctrl+C to stop'); 