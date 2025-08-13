// Test all the imports from our main server file
console.log('🧪 Testing all server imports...');

try {
  console.log('1. Testing express...');
  const express = require('express');
  
  console.log('2. Testing http...');
  const http = require('http');
  
  console.log('3. Testing cors...');
  const cors = require('cors');
  
  console.log('4. Testing dotenv...');
  const dotenv = require('dotenv');
  
  console.log('5. Testing path resolution for mongodb...');
  // This is the import that might be failing
  const path = require('path');
  const mongoPath = path.resolve(__dirname, '../src/lib/mongodb');
  console.log('   MongoDB path:', mongoPath);
  
  console.log('6. Testing actual mongodb import...');
  const { connectMongoose } = require('../src/lib/mongodb');
  console.log('   ✅ MongoDB import successful');
  
  console.log('7. Testing websocket import...');
  const webSocketManager = require('./websocket');
  console.log('   ✅ WebSocket import successful');
  
  console.log('🎉 All imports successful!');
  
} catch (error: any) {
  console.error('❌ Import failed:', error.message);
  console.error('📍 Stack trace:', error.stack);
}