import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, api } from "../../context/AuthContext";
import { otpService } from "../../services/otp";

const Signup = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("India");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // OTP State
  const [otpMode, setOtpMode] = useState(false);
  const [otpInput, setOtpInput] = useState("");

  const handleGoogleLogin = () => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem("oauth_state", state);
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
      redirect_uri: "http://localhost:3000/auth/callback/google",
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
      state,
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  const handleGithubLogin = () => {
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem("oauth_state", state);
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_GITHUB_CLIENT_ID || "",
      redirect_uri: "http://localhost:3000/auth/callback/github",
      scope: "read:user user:email",
      state,
    });
    window.location.href = `https://github.com/login/oauth/authorize?${params.toString()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Step 1: Send OTP
      await otpService.sendOTP(email);
      setOtpMode(true);
    } catch (err) {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Step 2: Verify OTP
      await otpService.verifyOTP(email, otpInput);

      // Step 3: Create Account
      const res = await api.post("/auth/register", {
        email,
        password,
        username,
        name: username,
        country,
      });

      login(res.data.user, res.data.csrfToken);
    } catch (err: any) {
      // Extract error message from axios response or general error
      const backendMessage = err.response?.data?.message || err.response?.data?.error;
      const errorMessage = backendMessage || err.message || "Registration failed";
      console.error("[Signup] Registration failed:", err.response?.data || err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
            Create your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              free account
            </span>
          </h1>
          <p className="text-lg text-gray-400 mb-12">
            Explore TrackCodex's core features for individuals and
            organizations. Code, collaborate, and ship faster.
          </p>

          <div className="relative w-full aspect-square max-w-md mx-auto">
            {/* 3D Mascot Illustration */}
            <img
              src="/auth_illu.png"
              alt="TrackCodex Mascot"
              className="w-full h-full object-contain drop-shadow-2xl animate-[float_6s_ease-in-out_infinite]"
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Light & Clean Form */}
      <div className="flex-1 bg-white flex flex-col justify-center items-center p-6 lg:p-12 text-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Sign up for TrackCodex
            </h2>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => {
                if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
                  alert("Configuration Error: Missing Google Client ID");
                  return;
                }
                handleGoogleLogin();
              }}
              className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 bg-white shadow-sm"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
            <button
              onClick={() => {
                const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
                if (!clientId) {
                  alert("Configuration Error: Missing GitHub Client ID");
                  return;
                }
                if (clientId.length === 40 && !clientId.includes(".")) {
                  alert(
                    "Configuration Error: It looks like you pasted the GitHub Client SECRET instead of the Client ID. Please check your .env file.",
                  );
                  return;
                }
                handleGithubLogin();
              }}
              className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700 bg-white shadow-sm"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Continue with GitHub
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500 font-medium">
                or
              </span>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* OTP Verification UI */}
          {otpMode ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
              <div className="text-center space-y-2">
                <div className="size-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Verify your email
                </h3>
                <p className="text-sm text-gray-500">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-gray-900">{email}</span>.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                  Verification Code
                </label>
                <input
                  autoFocus
                  type="text"
                  value={otpInput}
                  onChange={(e) =>
                    setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-2xl font-mono tracking-[0.5em]"
                  maxLength={6}
                />
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otpInput.length !== 6}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify & Create Account"}
                </button>
                <button
                  type="button"
                  onClick={() => setOtpMode(false)}
                  className="w-full text-sm text-gray-500 hover:text-gray-900 font-medium"
                >
                  Back to details
                </button>
              </div>

              <p className="text-xs text-center text-gray-400">
                Check your spam folder or wait a minute before requesting again.
              </p>
            </div>
          ) : (
            /* Original Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Must be at least 8 characters.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Choose a username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Only alphanumeric characters and hyphens.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Country/Region *
                </label>
                <select
                  title="Select your country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                >
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Germany">Germany</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#1F2937] hover:bg-black text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Continue" : "Continue"}
                </button>
                <p className="text-xs text-gray-500 text-center mt-4">
                  By creating an account, you agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </form>
          )}

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
