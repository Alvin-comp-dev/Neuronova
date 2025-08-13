// Ultra simple TypeScript test
console.log('🚀 TypeScript test starting...');
console.log('✅ TypeScript compilation works!');
console.log('📍 Current directory:', process.cwd());
console.log('🔧 Node version:', process.version);

// Test basic imports
try {
  const express = require('express');
  console.log('✅ Express import works');
} catch (error) {
  console.error('❌ Express import failed:', error);
}

try {
  const cors = require('cors');
  console.log('✅ CORS import works');
} catch (error) {
  console.error('❌ CORS import failed:', error);
}

console.log('🎉 Simple TypeScript test completed successfully!');