# 🎥 Video Wallpaper Guide for NeuroNova

## Overview
Your NeuroNova app now supports **dynamic video wallpapers** using the WebM videos you can record from the anatomy animation. This creates a stunning, living background that enhances the user experience.

## 📁 Setup Instructions

### 1. Record Your Video
Use the `record-anatomy.html` file to capture the anatomy animation:
```
Open: http://localhost:3000/record-anatomy.html
1. Click "Start Recording"
2. Wait 10-30 seconds for full animation cycle
3. Click "Stop Recording" 
4. Click "Download MP4" to save
```

### 2. Add Video to Your App
1. Place your recorded video in: `public/videos/anatomy-animation.webm`
2. Optional: Convert to MP4 and add: `public/videos/anatomy-animation.mp4`

### 3. File Structure
```
public/
├── videos/
│   ├── anatomy-animation.webm  ← Your recorded video
│   └── anatomy-animation.mp4   ← Optional MP4 version
```

## 🎛️ Dynamic Background Features

### Automatic Detection
- App automatically detects if video exists
- Falls back to 3D animation if video not found
- Smooth transitions between background types

### User Controls
Your app now includes a **background selector** in the bottom-right corner:

- **🎥 Video Animation**: Uses your recorded WebM video
- **🧠 3D Interactive**: Original Three.js animation  
- **🌈 Gradient Only**: Simple gradient background

### User Preferences
- Settings are saved in browser localStorage
- Users can switch between backgrounds anytime
- Preference persists across sessions

## 🔧 Technical Details

### Video Specifications
- **Format**: WebM (primary), MP4 (fallback)
- **Recommended**: 30 FPS, 1920x1080 or higher
- **Duration**: 10-60 seconds (loops automatically)
- **Size**: Optimize for web (under 10MB recommended)

### Performance
- Videos are preloaded for smooth playback
- Automatic fallback if video fails to load
- GPU-accelerated playback when supported
- Memory-efficient looping

### Browser Support
- ✅ Chrome/Edge: Full WebM + MP4 support
- ✅ Firefox: Full WebM + MP4 support  
- ✅ Safari: MP4 support (add .mp4 version)
- ✅ Mobile: Auto-optimization for performance

## 🎨 Customization Options

### Change Video Source
Edit `src/app/page.tsx`:
```tsx
<DynamicBackground 
  videoSrc="/videos/your-custom-video.webm"
  opacity={0.3}
  type="video"
/>
```

### Background Types
- `"auto"` - Auto-detect best option
- `"video"` - Force video background
- `"3d"` - Force 3D animation
- `"gradient"` - Simple gradient only

### Opacity Control
```tsx
<DynamicBackground opacity={0.5} /> // 50% opacity
```

### Disable User Controls
```tsx
<DynamicBackground enableUserChoice={false} />
```

## 🚀 Advanced Features

### Multiple Videos
Add multiple videos and cycle through them:
```tsx
// Future enhancement - cycle through videos
const videos = [
  '/videos/anatomy-animation.webm',
  '/videos/brain-scan.webm', 
  '/videos/dna-helix.webm'
];
```

### Custom Video Controls
The video component includes:
- Auto-play with loop
- Muted by default (required for autoplay)
- Responsive sizing
- Loading states
- Error handling

### SEO & Accessibility
- Videos are marked as decorative backgrounds
- No impact on screen readers
- Graceful degradation for low-bandwidth users

## 🎯 Best Practices

### Video Creation
1. **Keep it short**: 15-30 seconds is ideal
2. **Smooth loops**: Ensure start/end frames match
3. **Optimize file size**: Use video compression tools
4. **Test on mobile**: Ensure good mobile performance

### User Experience
1. **Subtle movement**: Avoid distracting animations
2. **Readable text**: Ensure good contrast over video
3. **Performance first**: Monitor loading times
4. **Accessibility**: Provide static fallbacks

## 🐛 Troubleshooting

### Video Not Playing
1. Check file path: `public/videos/anatomy-animation.webm`
2. Verify video format (WebM or MP4)
3. Check browser console for errors
4. Try refreshing the page

### Performance Issues
1. Reduce video file size
2. Lower video resolution
3. Use video compression tools
4. Switch to gradient background temporarily

### Browser Compatibility
1. Add MP4 fallback for Safari
2. Test across different browsers
3. Monitor mobile performance
4. Use video optimization tools

## 📊 File Size Guidelines

| Quality | Resolution | Duration | File Size |
|---------|------------|----------|-----------|
| Low     | 720p       | 15s      | 2-5MB     |
| Medium  | 1080p      | 20s      | 5-10MB    |
| High    | 1440p      | 30s      | 10-20MB   |

## 🎬 Video Conversion Tools

### Free Tools
- **FFmpeg**: Command-line video converter
- **VLC Media Player**: Built-in conversion
- **HandBrake**: GUI video encoder

### Online Tools
- **CloudConvert**: Online video converter
- **Online-Convert**: Web-based conversion
- **Convertio**: Simple file conversion

### Example FFmpeg Commands
```bash
# Convert to WebM
ffmpeg -i input.webm -c:v libvpx-vp9 -b:v 2M output.webm

# Convert to MP4
ffmpeg -i input.webm -c:v libx264 -b:v 2M output.mp4

# Optimize for web
ffmpeg -i input.webm -c:v libvpx-vp9 -b:v 1M -c:a libvorbis output.webm
```

---

Your NeuroNova app now has a cutting-edge video wallpaper system! 🚀✨ 