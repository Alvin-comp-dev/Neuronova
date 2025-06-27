const fs = require('fs');
const path = require('path');

console.log('🔍 Neuronova Project Diagnostic');
console.log('================================');

// Check critical files
const criticalFiles = [
  'src/app/page.tsx',
  'src/app/layout.tsx',
  'src/app/research/page.tsx',
  'src/app/publish/page.tsx',
  'src/app/about/page.tsx',
  'src/components/ai/AIResearchAssistant.tsx',
  'src/components/mobile/MobileOptimized.tsx',
  'package.json',
  'next.config.ts'
];

console.log('\n📁 Critical Files Check:');
criticalFiles.forEach(file => {
  const exists = fs.existsSync(file);
  console.log(`${exists ? '✅' : '❌'} ${file}`);
});

// Check if pages directory exists (should not in App Router)
console.log('\n📂 Architecture Check:');
console.log(`${fs.existsSync('pages') ? '⚠️  ISSUE: pages/ directory exists (App Router conflict)' : '✅ No pages/ directory'}`);

// Check node_modules
console.log(`${fs.existsSync('node_modules') ? '✅' : '❌'} node_modules installed`);

// Check .next directory
console.log(`${fs.existsSync('.next') ? '⚠️  .next exists (should be clean)' : '✅ .next cleaned'}`);

// Check app directory structure
if (fs.existsSync('src/app')) {
  console.log('\n📂 App Directory Structure:');
  const appDirs = fs.readdirSync('src/app', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  console.log('Directories:', appDirs.join(', '));
  
  // Check for page.tsx files
  const pagesFound = [];
  function findPages(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    items.forEach(item => {
      if (item.isDirectory()) {
        findPages(path.join(dir, item.name));
      } else if (item.name === 'page.tsx') {
        pagesFound.push(dir.replace('src/app', ''));
      }
    });
  }
  
  findPages('src/app');
  console.log('Pages found:', pagesFound.join(', '));
}

console.log('\n🔍 Diagnosis Complete'); 