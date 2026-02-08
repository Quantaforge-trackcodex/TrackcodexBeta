import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth, api } from "../../context/AuthContext";

const OAuthCallback: React.FC = () => {
  const { provider } = useParams<{ provider: "google" | "github" }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const hasRun = React.useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const handleCallback = async () => {
      try {
        // HASH ROUTER FIX:
        // React Router's useLocation().search only sees params AFTER the hash (e.g., #/callback?code=...)
        // OAuth providers often redirect to /callback?code=... (no hash) or /?code=...#/callback
        // We must check window.location.search as a fallback.
        const routerParams = new URLSearchParams(location.search);
        const windowParams = new URLSearchParams(window.location.search);

        const code = routerParams.get("code") || windowParams.get("code");
        const state = routerParams.get("state") || windowParams.get("state");
        const error = routerParams.get("error") || windowParams.get("error");

        // Check for OAuth errors
        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error("No authorization code received");
        }

        // Verify state to prevent CSRF (lenient for development)
        const savedState = localStorage.getItem("oauth_state");

        // In development, allow missing state if we're in localhost
        const isDevelopment = window.location.hostname === "localhost";

        if (state && savedState && state !== savedState) {
          console.error("State mismatch:", {
            received: state,
            saved: savedState,
          });
          throw new Error("Invalid state parameter");
        }

        // Warn if state is missing but continue in development
        if (!savedState && !isDevelopment) {
          console.warn("OAuth state not found in localStorage");
          throw new Error("Invalid state parameter - session expired");
        }

        // Clear saved state
        localStorage.removeItem("oauth_state");

        // Create Session

        // Retrieve PKCE Code Verifier
        const codeVerifier = localStorage.getItem("oauth_code_verifier");

        // Exchange code for session with backend
        const response = await api.post(`/auth/${provider}`, {
          code,
          codeVerifier,
        });

        // Clean up PKCE verifier
        localStorage.removeItem("oauth_code_verifier");

        // Update auth context (cookie handles session, we just need csrf token)
        const data = response.data;
        login(data.user, data.csrfToken);

        // Store provider token for live API sync (e.g., GitHub Repos/Profile)
        if (provider === "github" && data.githubToken) {
          localStorage.setItem("trackcodex_github_token", data.githubToken);
        } else if (provider === "google" && data.googleToken) {
          localStorage.setItem("trackcodex_google_token", data.googleToken);
        }

        // Clear any manual token storage (legacy cleanup)
        localStorage.removeItem("auth_token");
        localStorage.removeItem("refresh_token");

        // Redirect to dashboard or saved path
        const redirectPath =
          localStorage.getItem("redirect_after_login") || "/dashboard/home";
        localStorage.removeItem("redirect_after_login");

        // Use navigate with small delay to ensure state is flushed
        setTimeout(() => navigate(redirectPath), 100);
      } catch (err) {
        const error = err as Error;
        console.error("OAuth callback error:", error);
        setError(error.message || "Authentication failed");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    };

    handleCallback();
  }, [provider, navigate, login, location.search]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gh-bg text-gh-text">
        <div className="bg-gh-bg-secondary border border-red-500 rounded-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-xl font-bold mb-2 text-red-400">
            Authentication Failed
          </h1>
          <p className="text-gh-text-secondary mb-4">{error}</p>
          <p className="text-sm text-gh-text-secondary">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gh-bg text-gh-text">
      <div className="bg-gh-bg-secondary border border-gh-border rounded-lg p-8 max-w-md text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <h1 className="text-xl font-bold mb-2">Completing Sign In</h1>
        <p className="text-gh-text-secondary">
          Authenticating with {provider === "google" ? "Google" : "GitHub"}...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;
