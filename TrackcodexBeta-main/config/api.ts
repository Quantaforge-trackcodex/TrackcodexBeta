// API Configuration
// Centralized API URL configuration for the application

// Check for Electron-injected env, otherwise fallback to Vite env or relative path
const API_URL =
  (typeof window !== "undefined" && (window as any).electron?.env?.API_URL) ||
  import.meta.env.VITE_API_URL ||
  ""; // Empty string means use relative path (proxied by Vite)

export const API_BASE_URL = `${API_URL}/api/v1`;

// WebSocket URLs
export const WS_URL = API_URL.replace("http", "ws");
export const WS_BASE_URL = `${WS_URL}/api/v1`;

// Helper function to build API endpoints
export const buildApiUrl = (path: string): string => {
  // Remove leading slash if present
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};

// Helper function to build WebSocket URLs
export const buildWsUrl = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${WS_BASE_URL}/${cleanPath}`;
};

export default {
  API_BASE_URL,
  WS_BASE_URL,
  buildApiUrl,
  buildWsUrl,
};
