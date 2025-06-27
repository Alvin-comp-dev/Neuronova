#!/bin/bash

echo "🚀 Starting NeuroNova Deployment Process..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
fi

echo "📋 Deployment Instructions:"
echo ""
echo "🔥 BACKEND DEPLOYMENT (Railway):"
echo "1. Go to https://railway.app/"
echo "2. Sign up/login with GitHub"
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo "4. Select this repository"
echo "5. Railway will auto-detect and deploy backend-final-working.js"
echo "6. Copy the generated URL (e.g., https://your-app.railway.app)"
echo ""
echo "🌐 FRONTEND DEPLOYMENT (Vercel):"
echo "1. Go to https://vercel.com/"
echo "2. Sign up/login with GitHub"
echo "3. Click 'New Project' → Import from GitHub"
echo "4. Select this repository"
echo "5. Update NEXT_PUBLIC_API_URL environment variable with Railway URL"
echo "6. Deploy!"
echo ""
echo "🔧 Environment Variables to set on Vercel:"
echo "NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app"
echo ""
echo "✅ Your app will be live at: https://your-app.vercel.app"
echo ""
echo "📱 Share this link with your friends for testing!" 