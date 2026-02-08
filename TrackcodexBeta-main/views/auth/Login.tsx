import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, api } from "../../context/AuthContext";
// import OAuthButton from "../../components/auth/OAuthButton";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // PKCE Helpers
  const generateRandomString = (length: number) => {
    const possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    let text = "";
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    return hash;
  };

  const base64urlencode = (a: ArrayBuffer) => {
    const bytes = new Uint8Array(a);
    let str = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      str += String.fromCharCode(bytes[i]);
    }
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };

  const generateCodeChallenge = async (v: string) => {
    const hashed = await sha256(v);
    return base64urlencode(hashed);
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const state = generateRandomString(32);
      const codeVerifier = generateRandomString(64);
      const codeChallenge = await generateCodeChallenge(codeVerifier);

      localStorage.setItem("oauth_state", state);
      localStorage.setItem("oauth_code_verifier", codeVerifier);

      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const redirectUri =
        `${window.location.protocol}//${window.location.host}/auth/callback/google`.replace(
          "#",
          "",
        ); // Correctly handle hash router or clean URL

      // NOTE: If using hash router, callback must be handled
      // Google doesn't strictly support fragment in Redirect URI for code flow easily without wildcards
      // Best practice: redirect to /auth/callback/google (server or client route)
      // The current configured URI in backend/services/oauth.ts is likely http://localhost:3001/auth/callback/google

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: "http://localhost:3002/auth/callback/google", // HARDCODED Matches Backend Expectation?
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
        state: state,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
      });

      // We need to match the backend expectation for redirect_uri.
      // In `oauth.ts`: process.env.GOOGLE_REDIRECT_URI || `${process.env.FRONTEND_URL}/auth/callback/google`
      // Assuming frontend runs on 3002.
      // Ideally, we fetch the auth URL from backend to ensure consistency.
      // BUT for now, let's construct it.

      // Let's use the current window origin logic but allow override
      const origin = window.location.origin;
      params.set("redirect_uri", `${origin}/#/auth/callback/google`); // Hash router support?
      // Google mostly rejects # in redirect_uri.
      // If we are using valid OAuth, we need a real path.
      // Let's assume the user has configured http://localhost:3002/auth/callback/google or similar.

      // For localhost, let's try to be smart.
      // If using HashRouter, this is tricky. The backend expects a specific string.
      // Checking `oauth.ts`: GOOGLE_REDIRECT_URI.
      // If backend uses a default, we must match it.
      // `oauth.ts` says: `${process.env.FRONTEND_URL || "http://localhost:3001"}/auth/callback/google`

      // Use dynamic origin to match current frontend URL
      // This ensures OAuth callbacks work correctly regardless of port
      params.set(
        "redirect_uri",
        `${window.location.origin}/auth/callback/google`,
      );

      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } catch (err) {
      console.error(err);
      setError("Failed to initialize Google login");
      setIsLoading(false);
    }
  };

  const handleGithubLogin = () => {
    setIsLoading(true);
    try {
      const state = generateRandomString(32);
      localStorage.setItem("oauth_state", state);

      const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: `${window.location.origin}/auth/callback/github`,
        scope: "read:user user:email",
        state: state,
      });

      window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
    } catch (err) {
      console.error(err);
      setError("Failed to initialize GitHub login");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", {
        username,
        email: username,
        password,
      });
      login(res.data.user, res.data.csrfToken);

      // Redirect to saved path or default
      const redirectPath =
        localStorage.getItem("redirect_after_login") || "/dashboard/home";
      localStorage.removeItem("redirect_after_login");
      navigate(redirectPath);
    } catch (err: unknown) {
      const error = err as {
        response?: { status?: number; data?: { error?: string } };
      };
      if (error.response?.status === 401 && !error.response?.data?.error) {
        setError("Invalid credentials");
      } else {
        setError(error.response?.data?.error || "Login failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to handle redirect after successful login
  // We can't do this inside handleSubmit easily because login() is void and might trigger rerender
  // But typically useAuth's login just needs to facilitate the state change.
  // Wait, useAuth.login is synchronous in context, but the CONSUMER usually handles the navigate.
  // Actually, looking at AuthContext, login just sets state. App.tsx listens to state change.
  // BUT App.tsx just renders ProtectedApp.
  // Let's check where the redirection usually happens.
  // In App.tsx:
  // {!isAuthenticated ? ( ...Login... ) : ( <Route path="/*" element={<ProtectedApp />} /> )}
  // So once isAuthenticated becomes true, ProtectedApp renders.
  // ProtectedApp renders routes. Default route is / -> /dashboard/home.

  // So we need to ensure that when ProtectedApp mounts, or somewhere, we navigate.
  // OR we can manually navigate here after calling login().
  // Let's modify handleSubmit to navigate.

  // Wait, if I call login(), isAuthenticated becomes true.
  // React Router will switch to ProtectedApp.
  // If I'm strictly at /login, ProtectedApp might redirect me to /dashboard/home via its own logic?
  // Let's check App.tsx again.
  // <Route path="*" element={<Navigate to="/dashboard/home" />} /> (inside ProtectedApp)

  // Actually, if we are at /login, and auth becomes true, App.tsx renders ProtectedApp.
  // ProtectedApp defines routes. /login is NOT a valid route in ProtectedApp.
  // So it falls through to * -> /dashboard/home.

  // To fix this, we should programmatically navigate to the intended URL *before* or *immediately after* setting auth state?
  // Or better, let ProtectedApp handle "if I am at /login, go to dashboard".

  // Actually, the standard pattern:
  // 1. User is at /login.
  // 2. User clicks login.
  // 3. handler calls login() -> context updates -> App rerenders -> shows ProtectedApp.
  // 4. URL is still /login.
  // 5. ProtectedApp routes don't have /login.
  // 6. It hits * -> Navigate to /dashboard/home.

  // SO, we can't easily intercept this in the component unless we change the URL *before* the context update triggers the App rerender?
  // No, context update triggers render immediately.

  // Better approach:
  // In Login.tsx:
  // const navigate = useNavigate();
  // ...
  // login(...)
  // const redirectPath = localStorage.getItem('redirect_after_login') || '/dashboard/home';
  // localStorage.removeItem('redirect_after_login');
  // navigate(redirectPath);

  // This race condition (App rerender vs navigate) is tricky.
  // If App rerenders first, it sees /login, renders ProtectedApp, which redirects to /dashboard.
  // However, if we navigate immediately after login(), we might beat it?

  // Let's try adding navigate import and usage.

  // Wait, I can't write all this reasoning in the ReplacementContent.

  // I will just add the navigation logic.

  return (
    <div className="flex min-h-screen font-display">
      {/* Left Panel - Dark & Artistic */}
      <div className="hidden lg:flex w-[45%] bg-gh-bg flex-col justify-center items-center relative overflow-hidden p-12 text-gh-text-secondary">
        {/* Background Accents */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-lg text-center">
          <h1 className="text-5xl font-bold mb-6 tracking-tight text-white leading-tight">
            Welcome back
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              to the future
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-12">
            Secure access to your TrackCodex workspace. Continue building what
            matters.
          </p>

          <div className="relative w-full aspect-square max-w-md mx-auto">
            {/* 3D Mascot Illustration */}
            <img
              src="/login_illu.png"
              alt="Login Security"
              className="w-full h-full object-contain drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Dark Form */}
      <div className="flex-1 bg-gh-bg flex flex-col justify-center items-center p-6 lg:p-12 text-gh-text">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gh-text">
              Sign in to TrackCodex
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-3 border border-gh-border rounded-lg hover:bg-gh-bg-secondary focus:ring-4 focus:ring-gh-border transition-all bg-gh-bg text-gh-text font-medium font-sans shadow-sm hover:shadow-md h-[50px]"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5 mr-3"
                alt="Google"
              />
              Google
            </button>
            <button
              type="button"
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-3 bg-[#24292e] hover:bg-[#1b1f23] text-white rounded-lg focus:ring-4 focus:ring-gray-300 transition-all font-medium font-sans shadow-lg hover:shadow-xl h-[50px]"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </button>
          </div>

          {/* DEV ONLY: Quick Login */}
          {import.meta.env.MODE === "development" && (
            <button
              onClick={async () => {
                try {
                  setIsLoading(true);
                  const res = await api.post("/auth/dev-login");
                  login(res.data.user, res.data.csrfToken);
                  const redirectPath =
                    localStorage.getItem("redirect_after_login") ||
                    "/dashboard/home";
                  localStorage.removeItem("redirect_after_login");
                  navigate(redirectPath);
                } catch (err: any) {
                  console.error("Dev login error:", err);
                  alert(
                    "Dev Login Failed: " +
                    (err.response?.data?.error ||
                      err.message ||
                      "Unknown error"),
                  );
                } finally {
                  setIsLoading(false);
                }
              }}
              disabled={isLoading}
              type="button"
              className="w-full mt-3 px-4 py-3 border border-yellow-400 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors font-bold shadow-sm flex items-center justify-center"
            >
              ⚡ Quick Login (Dev Only)
            </button>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gh-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gh-bg text-gh-text-secondary font-medium">
                or
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gh-text-secondary mb-2"
              >
                Username or Email Address
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gh-bg-secondary border border-gh-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-gh-text outline-none transition-all placeholder-gh-text-muted"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gh-text-secondary"
                >
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot password?
                </a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-gh-bg-secondary border border-gh-border rounded-md focus:ring-2 focus:ring-primary focus:border-primary text-gh-text outline-none transition-all placeholder-gh-text-muted"
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200 text-center">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-white hover:text-primary-foreground text-primary-foreground font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processing..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="text-center pt-4">
            <p className="text-sm text-gh-text-secondary">
              New to TrackCodex?{" "}
              <Link
                to="/signup"
                className="text-primary font-semibold hover:underline"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
