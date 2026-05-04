'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import loginImge from './../../assets/login-image.png';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
        {
          email: email,
          password: password,
        }
      );

      console.log('=== LOGIN RESPONSE ===');
      console.log('Full response:', response);
      console.log('response.data:', response.data);
      
      const { data } = response.data;
      
      console.log('Extracted data:', data);
      console.log('data.user:', data.user);
      console.log('data.user.role:', data.user?.role);
      console.log('data.token:', data.token);

      // Store auth data consistently for all users
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Store business owner data if available
      if (data.business) {
        localStorage.setItem('userBusiness', JSON.stringify(data.business));
      }

      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      } else {
        localStorage.removeItem('rememberEmail');
      }

      setSuccess(true);

      console.log('Login successful, user data:', data.user);
      console.log('User role:', data.user.role);

      setTimeout(() => {
        console.log('Attempting redirect for role:', data.user.role);
        
        switch (data.user.role) {
          case 'business_admin':
            console.log('Redirecting to /dashboard');
            router.push('/dashboard');
            break;
          case 'customer':
            console.log('Redirecting to /home');
            router.push('/home');
            break;
          case 'seller':
            console.log('Redirecting to /seller/dashboard');
            router.push('/seller/dashboard');
            break;
          case 'super_admin':
          case 'admin':
            console.log('Redirecting to /admin/dashboard');
            router.push('/admin/dashboard');
            break;
          default:
            console.log('Unknown role, redirecting to /home');
            router.push('/home');
        }
      }, 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.';

      // Check if email verification is required
      if (errorMessage.toLowerCase().includes('verify your email') ||
          errorMessage.toLowerCase().includes('email not verified')) {
        setError('Please verify your email first. Redirecting...');
        setLoading(false);

        setTimeout(() => {
          router.push(`/verify-email?email=${encodeURIComponent(email)}`);
        }, 1500);
        return;
      }

      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bright font-body text-on-surface antialiased flex items-center justify-center p-4">
      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-2xl shadow-primary/10 min-h-[650px]">
        {/* Left Side: Login Form */}
        <section className="flex flex-col justify-center px-8 md:px-16 py-12 relative z-10 bg-white">
          <div className="mb-10 flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                storefront
              </span>
            </div>
            <span className="font-headline text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              LocalBiz
            </span>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="font-headline text-3xl font-bold text-on-surface tracking-tight">
              Welcome Back
            </h1>
            <p className="text-on-surface-variant text-base">
              Enter your credentials to access your Digital Atelier.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error rounded-xl">
              <p className="text-error font-semibold text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-xl">
              <p className="text-green-700 font-semibold text-sm">
                Login successful! Redirecting...
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="floating-label-group">
              <input
                type="email"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-4 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl focus:border-primary focus:ring-0 outline-none transition-all text-on-surface"
                required
              />
              <label
                htmlFor="email"
                className="text-on-surface-variant font-label font-semibold"
              >
                Email Address
              </label>
            </div>

            <div className="floating-label-group">
              <input
                type="password"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-4 bg-surface-container-lowest border-2 border-surface-container-high rounded-xl focus:border-primary focus:ring-0 outline-none transition-all text-on-surface"
                required
              />
              <label
                htmlFor="password"
                className="text-on-surface-variant font-label font-semibold"
              >
                Password
              </label>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded border-surface-container-high text-primary focus:ring-primary/20"
                />
                <span className="text-on-surface-variant group-hover:text-primary transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                href="/forgot-password"
                className="text-primary font-semibold hover:underline decoration-2 underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="cursor-pointer w-full h-14 bg-blue-600 text-white font-headline font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-transform flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Spinner size="md" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined text-xl">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-surface-container flex flex-col gap-4">
            <p className="text-center text-sm text-on-surface-variant">
              Don't have an account?{' '}
              <Link href="/register" className="text-primary font-bold hover:underline">
                Start free trial
              </Link>
            </p>
          </div>
        </section>

        {/* Right Side: Editorial Pattern (Hidden on Mobile) */}
        <section className="hidden md:flex relative items-center justify-center bg-surface-container-low overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src={loginImge.src}
              alt="Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-secondary/60 mix-blend-multiply"></div>
          </div>

          {/* Floating Shapes */}
          {/* <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 backdrop-blur-2xl rounded-full border border-white/10"></div> */}
          <div className="absolute bottom-20 -left-10 w-48 h-48 bg-white/5 backdrop-blur-3xl rounded-full border border-white/5"></div>
        </section>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-6 left-0 w-full flex justify-center px-4">
        <nav className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-on-surface-variant font-label text-xs font-semibold text-center">
          <Link href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Contact Support
          </Link>
        </nav>
      </footer>
    </div>
  );
}
