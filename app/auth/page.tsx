'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { signUp, signIn, signInWithGoogle, signInWithApple } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
    setSuccess(''); // Clear success when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const result = await signIn(formData.email, formData.password);
        if (result.user) {
          setSuccess('Successfully signed in! Redirecting...');
          setTimeout(() => {
            router.push('/'); // Redirect to home after successful login
          }, 1000);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        const result = await signUp(formData.email, formData.password, formData.name);
        if (result.user) {
          if (result.user.email_confirmed_at) {
            setSuccess('Account created successfully! You can now sign in.');
            setIsLogin(true);
          } else {
            setSuccess('Account created! Please check your email for verification.');
          }
        }
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setOauthLoading('google');
    setError('');
    
    try {
      await signInWithGoogle();
      // The redirect will be handled by Supabase
    } catch (error: any) {
      console.error('Google auth error:', error);
      setError(error.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setOauthLoading(null);
    }
  };

  const handleAppleAuth = async () => {
    setOauthLoading('apple');
    setError('');
    
    try {
      await signInWithApple();
      // The redirect will be handled by Supabase
    } catch (error: any) {
      console.error('Apple auth error:', error);
      setError(error.message || 'Failed to sign in with Apple. Please try again.');
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md px-4">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Auth Container */}
        <div className="p-8 border border-gray-700 rounded-lg bg-black">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="overspray-title text-white text-3xl lg:text-4xl mb-4">
              {isLogin ? 'SIGN IN' : 'SIGN UP'}
            </h1>
            <p className="text-gray-300">
              {isLogin 
                ? 'Welcome back to Khorosan' 
                : 'Join the Khorosan community'
              }
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-700 rounded text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-3 bg-green-900/50 border border-green-700 rounded text-green-300 text-sm">
              {success}
            </div>
          )}

          {/* Social Authentication */}
          <div className="space-y-4 mb-8">
            <Button
              onClick={handleGoogleAuth}
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-white hover:text-black transition-all duration-200 py-3"
              disabled={loading || oauthLoading !== null}
            >
              {oauthLoading === 'google' ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
                  Connecting...
                </div>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <Button
              onClick={handleAppleAuth}
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-white hover:text-black transition-all duration-200 py-3"
              disabled={loading || oauthLoading !== null}
            >
              {oauthLoading === 'apple' ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
                  Connecting...
                </div>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Continue with Apple
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-black text-gray-400">OR</span>
            </div>
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="pl-10 bg-black border-gray-600 text-white placeholder-gray-400 py-3"
                  disabled={loading || oauthLoading !== null}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="pl-10 bg-black border-gray-600 text-white placeholder-gray-400 py-3"
                disabled={loading || oauthLoading !== null}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="pl-10 pr-10 bg-black border-gray-600 text-white placeholder-gray-400 py-3"
                disabled={loading || oauthLoading !== null}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                disabled={loading || oauthLoading !== null}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                  className="pl-10 bg-black border-gray-600 text-white placeholder-gray-400 py-3"
                  disabled={loading || oauthLoading !== null}
                />
              </div>
            )}

            {isLogin && (
              <div className="flex justify-end">
                <Link href="/auth/forgot-password" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Forgot Password?
                </Link>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full btn-primary py-3 text-sm uppercase tracking-wider"
              disabled={loading || oauthLoading !== null}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current mr-3"></div>
                  Loading...
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>

          {/* Toggle Auth Mode */}
          <div className="text-center mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-300">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setSuccess('');
                }}
                className="ml-2 text-white hover:text-gray-300 transition-colors font-medium underline"
                disabled={loading || oauthLoading !== null}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Debug Info */}
          <div className="mt-6 p-4 bg-gray-900 rounded text-sm text-gray-300">
            <p className="font-medium mb-2">Test Account:</p>
            <p>Email: test@example.com</p>
            <p>Password: password123</p>
            <p className="text-xs text-gray-400 mt-2">
              Or create a new account to get started
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}