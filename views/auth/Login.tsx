import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLogo from '../../components/branding/AuthLogo';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ username });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-[#c9d1d9] font-display p-4">
      <div className="w-full max-w-sm mx-auto">
        <div className="flex justify-center mb-4">
          <AuthLogo size={48} />
        </div>
        <h1 className="text-2xl text-center mb-6 text-[#e6edf3]">
          Sign in to TrackCodex
        </h1>
        
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="username">
                Username or email address
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs text-primary hover:underline">Forgot password?</a>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-[#238636] hover:bg-[#2ea043] text-white font-semibold py-2 rounded-md transition-colors">
              Sign in
            </button>
          </form>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#30363d]"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#161b22] px-2 text-[#8b949e]">or</span>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-2">
              <img src="https://www.google.com/favicon.ico" alt="Google" className="size-4" />
              Continue with Google
            </button>
            <button className="w-full bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8.28,2.25a2.76,2.76,0,0,0-2.8,2.73c0,2.1,1.82,3.22,3.52,3.22s3.52-1.12,3.52-3.22a2.76,2.76,0,0,0-2.8-2.73m.11,1.19a1.59,1.59,0,0,1,1.71,1.55,1.57,1.57,0,0,1-1.71,1.55,1.58,1.58,0,0,1-1.71-1.55A1.59,1.59,0,0,1,8.39,3.44"/><path d="M12.42,14S10.26,8.71,8,8.71s-4.42,5.3-4.42,5.3a4,4,0,1,0,8.84,0"/></svg>
              Continue with Apple
            </button>
            <button onClick={() => login({})} className="w-full bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white font-semibold py-2 rounded-md transition-colors flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>
              Continue with GitHub
            </button>
          </div>
        </div>

        <div className="text-center mt-4 border border-[#30363d] rounded-lg p-4 text-sm">
          New to TrackCodex? <Link to="/signup" className="text-primary hover:underline">Create an account</Link>.
        </div>

        <div className="text-center mt-4">
          <a href="#" className="text-primary hover:underline text-sm">Sign in with a passkey</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
