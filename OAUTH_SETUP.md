# OAuth Authentication Setup Guide

## Prerequisites

Before running the application with OAuth authentication, you need to set up OAuth credentials for Google and GitHub.

---

## Google OAuth Setup

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project**
   - Click "Select a project" → "New Project"
   - Name it (e.g., "TrackCodex")

3. **Enable Google+ API**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Google+ API" and enable it

4. **Create OAuth Credentials**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Name: "TrackCodex Web Client"
   
5. **Configure Authorized Redirect URIs**
   - Add: `http://localhost:3000/auth/callback/google`
   - For production, add your production URL

6. **Copy Credentials**
   - Copy the Client ID and Client Secret
   - Add them to your `.env` file

---

## GitHub OAuth Setup

1. **Go to GitHub Developer Settings**
   - Visit: https://github.com/settings/developers
   - Or: Settings → Developer settings → OAuth Apps

2. **Create New OAuth App**
   - Click "New OAuth App"
   - Application name: "TrackCodex"
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3000/auth/callback/github`

3. **Register Application**
   - Click "Register application"

4. **Generate Client Secret**
   - Click "Generate a new client secret"
   - Copy both Client ID and Client Secret immediately

5. **Add to Environment**
   - Add credentials to your `.env` file

---

## Environment Configuration

Create a `.env` file in the project root with the following:

```bash
# Database
DATABASE_URL="postgresql://admin:password123@localhost:5433/trackcodex?schema=public"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production-min-32-chars"
JWT_EXPIRES_IN="7d"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/auth/callback/google"

# GitHub OAuth  
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GITHUB_REDIRECT_URI="http://localhost:3000/auth/callback/github"

# Server
PORT=4000
FRONTEND_URL="http://localhost:3000"

# Gemini AI
GEMINI_API_KEY=your-gemini-api-key
```

Also create a `.env.local` file for frontend environment variables:

```bash
VITE_GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
VITE_GITHUB_CLIENT_ID="your-github-client-id"
VITE_API_URL="http://localhost:4000"
```

---

## Running the Application

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Database Migrations**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Start Backend Server** (Port 4000)
   ```bash
   npx tsx backend/server.ts
   ```

4. **Start Frontend Dev Server** (Port 3000)
   ```bash
   npm run dev
   ```

5. **Access the Application**
   - Open: http://localhost:3000
   - Click "Continue with Google" or "Continue with GitHub"

---

## Testing OAuth Flow

### Google OAuth Test:
1. Click "Continue with Google"
2. Select your Google account
3. Grant permissions
4. You'll be redirected back and logged in

### GitHub OAuth Test:
1. Click "Continue with GitHub"
2. Authorize the application
3. You'll be redirected back and logged in

---

## Troubleshooting

### "Redirect URI mismatch" error
- Ensure the redirect URI in your OAuth app settings exactly matches `http://localhost:3000/auth/callback/google` or `http://localhost:3000/auth/callback/github`

### "Invalid client" error
- Double-check your Client ID and Client Secret in `.env`
- Make sure there are no extra spaces or quotes

### Backend not responding
- Verify backend is running on port 4000
- Check `DATABASE_URL` is correct
- Ensure PostgreSQL is running

### Frontend can't reach backend
- Check `VITE_API_URL` in `.env.local`
- Verify CORS is enabled in backend

---

## Security Notes

- **Never commit `.env` files** to version control
- Use strong, random JWT secrets in production
- Enable HTTPS in production
- Set appropriate CORS origins for production
- Implement rate limiting on auth endpoints
- Use HttpOnly cookies for token storage in production

---

## Production Deployment

When deploying to production:

1. Update redirect URIs in Google/GitHub OAuth apps
2. Set production environment variables
3. Use HTTPS for all URLs
4. Update `FRONTEND_URL` and `VITE_API_URL`
5. Generate a new, secure JWT_SECRET
6. Enable additional security measures (CSRF, rate limiting)
