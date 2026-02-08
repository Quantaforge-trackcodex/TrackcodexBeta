import React, { useState, useEffect } from "react";
import { api } from "../../context/AuthContext";
import OAuthButton from "../../components/auth/OAuthButton";

interface LoadingState {
  google: boolean;
  github: boolean;
}

const LinkedAccounts: React.FC = () => {
  const [connected, setConnected] = useState({
    google: false,
    github: false,
  });
  const [loading, setLoading] = useState<LoadingState>({
    google: false,
    github: false,
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch current connections
    const fetchConnections = async () => {
      try {
        const res = await api.get("/auth/connections");
        setConnected(res.data);
      } catch (err) {
        console.error("Failed to fetch connections");
      }
    };
    fetchConnections();
  }, []);

  const handleLink = (provider: "google" | "github") => {
    setLoading((prev) => ({ ...prev, [provider]: true }));

    // Save current path to return after OAuth
    localStorage.setItem("oauth_return_path", "/settings/security");

    // Initiate OAuth flow (similar to login but for linking)
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem("oauth_state", state);

    let url = "";

    if (provider === "google") {
      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
        redirect_uri: "http://localhost:3000/auth/callback/google",
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "consent",
        state,
      });
      url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    } else {
      const params = new URLSearchParams({
        client_id: import.meta.env.VITE_GITHUB_CLIENT_ID || "",
        redirect_uri: "http://localhost:3000/auth/callback/github",
        scope: "read:user user:email",
        state,
      });
      url = `https://github.com/login/oauth/authorize?${params.toString()}`;
    }

    window.location.href = url;
  };

  const handleUnlink = async (provider: "google" | "github") => {
    if (
      !confirm(`Are you sure you want to disconnect your ${provider} account?`)
    )
      return;

    setLoading((prev) => ({ ...prev, [provider]: true }));
    setError("");
    setMessage("");

    try {
      await api.delete(`/auth/connections/${provider}`);
      setConnected((prev) => ({ ...prev, [provider]: false }));
      setMessage(`${provider} disconnected successfully.`);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to disconnect account");
    } finally {
      setLoading((prev) => ({ ...prev, [provider]: false }));
    }
  };

  return (
    <div className="p-6 bg-gh-bg-secondary border border-gh-border rounded-lg">
      <h3 className="text-lg font-semibold text-gh-text mb-4">
        Linked Accounts
      </h3>
      <p className="text-sm text-gh-text-secondary mb-6">
        Connect external accounts to sign in faster and sync data.
      </p>

      {error && (
        <div className="mb-4 text-red-400 text-sm bg-red-900/10 p-2 rounded border border-red-500/20">
          {error}
        </div>
      )}
      {message && (
        <div className="mb-4 text-green-400 text-sm bg-green-900/10 p-2 rounded border border-green-500/20">
          {message}
        </div>
      )}

      <div className="space-y-4">
        {/* Google */}
        <div className="flex items-center justify-between p-4 bg-gh-bg border border-gh-border rounded-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                alt="Google"
                className="w-6 h-6"
              />
            </div>
            <div>
              <div className="font-medium text-gh-text">Google</div>
              <div className="text-xs text-gh-text-secondary">
                {connected.google ? "Connected" : "Not connected"}
              </div>
            </div>
          </div>
          {connected.google ? (
            <button
              onClick={() => handleUnlink("google")}
              disabled={loading.google}
              className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1.5 border border-gh-border rounded bg-gh-bg-secondary"
            >
              {loading.google ? "Disconnecting..." : "Disconnect"}
            </button>
          ) : (
            <button
              onClick={() => handleLink("google")}
              disabled={loading.google}
              className="text-gh-text hover:text-white text-sm font-medium px-3 py-1.5 border border-gh-border rounded bg-gh-bg-secondary hover:bg-gh-bg-tertiary"
            >
              {loading.google ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>

        {/* GitHub */}
        <div className="flex items-center justify-between p-4 bg-gh-bg border border-gh-border rounded-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#24292f] rounded-full flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gh-text">GitHub</div>
              <div className="text-xs text-gh-text-secondary">
                {connected.github ? "Connected" : "Not connected"}
              </div>
            </div>
          </div>
          {connected.github ? (
            <button
              onClick={() => handleUnlink("github")}
              disabled={loading.github}
              className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1.5 border border-gh-border rounded bg-gh-bg-secondary"
            >
              {loading.github ? "Disconnecting..." : "Disconnect"}
            </button>
          ) : (
            <button
              onClick={() => handleLink("github")}
              disabled={loading.github}
              className="text-gh-text hover:text-white text-sm font-medium px-3 py-1.5 border border-gh-border rounded bg-gh-bg-secondary hover:bg-gh-bg-tertiary"
            >
              {loading.github ? "Connecting..." : "Connect"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinkedAccounts;
