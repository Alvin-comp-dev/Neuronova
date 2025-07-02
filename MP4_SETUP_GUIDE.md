# 🎬 MP4 Video Wallpaper Setup - NeuroNova

## Quick Setup for MP4 Files

### 📁 **Just 3 Steps:**

1. **Place your MP4 file** in: `public/videos/anatomy-animation.mp4`
2. **Refresh your app** at `http://localhost:3000`
3. **Enjoy your video wallpaper!** 🎉

### 🎥 **Recording from Your App:**

1. Open: `http://localhost:3000/record-anatomy.html`
2. Click **"Start Recording"**
3. Wait 15-30 seconds for animation
4. Click **"Stop Recording"** → **"Download MP4"**
5. Save as: `anatomy-animation.mp4` in `public/videos/`

### 🎛️ **Background Controls:**

Your app automatically detects MP4 files and adds user controls:
- **🎥 Video Animation** - Your MP4 background
- **🧠 3D Interactive** - Live Three.js animation  
- **🌈 Gradient Only** - Simple background

### 📱 **Browser Support:**
✅ **Universal Support** - MP4 works everywhere:
- Chrome/Edge ✅
- Firefox ✅  
- Safari ✅
- Mobile ✅

### 🎯 **File Requirements:**
- **Format**: `.mp4`
- **Location**: `public/videos/anatomy-animation.mp4`
- **Size**: Under 20MB recommended
- **Duration**: 10-60 seconds (auto-loops)

### 🔧 **Customization:**

**Change video source:**
```tsx
// In src/app/page.tsx
<DynamicBackground 
  videoSrc="/videos/your-video.mp4"
  opacity={0.3}
/>
```

**Force MP4 mode:**
```tsx
<DynamicBackground type="video" />
```

### 🚀 **Optimization Tips:**

1. **Compress your MP4:**
   - Use HandBrake (free)
   - Target: 2-5MB file size
   - Resolution: 1080p max

2. **Convert existing videos:**
   ```bash
   # Using FFmpeg
   ffmpeg -i input.mov -c:v libx264 -crf 23 output.mp4
   ```

3. **Online conversion:**
   - CloudConvert.com
   - Online-Convert.com

### 🎪 **Example File Structure:**
```
neuronova/
├── public/
│   └── videos/
│       ├── anatomy-animation.mp4  ← Your main video
│       ├── brain-scan.mp4          ← Optional: Additional videos  
│       └── dna-helix.mp4           ← Optional: More backgrounds
└── src/
    └── app/
        └── page.tsx                ← Uses DynamicBackground
```

### 💡 **Pro Tips:**

- **Smooth loops**: Make sure start/end frames match
- **Mobile-friendly**: Test on phones/tablets
- **Loading states**: Component shows loading indicator
- **Fallback ready**: Auto-switches to 3D if video fails

### 🐛 **Troubleshooting:**

**Video not showing?**
1. Check file path: `public/videos/anatomy-animation.mp4`
2. Refresh browser (Ctrl+F5)
3. Check browser console for errors
4. Verify file isn't corrupted

**Performance issues?**
1. Reduce file size (under 10MB)
2. Lower resolution to 720p
3. Use video compression tools
4. Switch to gradient background temporarily

---

**That's it! Your MP4 video wallpaper is ready to go! 🎬✨**

*Much simpler than WebM - MP4 works everywhere without conversion!* 