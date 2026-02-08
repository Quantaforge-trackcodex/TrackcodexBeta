/**
 * OAuth Service for Google and GitHub authentication
 * Handles OAuth2 flows, token exchange, and user profile fetching
 */
import { encrypt } from "./encryption";

// Access env vars lazily to avoid import order issues
const getGoogleClientId = () => process.env.GOOGLE_CLIENT_ID || "";
const getGoogleClientSecret = () => process.env.GOOGLE_CLIENT_SECRET || "";
const getGoogleRedirectUri = () =>
  process.env.GOOGLE_REDIRECT_URI ||
  `${process.env.FRONTEND_URL || "http://localhost:3001"}/auth/callback/google`;

const getGithubClientId = () =>
  process.env.GITHUB_CLIENT_ID || process.env.VITE_GITHUB_CLIENT_ID || "";
const getGithubClientSecret = () => process.env.GITHUB_CLIENT_SECRET || "";
const getGithubRedirectUri = () =>
  process.env.GITHUB_REDIRECT_URI ||
  `${process.env.FRONTEND_URL || "http://localhost:3001"}/auth/callback/github`;

console.log("--- OAuth Service Initialization (Lazy) ---");
// We can't log values here reliably if dotenv loads later, but we can log that we are initialized.
console.log("OAuthService module loaded.");

export interface OAuthTokenData {
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  id_token?: string;
  scope?: string;
}

export interface OAuthUserInfo {
  id: string;
  email: string;
  username?: string;
  name: string;
  avatar?: string;
}

export class OAuthService {
  /**
   * Generate Google OAuth authorization URL
   */
  static getGoogleAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      client_id: getGoogleClientId(),
      redirect_uri: getGoogleRedirectUri(),
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
      ...(state && { state }),
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Exchange Google authorization code for access token
   */
  static async exchangeGoogleCode(
    code: string,
    codeVerifier?: string,
  ): Promise<OAuthTokenData> {
    const params: Record<string, string> = {
      code,
      client_id: getGoogleClientId(),
      client_secret: getGoogleClientSecret(),
      redirect_uri: getGoogleRedirectUri(),
      grant_type: "authorization_code",
    };

    if (codeVerifier) {
      params.code_verifier = codeVerifier;
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(params),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Google token exchange failed: ${error}`);
    }

    return response.json();
  }

  /**
   * Fetch Google user profile information
   */
  static async getGoogleUserInfo(accessToken: string): Promise<OAuthUserInfo> {
    const response = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Google user info");
    }

    const data = await response.json();
    return {
      id: data.id,
      email: data.email,
      name: data.name,
      avatar: data.picture,
    };
  }

  /**
   * Generate GitHub OAuth authorization URL
   */
  static getGithubAuthUrl(state?: string): string {
    if (!getGithubClientId()) {
      throw new Error("GitHub Client ID is not configured on the server.");
    }
    const params = new URLSearchParams({
      client_id: getGithubClientId(),
      redirect_uri: getGithubRedirectUri(),
      scope: "read:user user:email",
      ...(state && { state }),
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  /**
   * Exchange GitHub authorization code for access token
   */
  static async exchangeGithubCode(code: string): Promise<OAuthTokenData> {
    if (!getGithubClientId() || !getGithubClientSecret()) {
      throw new Error("GitHub credentials are not configured on the server.");
    }

    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: getGithubClientId(),
          client_secret: getGithubClientSecret(),
          code,
          redirect_uri: getGithubRedirectUri(),
        }),
      },
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`GitHub token exchange failed: ${error}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error("GitHub OAuth Error:", data); // DEBUG LOG
      throw new Error(
        `GitHub token exchange error: ${data.error_description || data.error}`,
      );
    }

    if (!data.access_token) {
      console.error("GitHub OAuth Missing Token:", data); // DEBUG LOG
      throw new Error("GitHub token exchange failed: No access_token received");
    }

    return data;
  }

  /**
   * Fetch GitHub user profile information
   */
  static async getGithubUserInfo(accessToken: string): Promise<OAuthUserInfo> {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub user info");
    }

    const data = await response.json();

    // Fetch email if missing
    let email = data.email;
    if (!email) {
      email = await this.getGithubPrimaryEmail(accessToken);
    }

    return {
      id: String(data.id),
      email: email,
      username: data.login,
      name: data.name || data.login,
      avatar: data.avatar_url,
    };
  }

  private static async getGithubPrimaryEmail(
    accessToken: string,
  ): Promise<string> {
    const response = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch GitHub user emails");
    }

    const emails = await response.json();
    const primary = emails.find((e: any) => e.primary && e.verified);
    if (primary) return primary.email;

    const verified = emails.find((e: any) => e.verified);
    return verified ? verified.email : null;
  }
}

// Export singleton or static class? Static class usage in routes.
// We also export strict encryption helpers if needed, but routes can import from encryption.ts directly.

export interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export interface GitHubUserInfo {
  id: number;
  login: string;
  email: string | null;
  name: string | null;
  avatar_url: string;
}

export interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

/**
 * Generate Google OAuth authorization URL
 */
export function getGoogleAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: getGoogleClientId(),
    redirect_uri: getGoogleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    ...(state && { state }),
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange Google authorization code for access token
 */
export async function exchangeGoogleCode(
  code: string,
  codeVerifier?: string,
): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  id_token?: string;
}> {
  const params: Record<string, string> = {
    code,
    client_id: getGoogleClientId(),
    client_secret: getGoogleClientSecret(),
    redirect_uri: getGoogleRedirectUri(),
    grant_type: "authorization_code",
  };

  if (codeVerifier) {
    params.code_verifier = codeVerifier;
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Google token exchange failed: ${error}`);
  }

  return response.json();
}

/**
 * Fetch Google user profile information
 */
export async function getGoogleUserInfo(
  accessToken: string,
): Promise<GoogleUserInfo> {
  const response = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Google user info");
  }

  return response.json();
}

/**
 * Generate GitHub OAuth authorization URL
 */
export function getGithubAuthUrl(state?: string): string {
  if (!getGithubClientId()) {
    throw new Error("GitHub Client ID is not configured on the server.");
  }
  const params = new URLSearchParams({
    client_id: getGithubClientId(),
    redirect_uri: getGithubRedirectUri(),
    scope: "read:user user:email",
    ...(state && { state }),
  });

  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

/**
 * Exchange GitHub authorization code for access token
 */
export async function exchangeGithubCode(code: string): Promise<{
  access_token: string;
  token_type: string;
  scope: string;
}> {
  if (!getGithubClientId() || !getGithubClientSecret()) {
    throw new Error("GitHub credentials are not configured on the server.");
  }

  const response = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: getGithubClientId(),
      client_secret: getGithubClientSecret(),
      code,
      redirect_uri: getGithubRedirectUri(),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub token exchange failed: ${error}`);
  }

  return response.json();
}

/**
 * Fetch GitHub user profile information
 */
export async function getGithubUserInfo(
  accessToken: string,
): Promise<GitHubUserInfo> {
  const response = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub user info");
  }

  return response.json();
}

/**
 * Fetch GitHub user emails (needed because email might not be public)
 */
export async function getGithubUserEmails(
  accessToken: string,
): Promise<GitHubEmail[]> {
  const response = await fetch("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch GitHub user emails");
  }

  return response.json();
}

/**
 * Get primary verified email from GitHub
 */
export function getPrimaryEmail(emails: GitHubEmail[]): string | null {
  const primaryEmail = emails.find((e) => e.primary && e.verified);
  if (primaryEmail) return primaryEmail.email;

  const verifiedEmail = emails.find((e) => e.verified);
  if (verifiedEmail) return verifiedEmail.email;

  return emails[0]?.email || null;
}
