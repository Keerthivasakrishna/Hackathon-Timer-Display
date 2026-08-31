import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { authenticateUser } from '../../utils/auth';

const PanelLoginForm = ({ onLoginSuccess, onReturnToDisplay }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Artificial short delay for smooth security feel
    setTimeout(async () => {
      const result = await authenticateUser(username, password, rememberMe);
      setIsLoading(false);

      if (result.success) {
        onLoginSuccess();
      } else {
        setError(result.error || 'Access Denied: Invalid Credentials');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black relative px-4 overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-neutral-900/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-[0_0_50px_rgba(168,85,247,0.15)] p-8 transition-all">
        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <Lock className="w-8 h-8 text-purple-300" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>ORGANIZER PORTAL</span>
          </div>
          <h2 className="text-2xl font-bold font-orbitron tracking-wide text-white">
            HACKTRONICS <span className="text-purple-400">2.0</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Restricted Access • Authenticate to manage display & timer
          </p>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400/70">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                className="w-full bg-black/60 border border-purple-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all font-mono"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-purple-400/70">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                className="w-full bg-black/60 border border-purple-500/30 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me Option */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-purple-500/40 bg-black/50 text-purple-600 focus:ring-purple-500 focus:ring-offset-black accent-purple-600"
              />
              <span>Remember session on this device</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>UNLOCK CONTROL PANEL</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Return Link */}
        <div className="mt-6 pt-5 border-t border-purple-500/20 text-center">
          <button
            type="button"
            onClick={onReturnToDisplay}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-purple-300 transition-colors cursor-pointer font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Main Auditorium Display</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PanelLoginForm;
