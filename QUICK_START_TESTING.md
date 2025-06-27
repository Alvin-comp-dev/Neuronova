# ��� QUICK START GUIDE FOR TESTING

## ��� **BEFORE YOU START TESTING**

### **1. Start the Server (Required)**

```bash
# Option 1: Start backend only
npm run dev:backend

# Option 2: Start both frontend and backend
npm run dev:full

# Option 3: Start manually
node start-server-win.js
```

### **2. Verify Server is Running**

```bash
# Check server health
curl http://localhost:3002/api/health

# Should return something like:
# {"status":"healthy","timestamp":"...","uptime":...}
```

### **3. Seed Database (If Empty)**

```bash
# Seed with test data
npm run seed:all

# Or seed research data only
npm run seed:research
```

---

## ��� **QUICK TEST CHECKLIST (30 minutes)**

### **Phase 1: Basic Functionality (10 minutes)**

1. ✅ Open http://localhost:3002
2. ✅ Verify homepage loads with animations
3. ✅ Click "Explore Breakthroughs" → should go to /research
4. ✅ Click "Join the Community" → should go to /community
5. ✅ Test research page loads with data

### **Phase 2: Authentication (10 minutes)**

1. ✅ Go to /auth/login
2. ✅ Login with: admin@neuronova.com / admin123
3. ✅ Verify login success and redirect
4. ✅ Check user session persists on page refresh
5. ✅ Test logout functionality

### **Phase 3: Core Features (10 minutes)**

1. ✅ Test research search functionality
2. ✅ Try filtering by categories
3. ✅ Visit /experts page
4. ✅ Visit /community page
5. ✅ Test /admin page (admin login required)

---

## ��� **COMMON STARTUP ISSUES**

### **Server Won't Start**

```bash
# Try different port
PORT=3003 npm run dev:backend

# Or kill existing process
taskkill /f /im node.exe
```

### **Database Connection Error**

- Check if MongoDB is configured
- Try with mock data (should still work)
- Verify environment variables

### **API Returns 500 Errors**

- Check server console for error messages
- Verify JWT_SECRET is set
- Try restarting the server

### **Frontend Won't Connect**

- Verify frontend is running on http://localhost:3000
- Verify backend is running on http://localhost:3002
- Check CORS configuration

---

## ��� **QUICK SUPPORT**

If you encounter issues:

1. Check server console logs
2. Verify both frontend and backend are running
3. Test API endpoints with curl commands
4. Report specific error messages

**Ready to test!** Follow the full USER_TESTING_GUIDE.md for comprehensive testing.
