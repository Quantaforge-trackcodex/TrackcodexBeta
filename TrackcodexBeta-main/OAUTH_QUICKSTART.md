# OAuth Authentication - Quick Start Guide

## ✅ Implementation Complete!

All OAuth authentication code has been implemented and configured. Follow these steps to test it.

---

## 🚀 Quick Start (3 Steps)

### Step 1: Get OAuth Credentials

**Google OAuth** (5 minutes):
1. Visit: https://console.cloud.google.com/
2. Create project → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID (Web application)
4. Add redirect URI: `http://localhost:3000/auth/callback/google`
5. Copy Client ID and Client Secret

**GitHub OAuth** (3 minutes):
1. Visit: https://github.com/settings/developers
2. New OAuth App
3. Callback URL: `http://localhost:3000/auth/callback/github`
4. Copy Client ID and generate Client Secret

---

### Step 2: Update Environment Files

**Backend** (`.env`):
```bash
# Add these lines to your existing .env file:
GOOGLE_CLIENT_ID="paste-your-google-client-id-here"
GOOGLE_CLIENT_SECRET="paste-your-google-client-secret-here"
GITHUB_CLIENT_ID="paste-your-github-client-id-here"
GITHUB_CLIENT_SECRET="paste-your-github-client-secret-here"
JWT_SECRET="change-this-to-a-random-32-character-string"
```

**Frontend** (`.env.local`):
```bash
# Replace the placeholder values:
VITE_GOOGLE_CLIENT_ID="paste-your-google-client-id-here"
VITE_GITHUB_CLIENT_ID="paste-your-github-client-id-here"
# VITE_API_URL is already set to http://localhost:4000
```

---

### Step 3: Start Servers

**Terminal 1** - Backend (Port 4000):
```bash
npx tsx backend/server.ts
```

**Terminal 2** - Frontend (Port 3000):
```bash
npm run dev
```

---

## 🧪 Test OAuth Flow

1. Open http://localhost:3000
2. You'll see the login page with:
   - **"Continue with Google"** button
   - **"Continue with GitHub"** button
3. Click either button
4. Authorize the application
5. You'll be redirected back and logged in! ✨

---

## 📝 What Changed

- ✅ Backend now runs on **port 4000** (was 3001)
- ✅ All API URLs updated throughout codebase
- ✅ OAuth callback route added: `/auth/callback/:provider`
- ✅ Real JWT tokens (no more mock tokens)
- ✅ Passwords hashed with bcrypt
- ✅ Database has OAuthAccount table

---

## 🔍 Troubleshooting

**"Redirect URI mismatch"**
→ Ensure redirect URIs in OAuth apps exactly match:
  - Google: `http://localhost:3000/auth/callback/google`
  - GitHub: `http://localhost:3000/auth/callback/github`

**Backend not starting**
→ Check if port 4000 is already in use:
```bash
Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue
```

**Frontend can't reach backend**
→ Verify backend is running on port 4000
→ Check `.env.local` has `VITE_API_URL=http://localhost:4000`

**TypeScript errors about OAuthAccount**
→ Restart the backend server (Prisma client will regenerate)

---

## 📚 Full Documentation

- **Setup Guide**: `OAUTH_SETUP.md`
- **Implementation Details**: See walkthrough artifact
- **Environment Template**: `.env.example`

---

## 🎉 You're Ready!

The OAuth system is fully implemented and ready to use. Just add your credentials and start the servers!
