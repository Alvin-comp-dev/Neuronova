# Neuronova Quick Performance Fixes

## 🚀 Fast Startup Commands

### Option 1: Reset Development Environment (Recommended)
```bash
node reset-dev.js
```
This will:
- Kill processes on port 3000
- Clean all cache directories (.next, node_modules/.cache, .turbo)
- Remove temporary files
- Start fresh development server

### Option 2: Quick Clean & Start
```bash
npm run dev:clean
```

### Option 3: Manual Reset
```bash
# Kill existing processes
taskkill /F /IM "node.exe"  # Windows
# or
pkill -f node              # Unix/Mac

# Clean cache
rm -rf .next node_modules/.cache .turbo

# Start development server
npm run dev
```

## 🔧 Performance Optimizations Applied

1. **Next.js Config Optimizations**:
   - Turbo mode enabled
   - Webpack caching configured
   - Bundle splitting optimized
   - Telemetry disabled

2. **Development Scripts**:
   - `dev:fast` - Quick startup with cache cleanup
   - `dev:clean` - Clean start with rimraf

3. **Environment Variables**:
   - `NEXT_TELEMETRY_DISABLED=1`
   - `NODE_OPTIONS=--max-old-space-size=4096`

## 🐛 Common Issues & Solutions

### Issue: "SyntaxError: Unexpected string in JSON at position 1682"
**Solution**: Run `node reset-dev.js` to clean corrupted cache

### Issue: "Module not found: middleware-manifest.json"
**Solution**: Clean .next directory completely: `rm -rf .next && npm run dev`

### Issue: "Port 3000 is in use"
**Solution**: Kill existing processes: `taskkill /F /IM "node.exe"` (Windows)

### Issue: Long compilation times
**Solution**: 
1. Use `npm run dev` (turbo mode enabled)
2. Ensure cache directories are clean
3. Check for multiple Node processes running

## ✅ Quick Status Check

```bash
node check-status.js
```

This will verify if the server is running and accessible.

## 🎯 Expected Performance

After applying these fixes:
- Initial startup: ~30-60 seconds
- Hot reload: ~1-3 seconds
- Page loads: ~500ms-2s
- API responses: ~100-500ms

If performance is still slow, try:
1. Restart your terminal/IDE
2. Clear browser cache
3. Check Windows Defender real-time protection
4. Ensure adequate RAM (8GB+ recommended) 