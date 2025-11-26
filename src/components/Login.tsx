import { useState } from 'react';
import { Wheat, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: (user: { name: string; email: string; avatar?: string; createdAt: string }) => void;
  onNavigate: (page: string) => void;
}

export function Login({ onLogin, onNavigate }: LoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.name
            }
          }
        });
        if (error) throw error;
        if (data.user && !data.user.email_confirmed_at) {
          alert('Please check your email to verify your account!');
        } else if (data.user) {
          onNavigate('home');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });
        if (error) throw error;
        onNavigate('home');
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error:', error);
      alert('Google login failed. Please try again.');
    }
  };

  const handleBack = () => {
    onNavigate('home');
  };

  const handleForgotPassword = async () => {
    const email = prompt('Enter your email address:');
    if (email) {
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        });
        if (error) throw error;
        alert(`Password reset link sent to ${email}`);
      } catch (error: any) {
        alert(error.message || 'Failed to send reset email');
      }
    }
  };

  const handleTermsClick = () => {
    alert('Terms of Service: This is a demo application. No real terms apply.');
  };

  const handlePrivacyClick = () => {
    alert('Privacy Policy: This demo app does not collect or store personal data.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background - Full coverage farmland image */}
      <div className="absolute inset-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1724531281596-cfae90d5a082?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZhcm1sYW5kJTIwYWVyaWFsfGVufDF8fHx8MTc2NDEzMDAzMXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Green farmland aerial view"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C3C01]/70 to-[#355E2D]/60" />
      </div>

      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm text-[#0C3C01] rounded-full hover:bg-white transition-all shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </button>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-10 border border-[#0C3C01]/10">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#0C3C01] rounded-full mb-3">
              <Wheat className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-[#0C3C01] text-xl">
              Ferti-AI 🌾
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-[#F6F3E7] p-1 rounded-xl">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 rounded-lg transition-all ${
                !isSignUp
                  ? 'bg-white text-[#0C3C01] shadow-md'
                  : 'text-[#6B7C59]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 rounded-lg transition-all ${
                isSignUp
                  ? 'bg-white text-[#0C3C01] shadow-md'
                  : 'text-[#6B7C59]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <label className="block text-[#0C3C01]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7C59]" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-12 pr-4 py-3 bg-[#F6F3E7] border border-[#0C3C01]/20 rounded-xl focus:outline-none focus:border-[#0C3C01] transition-colors text-[#0C3C01]"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-[#0C3C01]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7C59]" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="farmer@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-[#F6F3E7] border border-[#0C3C01]/20 rounded-xl focus:outline-none focus:border-[#0C3C01] transition-colors text-[#0C3C01]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[#0C3C01]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B7C59]" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 bg-[#F6F3E7] border border-[#0C3C01]/20 rounded-xl focus:outline-none focus:border-[#0C3C01] transition-colors text-[#0C3C01]"
                  required
                />
              </div>
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-[#6B7C59] cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-[#0C3C01]/20 text-[#0C3C01] focus:ring-[#0C3C01]"
                  />
                  Remember me
                </label>
                <button type="button" onClick={handleForgotPassword} className="text-[#0C3C01] hover:text-[#355E2D]">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 gradient-moss text-white rounded-xl hover:shadow-xl transition-all hover:scale-105"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#0C3C01]/20" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white/80 text-[#6B7C59] text-sm">
                or continue with
              </span>
            </div>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-4 bg-white border-2 border-[#8B7765] text-[#0C3C01] rounded-xl hover:bg-[#F6F3E7] transition-all flex items-center justify-center gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google
          </button>

          {/* Terms */}
          {isSignUp && (
            <p className="mt-4 text-center text-xs text-[#6B7C59]">
              By signing up, you agree to our{' '}
              <button onClick={handleTermsClick} className="text-[#0C3C01] hover:underline">Terms</button>
              {' '}and{' '}
              <button onClick={handlePrivacyClick} className="text-[#0C3C01] hover:underline">Privacy</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}