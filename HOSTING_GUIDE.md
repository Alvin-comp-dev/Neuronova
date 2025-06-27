# 🚀 NeuroNova Hosting Guide

## Quick Deployment for User Testing

Your NeuroNova app is ready to be deployed! Here's how to get it online in **15 minutes** so your friends can test it.

## 🔥 Step 1: Deploy Backend (Railway - Free)

1. **Go to [Railway.app](https://railway.app/)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select this repository** (`neuronova`)
5. **Railway will auto-detect** and deploy `backend-final-working.js`
6. **Copy the generated URL** (e.g., `https://neuronova-backend-production.railway.app`)

### ✅ Backend Features Working:
- ✅ Health check: `/api/health`
- ✅ Research data: `/api/research`
- ✅ Search: `/api/search?q=brain`
- ✅ Expert profiles: `/api/experts`
- ✅ Trending research: `/api/trending`
- ✅ Research stats: `/api/research/stats`

## 🌐 Step 2: Deploy Frontend (Vercel - Free)

1. **Go to [Vercel.com](https://vercel.com/)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"** → **"Import from GitHub"**
4. **Select this repository** (`neuronova`)
5. **Add Environment Variable:**
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-railway-backend-url.railway.app` (from Step 1)
6. **Click Deploy!**

### 🔧 Environment Variables for Vercel:
```
NEXT_PUBLIC_API_URL=https://your-railway-backend-url.railway.app
NEXT_TELEMETRY_DISABLED=1
```

## 📱 Step 3: Share with Friends

Once deployed, you'll get:
- **Frontend URL**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app`

**Share the frontend URL with your friends for testing!**

## 🧪 What Your Friends Can Test:

### ✅ Core Features Working:
- **Browse research articles** with real data
- **Search functionality** across all content
- **Expert profiles** and expertise areas
- **Trending research** based on citations
- **Research statistics** and analytics
- **Responsive design** on mobile/desktop
- **Dark/Light mode toggle**
- **Category filtering**
- **Pagination** for large datasets

### 🔍 Test URLs for Friends:
- Main app: `https://your-app.vercel.app`
- Research page: `https://your-app.vercel.app/research`
- Search: `https://your-app.vercel.app/search`
- Experts: `https://your-app.vercel.app/experts`
- Admin panel: `https://your-app.vercel.app/admin` (login: admin@neuronova.com / password123)

## 🚨 Troubleshooting

### If Backend Doesn't Deploy:
1. Check Railway logs for errors
2. Ensure `backend-final-working.js` is in root directory
3. Verify `package.json` has correct start script

### If Frontend Can't Connect to Backend:
1. Check Vercel environment variables
2. Ensure `NEXT_PUBLIC_API_URL` points to Railway URL
3. Test backend URL directly: `https://your-backend.railway.app/api/health`

### If CORS Issues:
Backend already has CORS enabled for all origins (`*`), so this shouldn't be an issue.

## 💰 Free Tier Limits:
- **Railway**: 500 hours/month (plenty for testing)
- **Vercel**: 100 deployments/month, unlimited bandwidth
- **Perfect for user testing phase!**

## 🔄 Updates:
Every time you push to GitHub:
- Railway automatically redeploys backend
- Vercel automatically redeploys frontend

## 📊 Monitoring:
- **Railway Dashboard**: Monitor backend performance
- **Vercel Analytics**: Track frontend usage
- **Both platforms**: Provide detailed logs

---

## 🎉 You're Done!

Your NeuroNova app is now live and ready for user testing. Share the Vercel URL with your friends and gather feedback!

**Need help?** Check the deployment logs in Railway/Vercel dashboards. 