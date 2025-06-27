#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Neuronova Backend Server...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('⚠️  No .env file found. Creating one with default values...');
  
  const defaultEnv = `# Neuronova Backend Configuration
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/neuronova
JWT_SECRET=neuronova_jwt_secret_key_change_this_in_production_2024
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3022
BCRYPT_SALT_ROUNDS=12
`;

  try {
    fs.writeFileSync(envPath, defaultEnv);
    console.log('✅ Created .env file with default configuration');
  } catch (error) {
    console.log('❌ Could not create .env file:', error.message);
  }
}

// Set environment variables for development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || '3001';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'neuronova_jwt_secret_key_change_this_in_production_2024';

console.log('🔧 Configuration:');
console.log(`   Environment: ${process.env.NODE_ENV}`);
console.log(`   Port: ${process.env.PORT}`);
console.log(`   Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3022'}`);
console.log('');

// Start the backend server
const serverProcess = spawn('npx', ['ts-node', '--project', 'server/tsconfig.json', 'server/app.ts'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env }
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start backend server:', error);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`\n🔴 Backend server exited with code ${code}`);
  if (code !== 0) {
    console.log('💡 Try the following troubleshooting steps:');
    console.log('   1. Make sure all dependencies are installed: npm install');
    console.log('   2. Check if MongoDB is running (if using local MongoDB)');
    console.log('   3. Verify the .env configuration');
    console.log('   4. Check the server logs above for specific errors');
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down backend server...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down backend server...');
  serverProcess.kill('SIGTERM');
}); 