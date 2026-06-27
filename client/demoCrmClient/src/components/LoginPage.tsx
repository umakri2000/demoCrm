import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, ShieldCheck, Cloud, X, Loader2 } from 'lucide-react';

interface LoginPageProps {
  onNavigateToSignUp: () => void;
  onNavigateToContact: () => void;
}

export var LoginPage: React.FC<LoginPageProps> = ({ onNavigateToSignUp, onNavigateToContact }) => {
  var { login, error, clearError, isLoading } = useAuth();

  // Form states
  var [email, setEmail] = useState('');
  var [password, setPassword] = useState('');
  var [showPassword, setShowPassword] = useState(false);

  // Field validation error states
  var [emailError, setEmailError] = useState('');
  var [passwordError, setPasswordError] = useState('');

  // Handle field changes and clear respective error
  var handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  var handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError('');
  };

  // Email format validation helper
  var validateEmailFormat = (emailStr: string): boolean => {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailStr);
  };

  // Form submission handler
  var handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    let isValid = true;

    // Validate Email
    if (!email.trim()) {
      setEmailError('Please enter your email address.');
      isValid = false;
    } else if (!validateEmailFormat(email.trim())) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate Password
    if (!password) {
      setPasswordError('Please enter your password.');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!isValid) return;

    try {
      await login(email.trim(), password);
    } catch (err) {
      console.warn('Authentication failed: user details incorrect or server unreachable.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans antialiased text-slate-800">
      <header className="w-full bg-[#f8fafc] border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="flex items-end gap-1.5 h-6">
              <span className="w-1.5 h-3.5 bg-slate-900 rounded-[1px]"></span>
              <span className="w-1.5 h-5 bg-slate-900 rounded-[1px]"></span>
              <span className="w-1.5 h-4 bg-slate-900 rounded-[1px]"></span>
            </div>
            <span className="text-[18px] font-bold text-slate-900 tracking-tight"> CRM</span>
          </div>

          {/* Navigation Links - Centered/Right Layout */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-slate-950 transition-colors">Product</a>
            <a href="#" className="hover:text-slate-950 transition-colors">Resources</a>
            <a href="#" className="hover:text-slate-950 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={onNavigateToContact} className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">Contact Us</button>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-slate-950 transition-colors">Support</a>
            {/* Simple Hamburger menu for mobile navigation */}
            <div className="md:hidden flex items-center">
              <button
                type="button"
                className="text-slate-600 hover:text-slate-950"
                onClick={() => alert("Mobile navigation toggled")}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container - Vertically and Horizontally Centered Login Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-16">
        <div className="w-full max-w-[480px] bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-100/50 p-8 md:p-10 transition-all duration-300">

          {/* Card Title & Description */}
          <div className="mb-8">
            <h1 className="text-[26px] font-semibold text-slate-900 tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-1.5">Sign in to manage your pipeline efficiently.</p>
          </div>

          {/* Dismissible Error Alert Banner */}
          {error && (
            <div className="mb-6 flex items-start justify-between bg-red-50 border border-red-200/60 rounded-xl p-4 text-sm text-red-700 animate-[fadeIn_0.2s_ease-out]">
              <span className="font-medium pr-2">{error}</span>
              <button
                onClick={clearError}
                type="button"
                className="text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md p-1 -mt-1 -mr-1 transition-all duration-200"
                aria-label="Dismiss alert"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Address Input */}
            <div>
              <label htmlFor="email" className="block text-slate-800 text-[14px] font-medium mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={handleEmailChange}
                placeholder="name@company.com"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg border text-sm transition-all duration-200 outline-none
                  ${emailError
                    ? 'border-red-500 ring-2 ring-red-100'
                    : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                  }
                  disabled:opacity-60 disabled:cursor-not-allowed`}
              />
              {emailError && (
                <p className="text-red-500 text-xs mt-1.5 font-medium animate-[fadeIn_0.2s_ease-out]">
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-slate-800 text-[14px] font-medium">
                  Password
                </label>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors hover:underline"
                  onClick={(e) => { e.preventDefault(); alert("Password recovery requested"); }}
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 pr-12 bg-white text-slate-900 placeholder:text-slate-400 rounded-lg border text-sm transition-all duration-200 outline-none
                    ${passwordError
                      ? 'border-red-500 ring-2 ring-red-100'
                      : 'border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
                    }
                    disabled:opacity-60 disabled:cursor-not-allowed`}
                />
                {/* Show/Hide Password Toggle */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded text-slate-400 hover:text-slate-600 transition-colors"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1.5 font-medium animate-[fadeIn_0.2s_ease-out]">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Login / Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 text-white font-semibold rounded-lg text-sm shadow-md shadow-blue-500/10 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline"
              onClick={onNavigateToSignUp}
            >
              Sign Up
            </button>
          </div>
        </div>
      </main>

      {/* Footer Branding & Features */}
      <footer className="w-full border-t border-slate-200/50 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-center items-center gap-6 text-slate-500 text-[13px] font-medium">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>Secure Data</span>
          </div>
          <div className="hidden sm:block text-slate-300">•</div>
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-slate-400" />
            <span>Uptime 99.9%</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
