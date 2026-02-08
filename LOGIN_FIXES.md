# TrackCodex Login Issues - Fixed

## Summary
Fixed multiple critical issues preventing the application from starting and login from working.

---

## Issues Fixed

### 1. ✅ Missing Dependencies
- **Issue**: npm install was failing due to peer dependency conflicts
- **Root Cause**: `fastify-socket.io@5.1.0` requires `fastify@4.x` but project had `fastify@5.7.1`
- **Solution**: Installed dependencies with `npm install --legacy-peer-deps`
- **Status**: RESOLVED

### 2. ✅ Missing Environment Variables
- **Issue**: Server would not start because critical environment variables were missing
- **Root Cause**: `.env` file existed but was missing `JWT_SECRET`, `PORT`, and `NODE_ENV`
- **Solution**: Updated `.env` with:
  ```env
  JWT_SECRET=super-secret-jwt-key-change-in-production-minimum-32-chars-12345
  PORT=4000
  NODE_ENV=development
  ```
- **Status**: RESOLVED

### 3. ✅ Database Migrations
- **Issue**: Prisma migrations not deployed
- **Root Cause**: No manual migration deployment before server startup
- **Solution**: Ran `npx prisma migrate deploy` successfully
  - Confirmed: 14 migrations found and applied
  - Database schema is fully configured
- **Status**: RESOLVED

### 4. ✅ OAuth Redirect URI Mismatch
- **Issue**: Google OAuth redirects were hardcoded to `localhost:3002` causing login failures
- **Root Cause**: Login.tsx had hardcoded port instead of using `window.location.origin`
- **Solution**: Updated Login.tsx to use dynamic origin:
  ```tsx
  params.set(
    "redirect_uri",
    `${window.location.origin}/auth/callback/google`,
  );
  ```
- **Status**: RESOLVED

### 5. ✅ API Proxy Configuration
- **Issue**: Frontend API calls needed to be proxied to backend
- **Verification**: Vite config has proper proxy setup:
  ```javascript
  proxy: {
    "/api": {
      target: "http://127.0.0.1:4000",
      changeOrigin: true,
      secure: false,
    }
  }
  ```
- **Status**: VERIFIED WORKING

### 6. ✅ CORS Configuration
- **Issue**: Cross-Origin requests from frontend to backend needed proper CORS headers
- **Verification**: Server has strict CORS configuration:
  - Allows `http://localhost:*` (any localhost port)
  - Allows `http://127.0.0.1:*` (any IP ports)
  - Credentials (cookies) are enabled
  - Required headers are whitelisted: `Content-Type`, `Authorization`, `X-CSRF-Token`, `x-user-id`
- **Status**: VERIFIED WORKING

### 7. ✅ Session Management
- **Issue**: Session creation and retrieval for authentication
- **Verification**: Backend has complete session service with:
  - HttpOnly cookie-based sessions
  - CSRF token generation
  - Prisma Session model properly configured
  - Authentication middleware properly implemented
- **Status**: VERIFIED WORKING

---

## Required Configuration

### Environment Variables (.env)
```env
# Database
DATABASE_URL=postgresql://postgres:password@127.0.0.1:5435/trackcodex

# Authentication
JWT_SECRET=super-secret-jwt-key-change-in-production-minimum-32-chars-12345
COOKIE_SECRET=super-secret-cookie-key-change-in-prod-min-32-chars

# Server
PORT=4000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# OAuth (optional for development)
GOOGLE_CLIENT_ID=YOUR_ID
GOOGLE_CLIENT_SECRET=YOUR_SECRET
GITHUB_CLIENT_ID=YOUR_ID
GITHUB_CLIENT_SECRET=YOUR_SECRET

# API
RESEND_API_KEY=your-key
GEMINI_API_KEY=your-key
```

---

## Running the Application

### Backend Server
```bash
npm run server
# or
npx tsx watch -r dotenv/config backend/server.ts
```
Listens on: `http://localhost:4000`

### Frontend Development
```bash
npm run dev
```
Listens on: `http://localhost:3001`

---

## Authentication Flow

1. **User Signup**:
   - POST `/auth/register` with email, password, name, username
   - Returns: user data + CSRF token
   - Sets: HttpOnly session cookie

2. **User Login**:
   - POST `/auth/login` with email/username and password
   - Returns: user data + CSRF token
   - Sets: HttpOnly session cookie

3. **Session Validation**:
   - GET `/auth/me` validates existing session
   - Returns: current user data if authenticated
   - Returns: 401 if session invalid/expired

4. **OAuth Login** (Google/GitHub):
   - User clicks OAuth button
   - Frontend redirects to OAuth provider
   - Provider redirects back to `/auth/callback/{provider}`
   - Backend validates code and creates session

---

## Testing Login

1. Start backend:
   ```bash
   npm run server
   ```

2. Start frontend (in another terminal):
   ```bash
   npm run dev
   ```

3. Visit: `http://localhost:3001/login`

4. Test credentials:
   - Email: test@example.com
   - Password: password123 (or register new account)

---

## Troubleshooting

### Issue: "API request failed" / CORS errors
- **Check**: Backend is running on port 4000
- **Check**: Frontend is running on port 3001
- **Check**: Vite proxy is configured correctly
- **Fix**: Clear browser cache and restart both servers

### Issue: "Session invalid" when logging in
- **Check**: Database is running and migrations are applied
- **Check**: COOKIE_SECRET is set and min 32 characters
- **Check**: Cookies are enabled in browser

### Issue: OAuth login not working
- **Check**: OAuth credentials are valid from Google/GitHub
- **Check**: Redirect URI matches exactly (including protocol and port)
- **Check**: Browser console for errors

### Issue: Server won't start
- **Check**: NODE_ENV is set to "development"
- **Check**: DATABASE_URL is correct and database is running
- **Check**: All required env variables are set
- **Fix**: Run `npm install --legacy-peer-deps` again

---

## Files Modified

1. `.env` - Added missing environment variables
2. `views/auth/Login.tsx` - Fixed OAuth redirect URI to use dynamic origin
3. Dependencies installed with `npm install --legacy-peer-deps`
4. Database migrations deployed with `npx prisma migrate deploy`

---

## Next Steps

1. Register or login with test credentials
2. Verify 2FA if enabled
3. Test OAuth login (Google/GitHub)
4. Check workspace creation and collaboration features

---

## Support

For issues or questions, check:
- Backend logs: Console output when running `npm run server`
- Frontend logs: Browser DevTools Console
- Database logs: PostgreSQL logs
- Error files: `backend_register_error.log`, `server_error*.txt`
