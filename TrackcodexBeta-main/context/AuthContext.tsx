import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  avatar?: string;
  role: string;
  bio?: string;
  company?: string;
  location?: string;
  website?: string;
  followers?: number;
  following?: number;
  createdAt?: string;
  profileReadme?: string;
  resumeUrl?: string;
  resumeFilename?: string;
  resumeUploadedAt?: string;
  showResume?: boolean;
  showReadme?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User, csrfToken: string) => void;
  logout: () => void;
  csrfToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create axios instance with credentials support
console.log("[AuthContext] API_BASE_URL:", API_BASE_URL);
console.log(
  "[AuthContext] import.meta.env.VITE_API_URL:",
  import.meta.env.VITE_API_URL,
);
export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Essential for sending Cookies
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [csrfToken, setCsrfToken] = useState<string | null>(
    localStorage.getItem("csrf_token"),
  );
  const [isLoading, setIsLoading] = useState(true);

  // Configure axios interceptor to attach CSRF token
  useEffect(() => {
    const interceptor = api.interceptors.request.use((config) => {
      // CSRF token is needed for state-changing requests
      if (
        ["post", "put", "delete", "patch"].includes(
          config.method?.toLowerCase() || "",
        ) &&
        csrfToken
      ) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
      return config;
    });

    return () => api.interceptors.request.eject(interceptor);
  }, [csrfToken]);

  useEffect(() => {
    const checkAuthStatus = async () => {
      console.log("AuthContext: Starting checkAuthStatus");
      try {
        const res = await api.get("/auth/me");
        console.log("AuthContext: checkAuthStatus returned", res);
        if (res.data.user) {
          console.log("AuthContext: User found", res.data.user);
          setUser(res.data.user);
          if (res.data.csrfToken) {
            setCsrfToken(res.data.csrfToken);
            localStorage.setItem("csrf_token", res.data.csrfToken);
          }
        }
      } catch (error) {
        console.warn(
          "AuthContext: checkAuthStatus failed (not logged in)",
          error,
        );
        // Not authenticated or Error
        console.warn("Auth check failed or 500 error, logging out");
        setUser(null);
        setCsrfToken(null);
        localStorage.removeItem("csrf_token");
      } finally {
        console.log(
          "AuthContext: checkAuthStatus finished, setting isLoading false",
        );
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setCsrfToken(token);
    localStorage.setItem("csrf_token", token); // CSRF token is safe in localStorage (unlike auth token)
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
      setCsrfToken(null);
      localStorage.removeItem("csrf_token");
      // Force reload to clear any application state
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        csrfToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
